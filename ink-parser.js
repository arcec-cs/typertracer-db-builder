const fs = require('fs');
const util = require('util')

const regexNonContBeg = /[\s\S]*?(?=(?<=\*{2,})[\r\n]{3,})/ // (?<=\*{2,})[\r\n]{3,} : match paragraph spacing if it is preceded by 2 or many \*, [\s\S]*?(?=X): match any and all char(non-greedy)if before X
const regexNonContEnd = /(?<=[\r\n]{3,}(?=\*{2,}))[\s\S]*/
const regexEnter = /\r\n/g  //for windows machines
const regexPara = /[\r\n]{3,}/;
const regexSen = /(?<=\.|\!|\?)\s/;

const senArray = [];
const wordArray = [];

let text = fs.readFileSync("./text/frankenstein.txt", "utf-8"); // read a text file and save as string

text = text.replace(regexNonContBeg, '');
text = text.replace(regexNonContEnd, '');

const paraArray = text.split(regexPara) //parses text into paragaphs and puts them into an array

paraArray.forEach((para,ind)=>{paraArray[ind] = para.replace(regexEnter, ' '); }); // we do not need enter encoding anymore, get rid of and add space

paraArray.forEach((para, ind)=>{ senArray[ind] = para.split(regexSen);}); // split into sentences by EOS punctuation

console.log(util.inspect(senArray, { maxArrayLength: null }));









