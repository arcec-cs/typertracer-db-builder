//processor-texts.js - creates "Data//Data-Processed//ink-data//ink-texts//ink-text[ID*].json" which consists of each processed text
const PATH = require('path');
const FS = require('fs');
const DATA = require("../../Data-Source/staticDataStore");
const ID_INDEX = require("./Processor-Tools/IdIndex"); 
const TXT_PARSER = require("./Processor-Tools/txt-parser");
const PRE_PROCESSOR = require('./preProcessor'); 

//helpers
const jsonExists = (jsonPath) => FS.existsSync(jsonPath);
const createJson = (obj, jsonPath) => { FS.writeFileSync(jsonPath, JSON.stringify(obj)); console.log(`processorTexts.js: created ${jsonPath}`); }

const processTexts = () => {

  //Pre-Processing / set base path / 
  PRE_PROCESSOR.preProcess(); // creates necessary 'textFilePathIndex.json' if not already created
  const inkTextPath =  PATH.resolve(__dirname,'..//..//Data-Processed//ink-data//ink-texts');
  const inkIdIndex = ID_INDEX.createIdIndex(DATA.IDS_INPUT);// dont need for storge of props, but obj gives available ids form our id input.

  //Text Processing
  inkIdIndex.ids.forEach(id => { //IDS_INPUT FROM our list of text ids that we want to process  
    // set path for id
    let idPath = `${inkTextPath}//${id}.json`;
    
    // check if exists
    if (jsonExists(idPath)) return console.log(`processorTexts.js: ${idPath} ALREADY EXISTS! if you would like to re-process please delte file, else ignore`)
    
    //processing
    let textContent = TXT_PARSER.paginate(DATA.FILE_PATH_INDEX[id]);

    //to json and write file
    createJson(textContent, idPath);  
  });
};

//DO
processTexts();