import fetch from 'node-fetch';

const SHOPIFY_API_URL = 'https://@eight-sleep.myshopify.com/admin/api/2019-07';
const SHOPIFY_API_TOKEN = 'NzI5MjFkN2QxY2RmZDkwNmY2NGMxMmUxNmUyZmMyMDM6NjcyZjNjYTNhODRkMzFiNzYzOTAyYjY0YjA2YzE1YjM=';


// Collection ids
const FOUNDATION_ID = 64765788207;
const SMARTBED_ID = 64765820975;
const ULTIMATE_PILLOW_ID = 64765853743;
const POD_ID = 64765886511;
const WATERPROOF_PROTECTOR_ID = 64765919279;
const GRAVITY_BLANKET_ID = 64765952047;

// site.eightsleep -> test-eight.myshopify
export const collectionMap = {
    33903804504: 453532548, // Accesories
    60371501144: 64600932399, // All Mattresses - Marketing
    426554691: 453532868, // Mattresses (NEW)
    367765635: 453532868, // Mattresses
    13247709224: 64601292847, // All Products Except Gift Card
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
    12376763170904: ULTIMATE_PILLOW_ID, // The Ultimate Pillow
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