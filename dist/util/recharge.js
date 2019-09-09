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
const RECHARGE_API_TOKEN = '1205a8f93fbe6e78af79993ed7877573a4c60a8038bb31d294f0f5e8';
/**
 * data (Discount): array of:
 * - 0: Name
 * - 1: Value
 * - 2: Value Type
 * - 3: Times Used In Total
 * - 4: Usage Limit Per Code
 * - 5: Status
 * - 6: Start
 * - 7: End
 */
// https://developer.rechargepayments.com/#create-discount
exports.mapShipifyCsvDiscountToRechargeDiscount = (data) => {
    const usageLimit = data[4];
    const startsAt = data[6] ? data[6].split(' ')[0] : null;
    const endsAt = data[7] ? data[7].split(' ')[0] : null;
    return {
        code: data[0],
        value: Math.abs(Number(data[1])),
        discount_type: data[2],
        duration: usageLimit ? 'usage_limit' : 'forever',
        duration_usage_limit: usageLimit ? Number(usageLimit) : null,
        status: 'enabled',
        starts_at: startsAt,
        ends_at: endsAt
    };
};
exports.addDiscounts = (discounts) => __awaiter(void 0, void 0, void 0, function* () {
    let promises = [];
    let total = 0;
    const maxPromises = 20;
    for (const discount of discounts) {
        promises.push(postDiscount(discount));
        if (promises.length > maxPromises) {
            yield Promise.all(promises);
            promises = [];
            total += maxPromises;
            console.log(`Progress total: ${total}`);
        }
    }
    yield Promise.all(promises);
});
exports.deleteAllDiscounts = () => __awaiter(void 0, void 0, void 0, function* () {
    let isData = true;
    let page = 1;
    while (isData) {
        const { discounts } = yield getAllDiscounts(page);
        if (!discounts.length) {
            isData = false;
            continue;
        }
        for (const d of discounts) {
            yield disableDiscount(d.id);
            yield deleteDiscount(d.id);
        }
        page += 1;
    }
});
const disableDiscount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield node_fetch_1.default(`https://api.rechargeapps.com/discounts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                status: 'fully_disabled'
            }),
            headers: {
                'x-recharge-access-token': RECHARGE_API_TOKEN
            },
        });
        return res.json();
    }
    catch (err) {
        console.log('disableDiscount ERROR', err);
    }
});
const deleteDiscount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield node_fetch_1.default(`https://api.rechargeapps.com/discounts/${id}`, {
            method: 'DELETE',
            headers: {
                'x-recharge-access-token': RECHARGE_API_TOKEN
            },
        });
        return res;
    }
    catch (err) {
        console.log('deleteDiscount ERROR', err);
    }
});
const getAllDiscounts = (page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield node_fetch_1.default(`https://api.rechargeapps.com/discounts?page=${page}`, {
            method: 'GET',
            headers: {
                'x-recharge-access-token': RECHARGE_API_TOKEN
            },
        });
        return res.json();
    }
    catch (err) {
        console.log('getAllDiscounts ERROR', err);
    }
});
const postDiscount = (discount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield node_fetch_1.default('https://api.rechargeapps.com/discounts', {
            method: 'post',
            body: JSON.stringify(discount),
            headers: {
                'Content-Type': 'application/json',
                'x-recharge-access-token': RECHARGE_API_TOKEN
            },
        });
        return res.json();
    }
    catch (err) {
        console.log('postDiscount ERROR', err);
    }
});
//# sourceMappingURL=recharge.js.map