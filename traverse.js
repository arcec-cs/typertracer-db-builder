const PATH = require("path");
const FS  = require("fs");

const regexTxt = /([0-9]+.txt)$/; // gets only txt files, excludes read.me.txt included in some indexes
const regexTxtNum = /[0-9]+(?=\\[0-9]*-*[0-9]+.txt)/; // get text num from path

const pathToMeta = "..//data//pg-metadata//gutenberg-metadata.txt";
const metaJSON = FS.readFileSync(pathToMeta, "utf-8");
const pgMeta= JSON.parse(metaJSON);

let created = false;

const textFilePathIndex = {};

function recursiveDirectoryTraversal(dir, lang) {
  FS.readdirSync(dir).forEach(file => {
       const path = PATH.join(dir, file);
       if (FS.statSync(path).isDirectory()) return recursiveDirectoryTraversal(path, lang);
       else if (isTextFile(path) && isLanguage(path, lang)) return checkFilePathIndex(path, getTextId(path));
   });
 }

function isTextFile(path){
  return regexTxt.test(path);
}

function isTextFilePathIndexCreated(){
  return created; 
}

function isLanguage(path, lang){
  return (getTextLanguage(path) == lang ? true : false); 
}

function getTextLanguage(path){
  return pgMeta[getTextId(path)].language[0];
}

function getTextId(path){
  return path.match(regexTxtNum)[0];
}

function existsInTextFilePathIndex(id){
  return (textFilePathIndex[id] !== undefined ? true : false); 
}

function checkFilePathIndex(path, id){
  if(!existsInTextFilePathIndex(id)) addToTextFilePathIndex(path, id);
}

function addToTextFilePathIndex(path, id){
  textFilePathIndex[id]= path;
}

function createTextFilePathIndex(rootDir, lang){
  recursiveDirectoryTraversal(rootDir, lang);
  created = true;
  return textFilePathIndex;
}

export default function getTextFilePathIndex(rootDir, lang){
  return (isTextFilePathIndexCreated() ? textFilePathIndex : createTextFilePathIndex(rootDir, lang)); 
}