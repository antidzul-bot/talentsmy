import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { logActivity } from '../utils/activityLogger';
import { Order, Supplier, DashboardStats, OrderProgress, CampaignPackage, User, AuthOTP } from '../types';

interface AppState {
    // Data
    orders: Order[];
    suppliers: Supplier[];
    packages: CampaignPackage[];
    isLoading: boolean;
    error: string | null;

    // Initialization
    initialize: () => Promise<void>;

    // Actions - Orders
    addOrder: (order: Omit<Order, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt'>) => Promise<string>;
    updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
    updateOrderProgress: (id: string, progress: Partial<OrderProgress>) => Promise<void>;
    updateSupplierProgress: (id: string, progress: Partial<Order['supplierProgress']>) => Promise<void>;
    deleteOrder: (id: string) => Promise<void>;
    getOrderByTrackingCode: (code: string) => Order | undefined;

    // Actions - Suppliers
    addSupplier: (supplier: Omit<Supplier, 'id'>) => Promise<void>;
    updateSupplier: (id: string, updates: Partial<Supplier>) => Promise<void>;
    deleteSupplier: (id: string) => Promise<void>;

    // Actions - Packages
    addPackage: (pkg: Omit<CampaignPackage, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
    updatePackage: (id: string, updates: Partial<CampaignPackage>) => Promise<void>;
    deletePackage: (id: string) => Promise<void>;

    // Auth
    currentUser: User | null;
    activeOTP: AuthOTP | null;
    login: (email: string) => Promise<string>;
    verifyOtp: (email: string, code: string) => Promise<boolean>;
    logout: () => void;

    // Computed
    getDashboardStats: () => DashboardStats;
    getSupplierOrders: (supplierId: string) => Order[];
}

// Helper function to generate tracking code
const generateTrackingCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Helper function to generate ID
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const useStore = create<AppState>((set, get) => ({
    orders: [],
    suppliers: [],
    packages: [],
    isLoading: false,
    error: null,
    currentUser: null, // Basic auth state remains local for session
    activeOTP: null,

    initialize: async () => {
        set({ isLoading: true });
        try {
            // Fetch Orders
            const { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
            if (ordersError) throw ordersError;
            // Handle possibility of data being empty or malformed
            const orders = ordersData ? ordersData.map((d: any) => d.data as Order) : [];

            // Fetch Suppliers
            const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select('*');
            if (suppliersError) throw suppliersError;
            const suppliers = suppliersData ? suppliersData.map((d: any) => d.data as Supplier) : [];

            // Fetch Packages
            const { data: packagesData, error: packagesError } = await supabase.from('packages').select('*');
            if (packagesError) {
                // Packages table might not exist yet, don't crash
                console.warn('Packages fetch error (might be empty):', packagesError);
            }
            const packages = packagesData ? packagesData.map((d: any) => d.data as CampaignPackage) : [];

            set({ orders, suppliers, packages, isLoading: false });

            // Subscribe to Realtime changes
            supabase.channel('public:data')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
                    const newOrderRow = payload.new as any;
                    const oldOrderRow = payload.old as any;

                    set((state) => {
                        if (payload.eventType === 'INSERT') return { orders: [...state.orders, newOrderRow.data] };
                        if (payload.eventType === 'UPDATE') return { orders: state.orders.map((o) => o.id === newOrderRow.id ? newOrderRow.data : o) };
                        if (payload.eventType === 'DELETE') return { orders: state.orders.filter((o) => o.id !== oldOrderRow.id) };
                        return state;
                    });
                })
                .subscribe();

        } catch (err: any) {
            console.error('Failed to initialize store:', err);
            set({ error: err.message, isLoading: false });
        }
    },

    addOrder: async (orderData) => {
        const trackingCode = generateTrackingCode();
        const id = generateId();
        const now = new Date().toISOString();

        const defaultProgress: OrderProgress = {
            clientPaid: false,
            supplierPaid: false,
            guidelinesApproved: false,
            agreementSigned: false,
            commissionSet: false,
            affiliatesSelected: false,
            briefingCompleted: false,
            samplesReceived: false,
            productionStarted: false,
            videosCompleted: false,
            reportSent: false,
        };

        const defaultSupplierProgress = {
            affiliatesSubmitted: false,
            briefingCompleted: false,
            samplesReceivedByAffiliates: false,
            productionStarted: false,
            allVideosCompleted: false,
            reportSubmitted: false,
        };

        const newOrder: Order = {
            ...orderData,
            id,
            trackingCode,
            createdAt: now,
            updatedAt: now,
            status: orderData.status || 'PENDING_PAYMENT',
            affiliates: orderData.affiliates || [],
            progress: orderData.progress || defaultProgress,
            supplierProgress: orderData.supplierProgress || defaultSupplierProgress,
            supplierPaymentStatus: orderData.supplierPaymentStatus || 'unpaid',
            // Ensure defaults to prevent crashes
            accountManager: "Agency Owner",
            packageType: orderData.packageType || "100_AFFILIATES",
            totalVideos: orderData.totalVideos || 100,
            specialRequests: orderData.specialRequests || "",
            compliance: {
                commissionSet: true,
                termsAcknowledged: true,
                verbalBriefing: true,
                shippingAcknowledged: true,
                contentGuidelinesProvided: true
            }
        };

        // Upload to Supabase
        const { error } = await supabase.from('orders').insert({
            id,
            tracking_code: trackingCode,
            data: newOrder
        });

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        // Optimistic update
        set((state) => ({ orders: [...state.orders, newOrder] }));

        // Log activity
        await logActivity({
            action_type: 'ORDER_CREATE',
            action_description: `Created order for ${newOrder.clientName}`,
            related_entity_type: 'ORDER',
            related_entity_id: id,
            metadata: { trackingCode, clientName: newOrder.clientName }
        });

        return trackingCode;
    },

    updateOrder: async (id, updates) => {
        const state = get();
        const orderIndex = state.orders.findIndex((o) => o.id === id);
        if (orderIndex === -1) return;

        const updatedOrder = {
            ...state.orders[orderIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // Optimistic update
        set((state) => ({
            orders: state.orders.map((o) => o.id === id ? updatedOrder : o)
        }));

        // DB Update
        await supabase.from('orders').update({
            data: updatedOrder,
            updated_at: new Date().toISOString()
        }).eq('id', id);

        // Log activity
        await logActivity({
            action_type: 'ORDER_UPDATE',
            action_description: `Updated order ${updatedOrder.trackingCode}`,
            related_entity_type: 'ORDER',
            related_entity_id: id,
            metadata: { updates: Object.keys(updates) }
        });
    },

    updateOrderProgress: async (id, progress) => {
        const order = get().orders.find((o) => o.id === id);
        if (order) {
            await get().updateOrder(id, { progress: { ...order.progress, ...progress } });
        }
    },

    updateSupplierProgress: async (id, progress) => {
        const order = get().orders.find((o) => o.id === id);
        if (order) {
            await get().updateOrder(id, { supplierProgress: { ...order.supplierProgress, ...progress } });
        }
    },

    deleteOrder: async (id) => {
        set((state) => ({ orders: state.orders.filter((o) => o.id !== id) }));
        await supabase.from('orders').delete().eq('id', id);

        // Log activity
        await logActivity({
            action_type: 'ORDER_DELETE',
            action_description: `Deleted order`,
            related_entity_type: 'ORDER',
            related_entity_id: id
        });
    },

    getOrderByTrackingCode: (code) => {
        return get().orders.find((order) => order.trackingCode === code);
    },

    // Suppliers
    addSupplier: async (supplierData) => {
        const id = generateId();
        const newSupplier: Supplier = { ...supplierData, id };

        set((state) => ({ suppliers: [...state.suppliers, newSupplier] }));
        await supabase.from('suppliers').insert({ id, data: newSupplier });
    },

    updateSupplier: async (id, updates) => {
        const supplier = get().suppliers.find((s) => s.id === id);
        if (!supplier) return;
        const newSupplier = { ...supplier, ...updates };

        set((state) => ({ suppliers: state.suppliers.map((s) => s.id === id ? newSupplier : s) }));
        await supabase.from('suppliers').update({ data: newSupplier }).eq('id', id);
    },

    deleteSupplier: async (id) => {
        set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) }));
        await supabase.from('suppliers').delete().eq('id', id);
    },

    // Packages
    addPackage: async (pkgData) => {
        const id = generateId();
        const newPkg: CampaignPackage = {
            ...pkgData,
            id,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        set((state) => ({ packages: [...state.packages, newPkg] }));
        await supabase.from('packages').insert({ id, data: newPkg });
    },

    updatePackage: async (id, updates) => {
        const pkg = get().packages.find((p) => p.id === id);
        if (!pkg) return;
        const newPkg = { ...pkg, ...updates, updatedAt: new Date().toISOString() };

        set((state) => ({ packages: state.packages.map((p) => p.id === id ? newPkg : p) }));
        await supabase.from('packages').update({ data: newPkg }).eq('id', id);
    },

    deletePackage: async (id) => {
        set((state) => ({ packages: state.packages.filter((p) => p.id !== id) }));
        await supabase.from('packages').delete().eq('id', id);
    },

    // Auth
    login: async (email) => {
        const otp = '123456';
        set({
            activeOTP: { email, code: otp, expiresAt: Date.now() + 300000 }
        });
        return otp;
    },

    verifyOtp: async (email, code) => {
        const { activeOTP, suppliers } = get();
        if (activeOTP && activeOTP.email === email && activeOTP.code === code) {
            let user: User;
            const supplier = suppliers.find((s) => s.email.toLowerCase() === email.toLowerCase());

            if (email.toLowerCase().includes('admin') || email.toLowerCase().includes('owner')) {
                user = { id: 'admin-1', name: 'Agency Owner', email, role: 'OWNER' };
            } else if (email.toLowerCase().includes('miera')) {
                user = { id: 'miera-temp', name: 'MIERA LEGACY', email, role: 'SUPPLIER', supplierId: 'miera-temp' };
            } else if (supplier) {
                user = { id: supplier.id, name: supplier.name, email, role: 'SUPPLIER', supplierId: supplier.id };
            } else {
                user = { id: 'staff-' + Date.now(), name: 'Agency Staff', email, role: 'STAFF' };
            }

            set({ currentUser: user, activeOTP: null });
            return true;
        }
        return false;
    },

    logout: () => {
        localStorage.removeItem('currentUser');

        // Log logout (before clearing user)
        logActivity({
            action_type: 'LOGOUT',
            action_description: 'User logged out'
        }).catch(console.error);

        set({ currentUser: null });
    },

    getDashboardStats: () => {
        const orders = get().orders;
        const totalRevenue = orders.filter((o) => o.progress.clientPaid).reduce((sum, o) => sum + (o.priceClient || 0), 0);
        const totalProfit = orders.filter((o) => o.progress.clientPaid).reduce((sum, o) => sum + (o.profit || 0), 0);
        const activeOrders = orders.filter((o) => o.status !== 'COMPLETED').length;
        const completedOrders = orders.filter((o) => o.status === 'COMPLETED').length;
        const pendingPayments = orders.filter((o) => !o.progress.clientPaid).length;
        return { totalRevenue, totalProfit, activeOrders, completedOrders, pendingPayments };
    },

    getSupplierOrders: (supplierId) => get().orders.filter((o) => o.supplierId === supplierId)
}));
