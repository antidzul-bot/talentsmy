// Script to seed real campaign data from previous jobs
// Run this in browser console on the admin page

const realCampaignData = [
    {
        clientName: "PERFUME USTAZ SHUAIB HUSSAIN",
        productName: "Perfume Ustaz Shuaib Hussain",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "DOUGHLAB",
        productName: "Doughlab",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "BAKESHOP",
        productName: "Bakeshop",
        affiliateCount: 50,
        totalVideos: 50,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "BABYCARE",
        productName: "Babycare",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "KEDAI KAIN BHG",
        productName: "Kedai Kain BHG",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SKINCARE PREMIUM",
        productName: "Skincare Premium",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SHAMIMI",
        productName: "Shamimi",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "PREMIUM SERUM SOLAT",
        productName: "Premium Serum Solat",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "TELEKUNG",
        productName: "Telekung",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "LETS SYRUP",
        productName: "Lets Syrup",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "ON PROGRESS"
    },
    {
        clientName: "THE CITY GARDEN",
        productName: "The City Garden",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "OPTICIA",
        productName: "Opticia",
        affiliateCount: 300,
        totalVideos: 600,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "ANTI LIPID PEMBUGAR SERAT",
        productName: "Anti Lipid Pembugar Serat",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SKINCARE LALA BEAUTY",
        productName: "Skincare Lala Beauty",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SLIMMING 300",
        productName: "Slimming 300",
        affiliateCount: 200,
        totalVideos: 400,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "TUDUNG",
        productName: "Tudung",
        affiliateCount: 300,
        totalVideos: 300,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "DR HAFIZ T",
        productName: "Dr Hafiz T",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "ON PROGRESS"
    },
    {
        clientName: "PERFUME",
        productName: "Perfume",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "REVIVE TIKTOK APP",
        productName: "Revive TikTok App",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SKINCARE PREMIUM",
        productName: "Skincare Premium 2",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "KEDAI KAIN BHG",
        productName: "Kedai Kain BHG 2",
        affiliateCount: 100,
        totalVideos: 100,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "KEDAI BAJU T SHIRT KALI KEDUA",
        productName: "Kedai Baju T-Shirt",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "ON SHIPMENT / PENDING CONTENT"
    },
    {
        clientName: "PERFUME",
        productName: "Perfume 2",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "PENDING CONTENT"
    },
    {
        clientName: "JATUH HANA",
        productName: "Jatuh Hana",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "SKINCARE PURECBERRY",
        productName: "Skincare Purecberry",
        affiliateCount: 100,
        totalVideos: 200,
        status: "DONE",
        progress: "SETTLE CONTRACT"
    },
    {
        clientName: "AMINO PROTEIN",
        productName: "Amino Protein",
        affiliateCount: 100,
        totalVideos: 200,
        status: "PENDING",
        progress: "PENDING / PENDING CONTRACT"
    },
    {
        clientName: "KACIP COFFEE",
        productName: "Kacip Coffee",
        affiliateCount: 100,
        totalVideos: 200,
        status: "PENDING",
        progress: "PENDING"
    },
    {
        clientName: "PERFUME USTAZ SHUAIB HUSSAIN",
        productName: "Perfume Ustaz Shuaib Hussain 2",
        affiliateCount: 100,
        totalVideos: 200,
        status: "PENDING",
        progress: "PENDING"
    },
    {
        clientName: "THE CAT FOOD",
        productName: "The Cat Food",
        affiliateCount: 100,
        totalVideos: 200,
        status: "PENDING",
        progress: "PENDING CONTRACT"
    }
];

// Function to create orders
function seedRealData() {
    const store = window.useStore?.getState();
    if (!store) {
        console.error('Store not found. Make sure you are on the admin page.');
        return;
    }

    let successCount = 0;

    realCampaignData.forEach((campaign, index) => {
        try {
            // Determine package based on affiliate count
            let packageId = 'pkg-100';
            let packageName = '100 Affiliates (Silver)';
            let priceClient = 2300;
            let priceSupplier = 1000;

            if (campaign.affiliateCount === 200) {
                packageId = 'pkg-200';
                packageName = '200 Affiliates (Gold)';
                priceClient = 4600;
                priceSupplier = 2000;
            } else if (campaign.affiliateCount === 300) {
                packageId = 'pkg-300';
                packageName = '300 Affiliates (Platinum)';
                priceClient = 5997;
                priceSupplier = 3000;
            }

            // Override price to RM2300 for 100 affiliate packages as per user request
            if (campaign.affiliateCount === 100) {
                priceClient = 2300;
            }

            const profit = priceClient - priceSupplier;

            // Map progress status
            const isDone = campaign.status === 'DONE';
            const progress = {
                clientPaid: isDone,
                supplierPaid: isDone,
                guidelinesApproved: isDone,
                agreementSigned: isDone,
                commissionSet: isDone,
                affiliatesSelected: isDone,
                briefingCompleted: isDone,
                samplesReceived: isDone,
                productionStarted: isDone,
                videosCompleted: isDone,
                reportSent: isDone,
            };

            const orderData = {
                clientName: campaign.clientName,
                clientEmail: `client${index + 1}@example.com`,
                clientPhone: '+60123456789',
                productName: campaign.productName,
                productLink: `https://example.com/product/${index + 1}`,
                packageId: packageId,
                packageName: packageName,
                priceClient: priceClient,
                priceSupplier: priceSupplier,
                profit: profit,
                status: campaign.status === 'DONE' ? 'COMPLETED' : 'IN_PROGRESS',
                progress: progress,
                notes: campaign.progress,
                affiliates: [],
                supplierId: undefined,
                supplierName: undefined,
                supplierPaymentStatus: isDone ? 'paid' : 'unpaid'
            };

            store.addOrder(orderData);
            successCount++;
        } catch (error) {
            console.error(`Error adding campaign ${campaign.clientName}:`, error);
        }
    });

    console.log(`✅ Successfully added ${successCount} campaigns!`);
    alert(`Successfully imported ${successCount} real campaign orders!`);
    window.location.reload();
}

// Run the seed function
seedRealData();
