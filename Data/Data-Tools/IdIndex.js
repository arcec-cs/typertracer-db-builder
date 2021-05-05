//IndexId- exports Factory function, takes in an array of book ids with optional argument idIndexStore to set prototype functions

//import
const DATA = require("./data/staticDataStore.js"); 

//helpers
const getAvailableTextIds = idArr => { // filters ids not in 2010 FS; returns arr of ids
  idsInPgFS = []; 
  idArr.forEach(id => DATA.FILE_PATH_INDEX[id] !== undefined && idsInPgFS.push(id)); //if id exists in 2010 iso
  return idsInPgFS; ;
};
const isIdArrValid = idArr => { //make sure input exists and is a populated arr 
  if (!idArr || !Array.isArray(idArr) || idArr.length < 0) {
    throw new TypeError("INDEX NOT CREATED, " 
    +"1st param must be an Array w/ >0 ids");
  }  
};
const isIndexStoreValid = idIndexStore => { // make sure input is obj for proto
  if (typeof idIndexStore != typeof {}) {
    throw new TypeError("INDEX NOT CREATED, " 
    +"idIndexStore must be an Object");
  }
};

//export: fact funct, createIdIndex(textIdsArray, optionalPrototype)
const createIdIndex = (idArr, idIndexStore) => { 
  //type check
  isIdArrValid(idArr);
  (idIndexStore) && isIndexStoreValid(idIndexStore);// optional arg 
  
  const ids = getAvailableTextIds(idArr); // keys in our return obj 
  
  //create index and proto chain
  if(idIndexStore){ //idIndex -> idIndexStore
    idIndexStore.ids = ids;//use in many operations, calc once
    idIndex = Object.create(idIndexStore);
  } else  idIndex = Object.create({ids: ids}); //no proto added: idIndex -> {ids} 
  
  //set index properties 
  ids.forEach(id => idIndex[id]={}); // create id props
  return idIndex; 
};

module.exports ={
  createIdIndex: createIdIndex
}; 
