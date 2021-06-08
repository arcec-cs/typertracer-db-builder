//text-parser.js partial functional implementation; is indempotent/uses pipe, but no need for data to be immutable; 
const FS = require('fs');
const TXT_PAGINATE = require('./txt-paginate');

//regex
const regexNonContBeg = /[\s\S]*?(?=(?<=\*{2,})[\r\n]{3,})/ // (?<=\*{2,})[\r\n]{3,} : match paragraph spacing if preceded by 2 or many \*, [\s\S]*?(?=X): match any and all char(non-greedy)if before X
const regexNonContEnd = /(?<=[\r\n]{3,}(?=\*{2,}))[\s\S]*/ // [\r\n]{3,}(?=\*{2,}) : match paragraph spacing if followed by 2 or many \*, (?<= X)[\s\S]*: matach any and all char if after X
const regexEnter = /\r\n/g; //Enter for windows machines
const regexMultSpaces = /\s{2,}/g //used to make spacing consistent
const regexPara = /[\r\n]{3,}/; //for "paragraph delimiters"; i.e i.e txt84 line 61
const regexSen = /((?<=\.|\!|\?)\s)(?!\s)/g //for end of sentence punctuation, spaces inconsistent between 1 and 2, get 1; i.e txt84 line 127, 128 
const regexSen2 = /(?<=\.\s|\!\s|\?\s)\s/ //second space for we want "I am a sentence. ","Next sentence"
const regexEnterEOS = /(?<=\.|\!|\?)\r\n/g //used to grab sentences with enter insted of space(s) bc formatting; i.e txt84 line 66

//helpers
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const txtToStringText = filePathToTxtFile => FS.readFileSync(filePathToTxtFile, "utf-8");

const parseNonContentBeg = stringText => stringText.replace(regexNonContBeg, 'START OF TEXT.');// get rid of PG info Beg; uses '*** START OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN ***' as delimeter
const parseNonContentEnd = stringText => stringText.replace(regexNonContEnd, 'END OF TEXT.');//get rid of PG info END; uses '*** END OF THE PROJECT GUTENBERG EBOOK FRANKENSTEIN ***' as delimeter
const parseEnterEncoding = paraArray => paraArray.map(para =>  //removes enter encoding and replaces with appropriate whitespace 
  para.replace(regexEnterEOS, '  ').replace(regexEnter, ' ')); 

const makeEOSConsistentAndSplittable = paraArray => paraArray.map(para => 
  para.replace(regexSen, '  ') + " "); // make sure after a punctuation mark there is always a second space; i.e "Sen.  "

const splitBySpace = stringText => stringText.split(/\s/g); 
const splitToParaArr = (stringText) => stringText.split(regexPara); //split by para delimeter.
const splitToParaSenArr = (paraArr) =>{
  const senArray = [];
  paraArr.forEach((para, ind)=>{ senArray[ind] = para.split(regexSen2); }); // split into sentences by EOS punctuation senArr[#p][#sentence string]
  return senArray;
}

const makeAllSpacesSingle = (paraSenArray) => paraSenArray.map(para => //ensures ink-text only has whitespaces of one. 
    para.map(sen => sen.replace(regexMultSpaces, ' ')));

const countWords = wordArr => {
  let count = 0;
  wordArr.forEach(word => (word != '') && count++); // enters show up a  ''
  return count; 
}

// TEXT PARSING FUNCTIONS
const toStringAndRemovePgHeaderAndFooter = filePathToTxtFile => {  
  return pipe(
    txtToStringText,
    parseNonContentBeg,
    parseNonContentEnd,
  )(filePathToTxtFile)
}

//output notes. Sentences begin with a whitespace except begginging of paragraphs. quotation marks are escaped i.e (["A said\"I am a quote\"])
const toParaSenArr = stringRemovedHeaderAndFooter =>{ //returned array of element resutling in jagged array array[#p][#s] 
  return pipe(
    splitToParaArr,
    parseEnterEncoding, //after bc need enter encoding to split ot paraArr 
    makeEOSConsistentAndSplittable,
    splitToParaSenArr,
    makeAllSpacesSingle //after bc need 2 spaces to split to paraSenArr, at end to ensure all texts will be usable.
  )(stringRemovedHeaderAndFooter)
}

const paginate = filePathToTxtFile =>{ //returned array of element resutling in jagged array array[#p][#s] 
  return pipe(
    toStringAndRemovePgHeaderAndFooter,
    toParaSenArr,
    TXT_PAGINATE.paginateParaSenArr
  )(filePathToTxtFile)
}

const getNumOfWords = stringRemovedHeaderAndFooter => {
  return pipe(
    splitBySpace,
    countWords
  )(stringRemovedHeaderAndFooter)
}

module.exports= {
  toStringAndRemovePgHeaderAndFooter: toStringAndRemovePgHeaderAndFooter,
  toParaSenArr: toParaSenArr,
  paginate: paginate,
  getNumOfWords: getNumOfWords
};