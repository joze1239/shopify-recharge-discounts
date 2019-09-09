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
const path = require("path");
const csv_read_1 = require("./util/csv-read");
const recharge_1 = require("./util/recharge");
const shopify_1 = require("./util/shopify");
/*
const syncDiscounts = async (inputFile: string) => {
    console.log('start...');
    let discounts: any = await readCSV(inputFile);
    discounts = discounts.slice(0, 50);
  

    const rechargeDiscounts = discounts.map(disc => mapShipifyDiscountToRechargeDiscount(disc));
    await addDiscounts(rechargeDiscounts);
    console.log('end');
}

const filePath = path.resolve("./data/discounts.csv");
syncDiscounts(filePath);

*/
const syncDiscounts = (inputFile) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('start...');
    // Delete current recharge discounts
    try {
        yield recharge_1.deleteAllDiscounts();
    }
    catch (err) {
        console.log(err);
    }
    // Read csv discounts
    let discountsCsv = yield csv_read_1.readCSV(inputFile);
    const rechargeDiscountsCsv = discountsCsv.map(disc => recharge_1.mapShipifyCsvDiscountToRechargeDiscount(disc));
    var discountsMap = new Map(rechargeDiscountsCsv.map(i => [i.code, i]));
    const rechargeDiscounts = [];
    // Read discounts from Shopify API
    let page = 1;
    let isData = true;
    while (isData) {
        const discounts = yield shopify_1.getShopifyDiscounts(page, 250);
        if (!discounts.price_rules || page > 1) {
            isData = false;
            continue;
        }
        for (const d of discounts.price_rules) {
            const createdDate = new Date(d.created_at);
            if (createdDate.getFullYear() < 2018) {
                continue;
            }
            if (d.ends_at) {
                const dDate = new Date(d.ends_at);
                const currentDate = new Date();
                if (dDate < currentDate) {
                    continue;
                }
            }
            let collectionId = null;
            if (d.entitled_collection_ids.length) {
                var mapEl = d.entitled_collection_ids.find(function (element) {
                    return (element in shopify_1.collectionMap);
                });
                if (mapEl) {
                    collectionId = shopify_1.collectionMap[mapEl];
                }
            }
            else if (d.entitled_product_ids.length) {
                var mapEl = d.entitled_product_ids.find(function (element) {
                    return (element in shopify_1.productMap);
                });
                if (mapEl) {
                    collectionId = shopify_1.productMap[mapEl];
                }
            }
            else if (d.entitled_variant_ids.length) {
                var mapEl = d.entitled_variant_ids.find(function (element) {
                    return (element in shopify_1.variantsMap);
                });
                if (mapEl) {
                    collectionId = shopify_1.variantsMap[mapEl];
                }
            }
            if (discountsMap.has(d.title)) {
                const rechargeDiscount = discountsMap.get(d.title);
                rechargeDiscount.applies_to_id = collectionId ? collectionId : null;
                rechargeDiscount.applies_to_resource = collectionId ? 'shopify_collection_id' : null;
                rechargeDiscounts.push(rechargeDiscount);
            }
        }
        yield recharge_1.addDiscounts(rechargeDiscounts);
        page += 1;
    }
    yield recharge_1.addDiscounts(rechargeDiscounts);
    /*const rechargeDiscounts = discounts.map(disc => mapShipifyDiscountToRechargeDiscount(disc));
    await addDiscounts(rechargeDiscounts);;*/
    console.log('end');
});
const filePath = path.resolve("./data/discounts.csv");
syncDiscounts(filePath);
//# sourceMappingURL=index.js.map