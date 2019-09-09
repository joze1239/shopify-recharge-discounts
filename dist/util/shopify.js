"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const SHOPIFY_API_URL = 'https://@eight-sleep.myshopify.com/admin/api/2019-07';
const SHOPIFY_API_TOKEN = 'NzI5MjFkN2QxY2RmZDkwNmY2NGMxMmUxNmUyZmMyMDM6NjcyZjNjYTNhODRkMzFiNzYzOTAyYjY0YjA2YzE1YjM=';
// 'ZGRjNzZiZDA3OTA2ZGMwMTAxNjczY2NkYTU1NzEyNTc6Y2Y0MzFhZGJmODBlMzc2YmY5MTg1NDA3NTNkYmQ3MmQ=';//
const FOUNDATION_ID = 64765788207;
const SMARTBED_ID = 64765820975;
const ULTIMATE_PILLOW_ID = 64765853743;
const POD_ID = 64765886511;
const WATERPROOF_PROTECTOR_ID = 64765919279;
const GRAVITY_BLANKET_ID = 64765952047;
// site.eightsleep -> test-eight.myshopify
exports.collectionMap = {
    33903804504: 453532548,
    60371501144: 64600932399,
    426554691: 453532868,
    367765635: 453532868,
    13247709224: 64601292847,
};
exports.productMap = {
    2060624330840: POD_ID,
    3870201512024: GRAVITY_BLANKET_ID,
    1318230884440: ULTIMATE_PILLOW_ID,
    1958528974936: SMARTBED_ID,
    756437385304: WATERPROOF_PROTECTOR_ID,
    10743656387: FOUNDATION_ID,
};
exports.variantsMap = {
    43090462467: FOUNDATION_ID,
    43090462531: FOUNDATION_ID,
    43090462595: FOUNDATION_ID,
    43090462659: FOUNDATION_ID,
    19636502954072: SMARTBED_ID,
    19636502986840: SMARTBED_ID,
    19636503019608: SMARTBED_ID,
    19636503052376: SMARTBED_ID,
    12376763170904: ULTIMATE_PILLOW_ID,
    3633914413096: ULTIMATE_PILLOW_ID,
    20336740106328: POD_ID,
    20519246004312: POD_ID,
};
exports.ignoreMap = [
    20194214019160,
    2034425135192,
    10755116995,
    10755230531,
    10755141251,
    10755245379,
    1389117636696,
    1353441476696,
    9444978627,
];
exports.getShopifyDiscounts = (page, limit = 20) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield node_fetch_1.default(`${SHOPIFY_API_URL}/price_rules.json?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${SHOPIFY_API_TOKEN}`
            },
        });
        return res.json();
    }
    catch (err) {
        console.log('getShopifyDiscounts ERROR', err);
    }
});
//# sourceMappingURL=shopify.js.map