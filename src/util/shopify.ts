import fetch from 'node-fetch';


const SHOPIFY_API_URL = 'https://@eight-sleep.myshopify.com/admin/api/2019-07';
const SHOPIFY_API_TOKEN = 'NzI5MjFkN2QxY2RmZDkwNmY2NGMxMmUxNmUyZmMyMDM6NjcyZjNjYTNhODRkMzFiNzYzOTAyYjY0YjA2YzE1YjM=';


// Collection ids
const FOUNDATION_ID = 150315171928;
const SMARTBED_ID = 150315204696;
const ULTIMATE_PILLOW_ID = 150315303000;
const POD_ID = 150315335768;
const WATERPROOF_PROTECTOR_ID = 150315466840;
const GRAVITY_BLANKET_ID = 150315565144;

// site.eightsleep -> test-eight.myshopify
export const collectionMap = {
    33903804504: 33903804504, // Accesories
    60371501144: 60371501144, // All Mattresses - Marketing
    426554691: 426554691, // Mattresses (NEW)
    367765635: 367765635, // Mattresses
    13247709224: 13247709224, // All Products Except Gift Card
}

export const productMap = {
    2060624330840: POD_ID, // Pod
    3870201512024: GRAVITY_BLANKET_ID, // Gravity Blanket
    1318230884440: ULTIMATE_PILLOW_ID, // Ultimate Pillow
    1958528974936: SMARTBED_ID, // Smart bed
    756437385304:  WATERPROOF_PROTECTOR_ID, // Waterproof Protector
    10743656387:  FOUNDATION_ID, // Foundation
}

export const variantsMap = {
    43090462467: FOUNDATION_ID, // Foundation
    43090462531: FOUNDATION_ID,
    43090462595: FOUNDATION_ID,
    43090462659: FOUNDATION_ID,
    19636502954072: SMARTBED_ID, // Smart bed
    19636502986840: SMARTBED_ID,
    19636503019608: SMARTBED_ID,
    19636503052376: SMARTBED_ID,
    42141362307: ULTIMATE_PILLOW_ID, // The Ultimate Pillow
    3633914413096: ULTIMATE_PILLOW_ID,
    20336740106328: POD_ID,
    20519246004312: POD_ID,
}

export const ignoreMap = [
    20194214019160, // Eight x Mint House - variant
    2034425135192,  // Eight x Mint House - prod
    10755116995, // juputer
    10755230531, 
    10755141251, // mars
    10755245379,
    1389117636696, // venus
    1353441476696, // the adjustable base
    9444978627, // The Sleep Tracker
]


export const getShopifyDiscounts = async (page: number, limit = 20) => {
    try {
        const res = await fetch(`${SHOPIFY_API_URL}/price_rules.json?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${SHOPIFY_API_TOKEN}`
            },
        });
        return res.json();
    } catch (err) {
        console.log('getShopifyDiscounts ERROR', err);
    }
}