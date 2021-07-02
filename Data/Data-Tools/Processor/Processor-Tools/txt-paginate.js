//paginate.js- paginates jagged array paraSenArrayProcessed[[s1,s2][s1,s2,s3]...] into a paginated book{1:[s1,s2][s1,s2,s3], 2:[s1,s2][s1,s2,s3]...]}
//The goal of paginate.js is to provide typeTracer a consistently sized body of text by num of chars; 
//Also whitespace at End of paragraphs(end of line ws/ space between paragaraphs)are not value in the book but is accounted for. 

// bookBuilder provides a SIZER: to set page dimentions, indexer: to  index through book creation, and methods to encapulate common book creation functions
const createBookBuilder = () =>{
  return bookBuilder = {
    book:{1:[[]]},
    SIZER: {
      CHAR_PER_LINE: 66,
      LINES_PER_PAGE: 30,
      CHAR_PER_PAGE: 1980 
    },
    indexer: {
      page: 1,
      char: 0,
      sen: 0,
      para: 0 
    },
    willFitOnPage: function(addSen) {
      let indexer = this.indexer;
      return addSen.length <= (this.SIZER.CHAR_PER_PAGE - indexer.char);
    },
    isLastSenOfPageWithWS: function() { // a char occupys one of the last 2 lines,whitespace will take up rest of page
      return ((this.SIZER.CHAR_PER_PAGE - this.indexer.char) / this.SIZER.CHAR_PER_LINE < 2);
    },
    addSentence: function(addSen) {
      let indexer = this.indexer;
      this.book[indexer.page][indexer.para][indexer.sen] = addSen; //add sentence
      indexer.sen++; //set indexer
      indexer.char = indexer.char + addSen.length;
    },
    createParagraph: function() {
      let indexer = this.indexer;
      indexer.para++; //set indexer
      indexer.sen = 0; 
      this.book[indexer.page][indexer.para] = []; //instantiate  
    },
    createPage: function() {
      let indexer = this.indexer;
      indexer.page++; //set indexer
      indexer.para = 0;
      indexer.sen = 0;
      indexer.char = 0;
      this.book[indexer.page] = []; //instantiate new page
      this.book[indexer.page][indexer.para] = []; //instantiate new para
    },
    addEndOfParagraphWhiteSpace() {
      let indexer = this.indexer;
      let SIZER = this.SIZER; 
      //calculate and add WS
      let numOfCharInLastLine = indexer.char % SIZER.CHAR_PER_LINE; // last line of para 
      if (numOfCharInLastLine == 0) numOfCharInLastLine = 66 //full last lines will return as 0 = 66 % 66; check here
      let numOfWhiteSpaceInLastLine = (SIZER.CHAR_PER_LINE - numOfCharInLastLine) //fills remaining page width of 
      indexer.char = indexer.char + numOfWhiteSpaceInLastLine + SIZER.CHAR_PER_LINE; // add line of whitespace after 
    },
  };
}

// HELPER FUNCITONS
//CHECK CASES last sentence of a paragraph must take in account for white space not used on last line and the space between paragraphs unless on last line of page
const lastSentenceHandler = (bookBuilder) => {
  const isLastSenOfPageWithWS = bookBuilder.isLastSenOfPageWithWS(); 
  if(isLastSenOfPageWithWS) bookBuilder.createPage(); //char on within last 2 lines, whitespace takes remaing space, go to next page
  else { //last sen ends on "line 29/30" whitespace takes up remaining space.
    bookBuilder.addEndOfParagraphWhiteSpace();
    bookBuilder.createParagraph();
  }
}

//When a page has room for part of a sentence we slice it to get the closest substring consisting of whole words that will fit.
const sliceSentenceBetweenTwoPages = (bookBuilder, sen) => {
    //Current Page: get substring of sentence that can fit on page & if can fit at least one whole word then add.
    let indexSenSliceEnd = (bookBuilder.SIZER.CHAR_PER_PAGE - bookBuilder.indexer.char);//amount of space on page left
    let sentenceSubstringFit = sen.slice(0, indexSenSliceEnd); //slice does not include end
    
    //calibrate indexSenSliceEnd to bne find index of a last char in a whole word that can fit on the page
    if(sentenceSubstringFit[indexSenSliceEnd -1] != ' ' ) {  
      do{ indexSenSliceEnd--; }
      while(sentenceSubstringFit[indexSenSliceEnd -1] != ' ' && indexSenSliceEnd > -1); // <= -1 to cover case of no space in current page  
    }
    if(indexSenSliceEnd > -1) {//at least one word fits,slice sen and add to current page
      let senCurPage = sen.slice(0, indexSenSliceEnd); //
      bookBuilder.addSentence(senCurPage);    
    } else indexSenSliceEnd = -1; //cover full page case: where indexLastCharPage == -1
    
    //Next Page: create next page and add rest of sentence to the next page 
    bookBuilder.createPage();
    let senNextPage = sen.slice(indexSenSliceEnd, sen.length);//slice does not include end
    bookBuilder.addSentence(senNextPage); 
}

//PAGINATE turns paraSenArr into paginated book using helpers
const paginateParaSenArr = (paraSenArr) => {
//create bookBuilder
const bookBuilder = createBookBuilder()
//iterate paraSenArray to paginate.
  paraSenArr.forEach(para => {
    para.forEach((sen, indS) => {
      if(bookBuilder.willFitOnPage(sen)) { 
        bookBuilder.addSentence(sen)
        //check if last paragraph
        let isLastSenInPara = indS == para.length - 1;
        if(isLastSenInPara) {
          lastSentenceHandler(bookBuilder); //add EOPara whitespace/ next page       
        }
      }
      else {// whole sentence CANNOT FIT on current page
        sliceSentenceBetweenTwoPages(bookBuilder, sen);
        //check if last paragraph
        let isLastSenInPara = indS == para.length - 1;
        if(isLastSenInPara) {
          lastSentenceHandler(bookBuilder, sen); //add EOPara whitespace/ next page           
        }
      }   
    });
  });
  return bookBuilder.book;
}

module.exports= {
  paginateParaSenArr: paginateParaSenArr
}