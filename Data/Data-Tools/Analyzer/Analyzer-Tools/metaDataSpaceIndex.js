//// MetaDataSpaceIndex - keys: text ids,   
// key totals: numOfBytes: null, numOfSubjects: null, numOfManyAuthors: null     
// MDSIndex totals is data for db design decisions, space impact: .numOfBytes -hdspace, .numOfSubjects -rows, .numOfManyAuthors -rows   

//imports
const FS = require("fs");
const DATA = require("../../../Data-Source/staticDataStore"); //2010 library ids/metadata
const IdIndex = require("./IdIndex.js"); // fact func, createIdIndex(idsArr, optPrototype) IdIndex -> IdIndexStore

//helpers to be declaritive
const isSet = (propName, MDSIndex) => (MDSIndex[MDSIndex.ids[0]][propName] != undefined);
const isCalc = (propName, MDSIndex) =>(MDSIndex.totals[propName] != null);

//MDSIndex prototype methods
const metaDataSpaceIndexFunctionStore = {
   setNumOfBytes: function(){ //setX if statments checks, last expression set
    if(isSet("numOfBytes",this)) return console.log(`numOfBytes already set`);
    this.ids.forEach(id => this[id].numOfBytes = FS.statSync(DATA.FILE_PATH_INDEX[id]).size);//props and vals set together
  },
  setNumOfSubjects: function() {
    if(isSet("numOfSubjects", this)) return console.log(`numOfSubjects already set`);
    this.ids.forEach(id => this[id].numOfSubjects = DATA.PG_META_INDEX[id].subject.length);
  },
  setNumOfAuthors: function() {
    if(isSet("numOfAuthors", this)) return console.log(`numOfAuthors already set`);
    this.ids.forEach(id => this[id].numOfAuthors = DATA.PG_META_INDEX[id].author.length);
  },
  calcTotalNumOfBytes: function() { //calcX if statments checks, last expression calc
    if (isCalc("numOfBytes",this)) return console.log('totals.numOfBytes already calculated');
    if (!isSet("numOfBytes",this)) this.setNumOfBytes(); //Need data for calc
    this.ids.forEach(id => { this.totals.numOfBytes += this[id].numOfBytes }); //do
  },
  calcTotalNumOfSubjects: function() {
    if (isCalc("numOfSubjects", this)) return console.log('totals.numOfSubjects already calculated');
    if (!isSet("numOfSubjects", this)) this.setNumOfSubjects();
    this.ids.forEach(id => { this.totals.numOfSubjects += this[id].numOfSubjects });
  },
  calcTotalNumOfManyAuthors: function() {
    if (isCalc("numOfManyAuthors", this)) return console.log('totals.numOfManyAuthors already calculated')
    if (!isSet("numOfAuthors", this)) this.setNumOfAuthors();
    this.totals.numOfManyAuthors = 0; //set zero ++ not compatible with null
    this.ids.forEach(id => (this[id].numOfAuthors > 1) && this.totals.numOfManyAuthors++); 
  },
  setAndCalcAll: function() {
    this.calcTotalNumOfBytes();
    this.calcTotalNumOfSubjects();
    this.calcTotalNumOfManyAuthors();
  } 
}; 

//fac func, MDSIndex: IdIndex ->MDSIndexFuncStore; empty if user wants to select what data with methods  
const createMetaDataSpaceIndexBase = (idArr) => {  
  const MDSEIndex =  IdIndex.createIdIndex(idArrList, metaDataSpaceIndexFunctionStore);
  MDSEIndex.totals = {numOfBytes: null, numOfSubjects: null, numOfManyAuthors: null}; //null coerce to 0 w/ + op  
  return MDSEIndex; 
};
//fac func, provides user with with completed index for ease 
const createMetaDataSpaceIndex = (idArr) => { 
  const MDSIndex = createMetaDataSpaceIndexBase(idArrList);
  MDSIndex.setAndCalcAll(); 
  return MDSIndex;
};

module.exports= {
  createMetaDataSpaceIndexEmpty: createMetaDataSpaceIndexBase,
  createMetaDataSizeIndex: createMetaDataSpaceIndex
};