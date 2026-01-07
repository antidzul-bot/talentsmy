export type OrderStatus = 'PENDING_PAYMENT' | 'PAID' | 'AFFILIATES_SUBMITTED' | 'SAMPLES_SHIPPED' | 'PRODUCTION_STARTED' | 'COMPLETED' | 'CANCELLED';

export type PackageType = '100_AFFILIATES' | '200_AFFILIATES' | '300_AFFILIATES' | '600_AFFILIATES' | 'CUSTOM';

export interface CampaignPackage {
    id: string;
    name: string;
    affiliateCount: number;
    videoCountPerAffiliate: number;
    totalVideos: number;
    originalPrice: number;
    currentPrice: number;
    commissionRate: number;
    supplierCost: number;
    description: string;
    imagePath?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Affiliate {
    id: string;
    name: string;
    tiktokHandle: string;
    profileUrl?: string;
    sampleReceived: boolean;
    videoCompleted: boolean;
    videoUrl?: string;
}

export interface OrderNote {
    id: string;
    orderId: string;
    content: string;
    createdBy: string; // user email
    createdByName: string; // user name
    createdAt: string;
    updatedAt?: string;
}

export interface StatusHistoryEntry {
    id: string;
    orderId: string;
    field: string; // What was changed
    oldValue: string;
    newValue: string;
    changedBy: string; // user email
    changedByName: string; // user name
    changedAt: string;
}

export interface OrderProgress {
    // Client Steps
    clientPaid: boolean;
    clientPaidDate?: string;

    // Admin Steps
    supplierPaid: boolean;
    supplierPaidDate?: string;
    guidelinesApproved: boolean;
    guidelinesApprovedDate?: string;
    agreementSigned: boolean;
    commissionSet: boolean;

    // Supplier Steps
    affiliatesSelected: boolean;
    affiliatesSelectedDate?: string;
    briefingCompleted: boolean;
    briefingCompletedDate?: string;
    samplesReceived: boolean;
    samplesReceivedDate?: string;
    productionStarted: boolean;
    productionStartDate?: string;
    videosCompleted: boolean;
    videosCompletedDate?: string;
    reportSent: boolean;
    reportSentDate?: string;
}

export interface Order {
    id: string;
    trackingCode: string;

    // Account Management
    accountManager: string; // Person in charge for this client

    // Client Info
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    productName: string;
    productDescription: string;
    productTikTokLink?: string; // Client's TikTok product link

    // Payment Info
    paymentReceiptUrl?: string; // URL or file path to receipt
    paymentReceiptNumber?: string; // Receipt reference number

    // Special Requests
    specialRequests?: string; // Any special requests from client

    // Package Info
    packageId?: string;
    packageType: string;
    affiliateCount: number;
    videoCountPerAffiliate?: number;
    totalVideos?: number;
    priceClient: number;
    priceDiscount?: number; // Discount in RM applied to currentPrice
    costSupplier: number;
    profit: number;
    commissionRate?: number; // e.g. 10 for 10%

    // Assignment
    supplierId?: string;
    supplierName?: string;

    // Compliance Checklist
    compliance: {
        commissionSet: boolean; // Client set 10% affiliate commission
        termsAcknowledged: boolean; // Client aware cannot directly contact affiliates
        verbalBriefing: boolean; // Client briefed verbally about T&C
        shippingAcknowledged: boolean; // Client knows must ship products to affiliates
        contentGuidelinesProvided: boolean; // Content guidelines provided to client
    };

    // Status
    status: OrderStatus;
    progress: OrderProgress;

    // Supplier Progress Tracking
    supplierProgress: {
        affiliatesSubmitted: boolean;
        affiliatesSubmittedDate?: string;
        affiliateSheetUrl?: string; // Google Sheets link
        affiliateSheetChecklist?: {
            linkAccessible: boolean;
            countMatches: boolean;
            allColumnsComplete: boolean;
            affiliatesSuitable: boolean;
        };

        briefingCompleted: boolean;
        briefingCompletedDate?: string;

        samplesReceivedByAffiliates: boolean;
        samplesReceivedByAffiliatesDate?: string;

        productionStarted: boolean;
        productionStartDate?: string;
        videoStartDate?: string; // When affiliates will start making videos
        videoDeadline?: string; // When videos must be completed

        allVideosCompleted: boolean;
        allVideosCompletedDate?: string;

        reportSubmitted: boolean;
        reportSubmittedDate?: string;
        reportUrl?: string;
    };

    // Data
    affiliates: Affiliate[];
    contentGuidelines?: string;
    reportUrl?: string;
    notes?: OrderNote[]; // Changed from string to OrderNote array
    statusHistory?: StatusHistoryEntry[];

    // Payment status for supplier
    supplierPaymentStatus: 'unpaid' | 'pending_verification' | 'verified' | 'disputed';
    supplierPaymentDate?: string;
    supplierPaymentProofUrl?: string;
    supplierPaymentVerifiedDate?: string;

    // Shipment proof from client
    clientShipmentProofUrl?: string;

    // Timestamps
    createdAt: string;
    updatedAt: string;
}

export interface Supplier {
    id: string;
    name: string;
    email: string;
    phone: string;
    active: boolean;

    // Additional Details
    companyName?: string;
    address?: string;

    // Backup Contact
    backupContactName?: string;
    backupContactEmail?: string;
    backupContactPhone?: string;

    // Business Info
    businessRegistrationNumber?: string;
    bankAccountNumber?: string;
    bankName?: string;

    // Notes
    notes?: string;

    // Timestamps
    updatedAt?: string;
}

export type UserRole = 'OWNER' | 'STAFF' | 'SUPPLIER';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    supplierId?: string; // If role is SUPPLIER
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

export interface AuthOTP {
    email: string;
    code: string;
    expiresAt: number;
}

export interface DashboardStats {
    totalRevenue: number;
    totalProfit: number;
    activeOrders: number;
    completedOrders: number;
    pendingPayments: number;
}
