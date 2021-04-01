const PATH = require("path");
const FS  = require("fs");

const regexTxt = /([0-9]+.txt)$/; // gets only txt files, excludes read.me.txt included in some indexes
const regexTxtNum = /[0-9]+(?=\\[0-9]*-*[0-9]+.txt)/; // get text num from path

let created = false;

let metaDataIndex;

const textFilePathIndex = {};

function recursiveDirectoryTraversal(dir, lang) {
  FS.readdirSync(dir).forEach(file => {
       const path = PATH.join(dir, file);
       if (FS.statSync(path).isDirectory()) return recursiveDirectoryTraversal(path, lang);
       else if (isTextFile(path) && isLanguage(path, lang)) return checkFilePathIndex(path, getTextId(path));
   });
 }

const isTextFile = path => regexTxt.test(path);

const isTextFilePathIndexCreated = () => created;

const isLanguage = (path, lang) => (getTextLanguage(path) == lang ? true : false);

const getTextLanguage = path => metaDataIndex[getTextId(path)].language[0];

const getTextId = path => path.match(regexTxtNum)[0];

const existsInTextFilePathIndex = id => (textFilePathIndex[id] !== undefined ? true : false);

const checkFilePathIndex = (path, id) => !existsInTextFilePathIndex(id) && addToTextFilePathIndex(path, id);

const addToTextFilePathIndex = (path, id) => textFilePathIndex[id]= path;

function createTextFilePathIndex(rootDir, metaData, lang){
  metaDataIndex = metaData;
  recursiveDirectoryTraversal(rootDir, lang);
  created = true;
  return textFilePathIndex;
}

const getTextFilePathIndex = (rootDir, metaData,  lang) => (isTextFilePathIndexCreated() ? textFilePathIndex : createTextFilePathIndex(rootDir, metaData, lang));

module.exports ={
  getTextFilePathIndex: getTextFilePathIndex
}; 
