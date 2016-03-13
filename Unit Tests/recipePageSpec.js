//Global Test information

var key = "DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1";

var testRec = {};
testRec.id = "551154";
testRec.title = "Pumpkin Muffins";
testRec.extendedIngredients = [];
testRec.sourceUrl = "http://www.homecookingadventure.com/recipes/pumpkin-muffins";

describe("Recipe Page Tests:", function(){
  
//getQueryString
describe("When the recipePage page loads", function(){
  
  it("id and title should be parsed from the query", function(){
      var url = "./Meal Planner/recipePage.html?id=551154&title=Pumpkin%20Muffins";
      expect(getQueryString("id", url)).toBe("551154");
      expect(getQueryString("title", url)).toBe("Pumpkin%20Muffins");
  });
  
  it("queries without tdee return NULL", function(){
      var url = "./Meal Planner/recipePage.html";
      expect(getQueryString("id", url)).toBe(null);
      expect(getQueryString("title", url)).toBe(null);
  })
  
});

//createMealDivs(recipeObject)
describe("When createRecipeDivs runs", function() {

    beforeEach(function(){
      //Add fake content div to page
      var fakeHeader = document.createElement("span");
      fakeHeader.id = "header";
      var center = document.createElement("center");
      fakeHeader.appendChild(center);
      var fakeContent = document.createElement("div");
      fakeContent.id = "content";
      document.body.appendChild(fakeHeader);
      document.body.appendChild(fakeContent);
    })
    
    afterEach(function(){
      //Remove fakeHeader and fakeContent from page
      var fakeHeader = document.getElementById("header");
      while(fakeHeader.firstChild){
        fakeHeader.removeChild(fakeHeader.firstChild);
      }
      document.body.removeChild(fakeHeader);
      var fakeContent = document.getElementById("content");
      while(fakeContent.firstChild){
        fakeContent.removeChild(fakeContent.firstChild);
      }
      document.body.removeChild(fakeContent);
    })
  
    it("adds a div after completion", function(){

      var content = document.getElementById("content");
      createRecipeDivs(testRec);
      expect(content.children.length).toBe(1);
    })
})

//assignRecipeInstRequestCallback(req, reqQuery, recipeObject)

describe("When the recipe instructions callback is called ", function(){

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  
  var goodQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?"
    + "forceExtraction=false&"
    + "url=" + testRec.sourceUrl;
  var badQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?badQuery=badQuery&otherBadQuery=OtherBadQuery";
  
  beforeEach(function(){
    //Reset Global Variable
    reqCount = 0;
  })

  it("on a successful query it calls createRecipeDivs", function(done){
    
    spyOn(window, 'createRecipeDivs').and.callFake(function(){return 1;});
    
    var goodreq = new XMLHttpRequest();
    goodreq.open("GET", goodQuery, true);
    goodreq.addEventListener('load', function(){
      assignRecipeInstRequestCallback(goodreq, goodQuery, testRec);
    });
    goodreq.send();
    
    setTimeout(function(){
      expect(window.createRecipeDivs.calls.count()).toBe(1);
      done();
    }, 5000);
  })
  
  it("attempts to request information up to 8 times even if API isn't responding", function(done){
    var requestCount = 0;

    var badInstQuery = new XMLHttpRequest();
    badInstQuery.open("GET", badQuery, true);
    badInstQuery.addEventListener('load', function(){
      assignRecipeInstRequestCallback(badInstQuery, badQuery, testRec);
      requestCount++;
    });
    badInstQuery.send();
    
    setTimeout(function(){
      expect(requestCount).toBe(8);
      expect(reqCount).toBe(8);
      done();
    }, 5000);
  })
})

//assignRecipeInstructions(recipeObject)

describe("When assignRecipeIntsructions is called", function(){
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

  it("on successful query should call createRecipeDivs", function(done){
    spyOn(window, 'createRecipeDivs').and.callFake(function(){return 1;});
    
    assignRecipeInstructions(testRec);
    setTimeout(function(){
      expect(window.createRecipeDivs.calls.count()).toBe(1);
      done();
    }, 5000);
  })
})

//assignUrlsAndNutRequestCallback(req, reqQuery, recipeObject)

describe("When the assigning URLS and Nutrition callback is called ", function(){
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  
  var goodQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"
        + testRec.id
        + "/information";
  var badQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/-1/information";
  
  beforeEach(function(){
    //Reset Global Variable
    reqCount = 0;
  })

  it("on a successful query it calls assignRecipeInstructions", function(done){
    
    spyOn(window, 'assignRecipeInstructions').and.callFake(function(){return 1;});
    
    var goodreq = new XMLHttpRequest();
    goodreq.open("GET", goodQuery, true);
    goodreq.addEventListener('load', function(){
      assignUrlsAndNutRequestCallback(goodreq, goodQuery, testRec);
    });
    goodreq.send();
    
    setTimeout(function(){
      expect(window.assignRecipeInstructions.calls.count()).toBe(1);
      done();
    }, 5000);
  })
  
  it("attempts to request information up to 8 times even if API isn't responding", function(done){
    var requestCount = 0;

    var badUrlQuery = new XMLHttpRequest();
    badUrlQuery.open("GET", badQuery, true);
    badUrlQuery.addEventListener('load', function(){
      assignUrlsAndNutRequestCallback(badUrlQuery, badQuery, testRec);
      requestCount++;
    });
    badUrlQuery.send();
    
    setTimeout(function(){
      expect(requestCount).toBe(8);
      expect(reqCount).toBe(8);
      done();
    }, 5000);
  })
  
})

//assignUrlsAndNutrients(recipeObject)

describe("When assignUrlsAndNutrients is called ", function() {
  it("on successful query should call assignUrlsAndNutRequestCallback", function(done){
    spyOn(window, 'assignRecipeInstRequestCallback').and.callFake(function(){return 1;});
    
    assignRecipeInstructions(testRec);
    setTimeout(function(){
      expect(window.assignRecipeInstRequestCallback.calls.count()).toBe(1);
      done();
    }, 5000);
  })
})
})