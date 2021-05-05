////MetaDataSubjectFrequencyIndex.js(MDSFI) - exports Fact Func that creates MDSFI containg
//Specific and NonSpecific subjectFrequencyIndex MDFSI:{specific:{}, nonSpecific:{}} w/ keys: subj, values: Frequency #(unique per id)
// unique i.e if id 1 contains subject "Fiction" twice only adds one to "Fiction, Frequency"

//imports
const MDSIndex = require("../../Processor/Processor-Tools/metaDataSubjectIndex");

//HELPERS: bool, regex, setters, sort
//bool
const isMultiValued = (subject) => /,/.test(subject); // Specific subject sometimes multivalued i.e Epic poetry, English (Old) -- ..
const hasOnlySpecific = (subject) => !(/\-\-/.test(subject));
const hasTrailingSpace = (subject) => regexTrailingSpace.test(subject);//BANDAID for regexNonSpecific

//regex
const regexSpecific =/[\(\)\,\.\w\s]*(?=\s\-)/; //matches word whitespace and spec chars
const regexNonSpecific = /(?<=\-\-\s)[\(\)\,\w\s]*/g; //global to match I to N !!FIX TRAILING SPACE IN MIDDLE SUB!!
const regexTrailingSpace = /\s$/; // BANDAID until better regexNonSpecific 

//setters
const setTempIndex = (index, subject) =>{ //helper for Sp and NSp
  (index[subject] === undefined) && (index[subject]=1); //only counts a unique subject once per Id
} 
const setTempIndexSp = (index, subjectSp) => { //sub spec: cheks multi, adds each multi or single val
  (isMultiValued(subjectSp)) ? 
    subjectSp.split(',').forEach(subject => setTempIndex(index, subject)) : 
    setTempIndex(index, subjectSp);
}
const setTempIndexNSp = (index, subjectN) => { // sub Non spec
  subjectN.forEach(subject => {
    if(hasTrailingSpace(subject)) subject = subject.replace(regexTrailingSpace, ""); //BANDAID UNTIL BETTER REGEX 
    setTempIndex(index, subject);
  });
}
const setIndex = (index, tempHolder, nameHolder) => { //sets return index from temp index each iteration
  nameHolder.forEach(subjName => Object.keys(tempHolder[subjName]).forEach(subj => { //iterate nameHolder to set each temp prop 
    (index[subjName][subj]==undefined) ? 
      index[subjName][subj] = 1 : 
      index[subjName][subj]++;
  }));
}
//sort
const sortByFrequency = (frequencyIndex) => Object.entries(frequencyIndex).sort((a,b) =>b[1]-a[1]); //returns array, sorts by freq

//FACTORY FUNCTION: creates specific and nonSpecific FrequencyIndex; keys: Sp/NonSp subject, values: number of times it appears in UNIQUE Ids(Frequency)
const createMetaDataSubjectFrequencyIndex = (MDSIndexBase) => { 
  //TypeCheck 
  if (!MDSIndex.dependencies.isMetaDataSubjectIndex(MDSIndexBase)) //MDSIndex contains, keys: id values: subjectList
    throw new TypeError("MUST PROVIDE A MetaDataSubjectIndex as first arg");
  
  const index = {specific:{}, nonSpecific:{}}; //SubjectList value format (specific "-- non-specificI"... "-- non-specificN")(Animals -- Fiction --..)  
  
  // Iterate subjectList for each Id, parse Sp and NSp /w regex, set to index
  MDSIndexBase.ids.forEach(id =>{
    const tempHolder = {nonSpecific:{}, specific:{}}; //only unique subj per texts, refresh 
    MDSIndexBase[id].subjectList.forEach(subject =>{ 
      if (hasOnlySpecific(subject)) setTempIndexSp(tempHolder.specific, subject); //no need to parse value only ("specific")
      else { //need to parse Sp from NSp and set temp
        let subjectSpecific =  subject.match(regexSpecific)[0]; //[0] bc global flag
        let subjectNonSpecific = subject.match(regexNonSpecific); 
        setTempIndexSp(tempHolder.specific, subjectSpecific);
        setTempIndexNSp(tempHolder.nonSpecific, subjectNonSpecific);
      }
    });
    setIndex(index, tempHolder, ['specific', 'nonSpecific']);
  });
index.specific =  sortByFrequency(index.specific); //sort Sp
index.nonSpecific =  sortByFrequency(index.nonSpecific); //sort NSp
return index; 
}

module.exports= {
  createMetaDataSubjectFrequencyIndex: createMetaDataSubjectFrequencyIndex,
};