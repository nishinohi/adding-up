'use strict';

const fs = require(`fs`);
const readline = require(`readline`);
const rs = fs.createReadStream(`./popu-pref.csv`);
// const rs = fs.createReadStream(`./workspace/adding-up/popu-pref.csv`);
const rl = readline.createInterface({ 'input': rs, 'output': {} });
const prefectureDataMap = new Map();
rl.on('line', (lineString) => {
    const columns = lineString.split(',');
    const year = parseInt(columns[0]);
    const prefecture = columns[1];
    const population = parseInt(columns[2]);
    if (year === 2010 || year === 2015) {
        let value = prefectureDataMap.get(prefecture);
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            };
        }
        if (year === 2010) { value.popu10 = population; }
        if (year === 2015) { value.popu15 = population; }
        prefectureDataMap.set(prefecture, value);
    }
});
rl.on(`close`, () => {
    prefectureDataMap.forEach((value) => {
        value.change = value.popu15 / value.popu10 * 100;
    });
    const ranking = Array.from(prefectureDataMap).sort((pair1, pair2) => {
        return pair1[1].change - pair2[1].change;
        // return pair2[1].change - pair1[1].change;
    });
    const rankingOut = ranking.map((rankData, rank) => {
        return `${rank + 1}位：${rankData[0]}: ${rankData[1].popu10} => ${rankData[1].popu15} 変化率:${rankData[1].change}`
    });
    console.log(rankingOut);
})