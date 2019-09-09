"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CsvReader = require('promised-csv');
exports.readCSV = (inputFile) => {
    return new Promise((resolve, reject) => {
        var reader = new CsvReader();
        var output = [];
        reader.on('row', data => {
            output.push(data);
        });
        reader.on('done', () => {
            // output will be the compiled data set.
            resolve(output);
        });
        reader.on('error', err => reject(err));
        reader.read(inputFile);
    });
};
//# sourceMappingURL=csv-read.js.map