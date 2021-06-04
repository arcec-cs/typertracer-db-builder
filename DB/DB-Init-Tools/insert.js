//insert.js module that inserts data to intialize db ink
const FS = require('fs');
const PATH = require('path');
 

//get ink metadata
const MD = JSON.parse(FS.readFileSync(PATH.resolve(__dirname,'..//..//Data//Data-Processed//ink-data//ink-metadata//ink-metadata.json')));
const MD_IDS = Object.keys(MD);

//creates knex insert list for "single property" Tables like Categories and Authors  
const createInsertUniqueValList = (db, tableName, colName) => {
  const insertList = []; //note promise is not create w/ knex until .then() is attached
  const alreadyInserted = []; //since categories/authors are unique in db but not among texts in MD

  MD_IDS.forEach(id => {
    let value = MD[id][colName];

    if(!alreadyInserted.includes(value)) {
      insertList.push(db(tableName).insert({[colName]: value}));
      alreadyInserted.push(value);
    }
     
  });
  return insertList;
};

//inserts into Texts table
const initTexts = (db) => {
  // build knex queries to get fk
  const getAuthorFk = (id) => db.select('id').table('Authors').where('author', '=', MD[id].author);
  const getCategoryFk = (id) => db.select('id').table('Categories').where('category', '=', MD[id].category);

  const insertTexts = async (id) => {
    try {
      const author = await getAuthorFk(id);
      const category = await getCategoryFk(id);
      await db('Texts').insert({id: id, title: MD[id].title, words: MD[id].words, author_id: author[0].id, category_id: category[0].id})
      console.log(`inserted id:${id} title:${MD[id].title} words: ${MD[id].words} a_id:${author[0].id} c_id:${category[0].id}`);
    }catch(e){
      console.log(e);
    }
  }
  // iterate async func to insert texts
  MD_IDS.forEach(id => { 
    insertTexts(id);
  });
};

// inserts into Categories/Authors then Texts for ids of Categories and Authors are FKs 
const initAll = async (db) => {
  Promise.all(createInsertUniqueValList(db, 'Categories', 'category')); //init Categories
  await Promise.all(createInsertUniqueValList(db, 'Authors', 'author')); // init Authors
  console.log('Inserted Categories and Authors records!');
  initTexts(db);
}

module.exports= {
  initAll: initAll,
}