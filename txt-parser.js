const fs = require('fs');
const util = require('util');

const regexNonContBeg = /[\s\S]*?(?=(?<=\*{2,})[\r\n]{3,})/ // (?<=\*{2,})[\r\n]{3,} : match paragraph spacing if preceded by 2 or many \*, [\s\S]*?(?=X): match any and all char(non-greedy)if before X
const regexNonContEnd = /(?<=[\r\n]{3,}(?=\*{2,}))[\s\S]*/ // [\r\n]{3,}(?=\*{2,}) : match paragraph spacing if followed by 2 or many \*, (?<= X)[\s\S]*: matach any and all char if after X
const regexEnter = /\r\n/g; //Enter for windows machines
const regexPara = /[\r\n]{3,}/; //for "paragraph delimiters" 
const regexSen = /(?<=\.|\!|\?)\s/; //for any end of sentence punctuation

const senArray = [];

let text = fs.readFileSync("./text/frankenstein.txt", "utf-8"); // read a text file and save as string

text = text.replace(regexNonContBeg, '');// get rid of PG info Beg
text = text.replace(regexNonContEnd, '');// get rid of PG info End

const paraArray = text.split(regexPara) //parses text into paragaphs and puts them into an array

paraArray.forEach((para,ind)=>{ paraArray[ind] = para.replace(regexEnter, ' '); }); // we do not need Enter encoding(\r\n) anymore, get rid of and add space

paraArray.forEach((para, ind)=>{ senArray[ind] = para.split(regexSen); }); // split into sentences by EOS punctuation senArr[#p][#sentence string]

senArray.forEach((para, indP)=>{ //index paragraphs
  para.forEach((sen, indS)=>{ //index sentences
    senArray[indP][indS] = sen.split(/\s/g); //split sentence string by space, return array of element resutling in jagged senArray[#p][#s][#w] 
  });
});

let bookJSON = JSON.stringify(senArray); 

console.log(util.inspect(bookJSON, { maxArrayLength: null }));