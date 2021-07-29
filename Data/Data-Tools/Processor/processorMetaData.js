//processorMetaData.js -- creates "Data//Data-Processed//typetracer-data//typetracer-metadata//typetracer-metadata.json" which consists of id":{"author":,"title":,"category":,"words":}

//imports
const PATH = require('path');
const FS = require('fs');
const DATA = require("../../Data-Source/staticDataStore");
const PRE_PROCESSOR = require('./preProcessor'); // has check  
const ID_INDEX = require("./Processor-Tools/IdIndex");
const MDS_INDEX = require('./Processor-Tools/metaDataSubjectIndex');//imports
const CAT_INDEX = require('./Processor-Tools/typetracerCategoryIndex');
const TXT_PARSER = require("./Processor-Tools/txt-parser");


//Do helpers
const jsonPath =  PATH.resolve(__dirname,'..//..//Data-Processed//typetracer-data//typetracer-metadata//typetracer-metadata.json');
const jsonExists = () => FS.existsSync(jsonPath);
const createJson = obj => { FS.writeFileSync(jsonPath, JSON.stringify(obj)); console.log('typetracer-metadata.json created'); }
const existsMsg = `Processor.js: typetracer-metadata.json Already Exists, please remove file you would like to re-process, else ignore; ${jsonPath}`;

//PROCESSING Func
const processMetaData = () => {
  
  //Check and Pre-Processing
  if(jsonExists()) return console.log(existsMsg) //check, no need to reprocess
  PRE_PROCESSOR.preProcess();// creates necessary 'textFilePathIndex.json' if not already created
  
  //Processing-Tools
  const setPropFromPgMetaIndex = (idIndex, propName) => {
    idIndex.ids.forEach(id => {
      let val = DATA.PG_META_INDEX[id][propName][0];
      if (propName == 'author' && val == undefined) val = 'N/A';// for texts w/o authors i.e "bible"
      idIndex[id][propName] = val;
    });
  };
  const processAndSetCategories = (idIndex) => {
    const subjectIndex = MDS_INDEX.createMetaDataSubjectIndex(idIndex.ids); //generates subjectPriority by Regex
    const categoryIndex = CAT_INDEX.createCategoryIndex(subjectIndex); //generated from subjectIndexs subjectPriority Obj
    idIndex.ids.forEach(id => idIndex[id].category = categoryIndex[id]); //set
  };
  const processAndSetWordCount = (idIndex) => {
    idIndex.ids.forEach(id => {
      let textContentClean = TXT_PARSER.toStringAndRemovePgHeaderAndFooter(DATA.FILE_PATH_INDEX[id])
      idIndex[id].words = TXT_PARSER.getNumOfWords(textContentClean); //set num of words
    });
  };
  
  //Processing
  const createTypetracerMetadata = () => { console.log('MDProcessing: creating Index'); 
    const typetracerMetadataIndex = ID_INDEX.createIdIndex(DATA.IDS_INPUT); console.log('MDProcessing: getting authors'); 
    setPropFromPgMetaIndex(typetracerMetadataIndex, "author"); console.log('MDProcessing: getting authors');  
    setPropFromPgMetaIndex(typetracerMetadataIndex, "title"); console.log('MDProcessing: getting titles');
    processAndSetCategories(typetracerMetadataIndex); console.log('MDProcessing: getting wordCount');
    processAndSetWordCount(typetracerMetadataIndex); console.log(`MDProcessing: Success, Index Created at ${jsonPath}`);
    return typetracerMetadataIndex;
  };
  
  return createJson(createTypetracerMetadata());
}

//DO
processMetaData();