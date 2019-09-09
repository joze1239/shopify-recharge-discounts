const path = require("path");
import { readCSV } from "./util/csv-read";
import { mapShipifyCsvDiscountToRechargeDiscount, addDiscounts, deleteAllDiscounts, RechargeDiscount } from './util/recharge';
import { getShopifyDiscounts, collectionMap, productMap, variantsMap, ignoreMap } from './util/shopify';


const syncDiscounts = async (inputFile: string) => {
    console.log('start...');

    // Delete current recharge discounts
    
    try {
        await deleteAllDiscounts();
    } catch (err) {
        console.log(err);
    }
    
    

    // Read csv discounts
    let discountsCsv: any = await readCSV(inputFile);
    const rechargeDiscountsCsv = discountsCsv.map(disc => mapShipifyCsvDiscountToRechargeDiscount(disc));
    var discountsMap: Map<string, RechargeDiscount> = new Map(rechargeDiscountsCsv.map(i => [i.code, i]));

    const rechargeDiscounts = [];

    // Read discounts from Shopify API
    let page = 1;
    let isData = true;
    while (isData) {
        const discounts = await getShopifyDiscounts(page, 250);

        if (!discounts.price_rules || page > 5) {
            isData = false;
            continue;
        }
        for (const d of discounts.price_rules) {
            const createdDate = new Date(d.created_at);
            let skipDiscount = false;
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
                    return (element in collectionMap);
                });
                if (mapEl) {
                    collectionId = collectionMap[mapEl];
                }
            }
            else if (d.entitled_product_ids.length) {
                var mapEl = d.entitled_product_ids.find(function (element) {
                    return (element in productMap);
                });
                if (mapEl) {
                    collectionId = productMap[mapEl];
                }
                if(!mapEl && d.entitled_product_ids.some(r=> ignoreMap.includes(r))) {
                    skipDiscount = true;
                }
            }
            else if (d.entitled_variant_ids.length) {
                var mapEl = d.entitled_variant_ids.find(function (element) {
                    return (element in variantsMap);
                });
                if (mapEl) {
                    collectionId = variantsMap[mapEl];
                }

                if(!mapEl && d.entitled_variant_ids.some(r=> ignoreMap.includes(r))) {
                    skipDiscount = true;
                }
            }

            if (discountsMap.has(d.title) && !skipDiscount) {
                const rechargeDiscount = discountsMap.get(d.title);
                rechargeDiscount.applies_to_id = collectionId ? collectionId : null;
                rechargeDiscount.applies_to_resource = collectionId ? 'shopify_collection_id' : null;
                rechargeDiscounts.push(rechargeDiscount);
            }


        }
        await addDiscounts(rechargeDiscounts);
        page += 1;
    }

    // Add discounts to Recharge
    await addDiscounts(rechargeDiscounts);
    
    console.log('end');
}


const filePath = path.resolve("./data/discounts.csv");
syncDiscounts(filePath);