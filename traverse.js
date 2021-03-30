const path = require("path");
const fs  = require("fs");
const util = require('util');
let files  = [];

regexTxt = /(.txt)$/

function recDirectoryTraverse(dir) {
    fs.readdirSync(dir).forEach(file => {
        const absPath = path.join(dir, file);
        if (fs.statSync(absPath).isDirectory()) return recDirectoryTraverse(absPath);
        else if (regexTxt.test(absPath)) return files.push(absPath);
    });
}

recDirectoryTraverse("./pg-txt");

console.log(util.inspect(files, { maxArrayLength: null }));