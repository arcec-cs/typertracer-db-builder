//preProcessor.js - creates "Data//Data-Source//pre-processor-generated//textFilePathIndex.json" which holds the location of each text in 2010PG iso FS
//imports
const PATH = require('path');
const FS = require('fs');
const TRAVERSE = require('./Processor-Tools/Pre-Processor-Tools/traverse');

//PRE-PROCESSING FUNCTIONS
const preProcess = () => { // traverses 2010 pg fs to get paths to each txt file and creates index{id: path}
  const PathToRootDir = PATH.resolve(__dirname, '../../Data-Source/pg-data/pg-text');
  const MetaData = JSON.parse(FS.readFileSync(PATH.resolve(__dirname,"..//..//Data-Source//pg-data//pg-metadata//pg-metadata.json"))); //cant take from staticDataSource bc need textFilePathIndex to be defined
  TRAVERSE.createTextFilePathIndexJson(PathToRootDir, MetaData, 'en');
}

module.exports= {
  preProcess: preProcess
};