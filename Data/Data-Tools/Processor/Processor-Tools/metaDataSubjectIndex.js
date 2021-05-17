////MetaDataSubjectIndex(MDSIndex) - Factory Func for a MDSIndex which contains Text's subject array from gutenberg-metadata.json refered to as subjectList
// and a regex made subjectPriority object; MDSIBase only subject List. MDSIndex{ id:{subjectList:[], subjectPriority:{}} }
//subjectPriority{subject1: HighS , subject2: MHighS,  subject3: MedS, subject4: LowS} property gets created on match, only matches MHishS subjectPriority(subject2: MHighS,) 

const DATA = require("../../../Data-Source/staticDataStore");
const IdIndex = require("./IdIndex.js");

//regexSubjectPriority to parse subjects from subjectList;   
const RegexSubjectHigh = /[A-Z][a-z]+\sfiction/; // higest priority for is the most broad yet descriptive subject category, tell ficiton and genere, most bang for buck 
const RegexSubjectMedHigh = /((?<=\-\-\s)(Fiction|Biography|History|Poetry|Drama|Tragedies|Humor|Dictionaries))/gi;// these are broadCategories  tooSpecificCategory -- broadCategory i.e Animals -- Ficiton  Broadest 
const RegexSubjectMed = /(Translations|poetry|drama|comedies|Philosophy|Politics|Political|Folklore|Short stories|Cooking|utopias|Biology|ethics|African Americans|Architecture)/gi; //Broad
const RegexSubjectLow = /(Bible|Comidies|Economics|Military|Drawing|Essays|travel|Fairy Tales|Mythology|occultism|sabotage|Christianity|Magic|Love|Latin language|sabotage|Church|Utilitarianism|Early works to 1800|Rizal, José|New Thought|Antiquities|Philippine|Steam-boilers|NeedleWork|Jews|United States|Legends|Imprisonment|Civil Disobedience|Biblical|Communism|lynching)/gi; //least broad, many just added to list to grab a subject for a text

const createSubjectPriorityMatchesArr = subject => [ // dynamically stores matches for each regexSubjectPriority
  subject.match(RegexSubjectHigh), 
  subject.match(RegexSubjectMedHigh), 
  subject.match(RegexSubjectMed), 
  subject.match(RegexSubjectLow)
];

//PROTO/Helper
const isSubjectPriorityObjSet = MDSIndex => //Helper
  (MDSIndex[MDSIndex.ids[0]].subjectPriority != undefined); // subjectPriority created when set

const metaDataSubjectIndexFunctionStore = { //proto
  setSubjectPriorityObj : function () {
    if(isSubjectPriorityObjSet(this)) return console.log("MDSIndex subjectPriority Object already set!");
    this.ids.forEach(id => { 
      this[id].subjectPriority = {};//set  
      this[id].subjectList.forEach(subject => // SHOULD OPTOMIZE TO END IF REGEXHIGH IS FOUND
        createSubjectPriorityMatchesArr(subject).forEach((match,ind) => //apply each regexSubjectPriority to a subject
          (match !== null) && (this[id].subjectPriority['subject'+ ind] = match[0]))); //if match set associated priority property, take last 
    });
  },
}

//Factory Functions/Helper
const setSubjectList = MDSIndex => MDSIndex.ids.forEach(id => //Helper 
    MDSIndex[id].subjectList = DATA.PG_META_INDEX[id].subject);

const createMetaDataSubjectIndexBase = idArray =>{ //FF: includes subjectList
  let MDSIndexB = IdIndex.createIdIndex(idArray, metaDataSubjectIndexFunctionStore);
  setSubjectList(MDSIndexB);
  return MDSIndexB;
}

const createMetaDataSubjectIndex = idArray => { //FF: subject priority obj and/derrived from subjectList
  let MDSIndex = createMetaDataSubjectIndexBase(idArray);
  MDSIndex.setSubjectPriorityObj();
  return MDSIndex;
}

//export
const isMetaDataSubjectIndex = obj => //helper
  (obj && Object.getPrototypeOf(obj) == metaDataSubjectIndexFunctionStore) ? true : false; // checks for arg and type

module.exports= {
  createMetaDataSubjectIndexBase: createMetaDataSubjectIndexBase,
  createMetaDataSubjectIndex: createMetaDataSubjectIndex,
  dependencies:{
    isMetaDataSubjectIndex: isMetaDataSubjectIndex,
    isSubjectPriorityObjSet: isSubjectPriorityObjSet,
    numOfPriorities: createSubjectPriorityMatchesArr.length
  }
};





