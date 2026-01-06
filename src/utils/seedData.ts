// This file is deprecated as we have migrated to Supabase.
// Keeping it for reference or potential future admin tools.

export const seedDemoData = async () => {
    console.log("Seeding is disabled in Supabase mode to protect production data.");
    return { trackingCode1: '' };
};

export const clearAllData = () => {
    // Local storage clearing is no longer relevant for data
    localStorage.removeItem('affiliate-management-storage');
    // window.location.reload(); 
    alert("Local cache cleared.");
};
