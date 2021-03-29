const fs = require('fs');
const util = require('util')

const regexPara = /[\r\n]{3,}/;

const senArray = [];
const wordArray = [];

const text = fs.readFileSync("./text/frankenstein.txt", "utf-8"); // read a text file and save as string

const paraArray = text.split(regexPara) //parses text into paragaphs and puts them into an array

console.log(util.inspect(paraArray, { maxArrayLength: null }));









