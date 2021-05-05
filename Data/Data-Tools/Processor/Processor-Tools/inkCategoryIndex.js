////inkCategoryIndex.js 
//createCategoryIndex uses metaDataSubjectIndex's subject priority object to determine the the subject that shall be the solitary Category that represents a book
//This is necessary to give the Ink Db a categorical quantifier for each book while meeting the db space constraints conclued from MetaDataSpaceIndex's produced data.
//createCategoryNoIndex() creates index containing Ids and subject info that do not have an elligble category so one of the subject can be added as an elligble category in metaDataSubjectIndex.js

//imports
const MDS_INDEX = require("./metaDataSubjectIndex");
const IdIndex = require("./IdIndex");

//helpers
const inputValidator = (MDSIndex) => { //MDSIndex contain subj priority obj which is needed to createCategoryIndex
  if (!MDS_INDEX.dependencies.isMetaDataSubjectIndex(MDSIndex)) 
    throw new TypeError("MUST PROVIDE A MetaDataSubjectIndex as first arg");  
  if(!MDS_INDEX.dependencies.isSubjectPriorityObjSet(MDSIndex)) { //set priority obj if only base MDSIndex was passed
    metaDataSubjectIndex.setSubjectPriorityObj();   
    console.log("MDSIndex.subjPriority was set so definitiveSubjectIndex could be created");
  }
}

const setDefinitiveSubjectIndex = (MDSIndex, catIndex) => { //picks highest priority from sub priority obj as category
  MDSIndex.ids.forEach(id => {
    let isSet = false; //reset for new id
    [0,1,2,3].forEach(subjPriority => //nums associated w/ priority
      (isSet == false && MDSIndex[id].subjectPriority['subject' + subjPriority] !== undefined) &&  //inline if  
        (catIndex[id] = MDSIndex[id].subjectPriority['subject' + subjPriority]) && (isSet = true));
  });
}

//FACT FUNC, SUBJECT DATA THAT WILL BE ADDED TO INK'S DB
const createCategoryIndex = MDSIndex => { //FACT FUNC, SUBJECT DATA THAT WILL BE ADDED TO INK'S DB
  inputValidator(MDSIndex);
  index = IdIndex.createIdIndex(MDSIndex.ids); //create index to hold Definitive Subjects
  setDefinitiveSubjectIndex(MDSIndex, index);
  return index;
}

const createIndexNoCategory = (MDSIndex) => { //see which subjects not covered by MDSIndex regex 
  inputValidator(MDSIndex);
  index = {};   
  MDSIndex.ids.forEach(id => { 
    let noCategory = true;
    [0,1,2,3].forEach(subjPriority => (MDSIndex[id].subjectPriority['subject' + subjPriority] != undefined) && (noCategory = false));
    if(noCategory) index[id] = MDSIndex[id];
  }); 
  return index; 
}

module.exports= {
  createCategoryIndex: createCategoryIndex,
  createIndexNoCategory: createIndexNoCategory
};