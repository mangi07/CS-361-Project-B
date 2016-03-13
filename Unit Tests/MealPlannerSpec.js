describe("Meal Planner & Recipe Page: ", function(){

//getQueryString
describe("When the mealplanner page loads", function(){
  
  it("tdee should be parsed from the query", function(){
      var url = "./Meal Planner/mealplanner.html?tdee=1500";
      expect(getQueryString("tdee", url)).toBe("1500");
  });
  
  it("queries without tdee return NULL", function(){
      var url = "./Meal Planner/mealplanner.html";
      expect(getQueryString("tdee", url)).toBe(null);
  })
  
});

//createMealDivs(recipeObject)
describe("When createMealDivs is called with a recipe object", function(){

  var recipeObject = {};
  recipeObject.id = "123456";
  recipeObject.title = "Test Title";
  recipeObject.day = "1";
  recipeObject.slot = 1;
  
  beforeEach(function(){
    //Create a fake div with id = content and append to document
    var fakeContent = document.createElement("div");
    fakeContent.id = "content";
    document.body.appendChild(fakeContent);
  });

  afterEach(function (){
    //Remove the fake div, and increment slot
    var fakeContent = document.getElementById("content");
    recipeObject.slot++;
    //if slot goes out of range, reset to 1
    if(recipeObject.slot == 4){
      recipeObject.slot = 1;
    }
    document.body.removeChild(fakeContent);
  });
  
  it("should create a div and append it to the 'content' div", function(){
      var content = document.getElementById("content");
      createMealDivs(recipeObject);
      expect(content.children.length).toBe(1);
  })
  
  it("should generate a correct meal title for each recipe", function(){
      var content = document.getElementById("content");
      var meal;
      if(recipeObject.slot==1){meal="Breakfast";}    
        else if (recipeObject.slot==2){meal="Lunch";}
        else if (recipeObject.slot==3){meal="Dinner";}
        else {meal="ERROR";}
        
      var recipeTitle="Day " + recipeObject.day + " " + meal + ":" + recipeObject.title;
      createMealDivs(recipeObject);
      expect(recipeTitle).toBe(document.getElementById(recipeObject.id).textContent);
      
  })
  
  it("should generate a link with a query for the specific recipe inside the div", function(){

    //Set up for current environment
    var expectedURL = "https://preview.c9users.io/smulholl/cs-361-project-b/Unit%20Tests/";
    
    //Tested Value, must encode variables as this is normal in browser
    expectedURL += "recipePage.html?id=" + encodeURI(recipeObject.id) + "&title=" + encodeURI(recipeObject.title);
    createMealDivs(recipeObject);
    
    var link = document.getElementById(recipeObject.id);
    expect(expectedURL).toBe(link.href);
  })
  
});

//getWeeklyMealsRequestCallback(req, reqQuery)
describe("When the getWeeklyMealsRequestCallback with a request and a requestQuery is called ", function(){

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

  var badQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/badPage?targetCalories=2000&timeFrame=week";
  var goodQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?targetCalories=2000&timeFrame=week";
  
  beforeEach(function(){
    //Reset globals
    finalRecipes = [];
    reqCount = 0;
    
    //Create a fake div with id = content and append to document
    var fakeContent = document.createElement("div");
    fakeContent.id = "content";
    var fakeTdee = document.createElement("span");
    fakeTdee.id = "tdee";
    fakeContent.appendChild(fakeTdee);
    document.body.appendChild(fakeContent);
  });
  
  afterEach(function(){
    //Remove the fake div, and increment slot
    var fakeContent = document.getElementById("content");
    while(fakeContent.firstChild){
      fakeContent.removeChild(fakeContent.firstChild);
    }
    document.body.removeChild(fakeContent);
  });
  
  it("creates 21 divs in addition to the TDEE span", function(done){
    //Create a known good request
    var goodreq = new XMLHttpRequest();
    goodreq.open("GET", goodQuery, true);
    //When goodreq loads, pass the good req and goodQuery to the callback
    //Should request up to 8 times to ensure success (shouldn't need all 8 requests)
    goodreq.addEventListener('load', function(){
      getWeeklyMealsRequestCallback(goodreq, goodQuery);
    });
    goodreq.send();
    
    //Wait 3 seconds, and check to see if 21 divs have been added, and the original tdee span is there
    setTimeout(function(){
      expect(document.getElementById("content").children.length).toBe(21 + 1); //Length of 22 because of 21 meals, and TDEE span
      done();
    }, 5000);
  })
  
  it("attempts to request information up to 8 times even if API isn't responding", function(done){
    //External count
    var requestCount = 0;
    
    //Simulate getWeeklyMeals req, and event listener
    var fakedGetWeeklyMealsRequest = new XMLHttpRequest();
    fakedGetWeeklyMealsRequest.open("GET", badQuery, true);
    fakedGetWeeklyMealsRequest.addEventListener('load', function(){
      //Everytime request loads, feed the current fake request, and a bad query
      getWeeklyMealsRequestCallback(fakedGetWeeklyMealsRequest, badQuery);
      //Count the number of tries
      ++requestCount;
    });
    fakedGetWeeklyMealsRequest.send();
    
    //Wait 3 seconds
    setTimeout(function(){
      //Expect external count to be 8
      expect(requestCount).toBe(8);
      //Expect internal count to be 8
      expect(reqCount).toBe(8);
      //Expect only tdee to be present
      expect(document.getElementById("content").children.length).toBe(1);
      done();
    }, 5000);
  })
  
});


//getWeeklyMeals()
describe("When getWeeklyMeals is called", function(){
  
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
  
  beforeEach(function(){
    //Reset Globals
    finalRecipes = [];
    reqCount = 0;
    
    //Create a fake div with id = content and append to document
    var fakeContent = document.createElement("div");
    fakeContent.id = "content";
    var fakeTdee = document.createElement("span");
    fakeTdee.id = "tdee";
    fakeContent.appendChild(fakeTdee);
    document.body.appendChild(fakeContent);
  });
  
  afterEach(function(){
    //Remove the fake div, and increment slot
    var fakeContent = document.getElementById("content");
    while(fakeContent.firstChild){
      fakeContent.removeChild(fakeContent.firstChild);
    }
    document.body.removeChild(fakeContent);
  });
  
  it("fills finalRecipes with 21 unique recipes", function(done){

    //Autoreturns 2000 because no query string exists
    spyOn(window,'getQueryString').and.returnValue(2000);
    
    //Runs getWeeklyMeals
    getWeeklyMeals();
    
    //Waits 5 seconds
    setTimeout(function(){
      //finalRecipes should be 21 recipes long
      expect(finalRecipes.length).toBe(21);
      
      //Compare recipe i, to all later recipes j
      for(var i = 0; i < finalRecipes.length; i++){
        for(var j = finalRecipes.length; j > i; j--){
          //Recipe i does not equal recipe j
          expect(JSON.stringify(finalRecipes[i])).not.toBe(JSON.stringify(finalRecipes[j]));
        }
      }
      done();
    }, 5000);
    
  })
  
  it("reassigns the TDEE to 1200 if a TDEE < 1200 is passed to it", function(done){
    
    //Autoreturns 0 for TDEE request
    spyOn(window, 'getQueryString').and.returnValue(0);
    spyOn(window, 'alert').and.callFake(function(val){console.log(val);});
    //Runs getWeeklyMeals
    getWeeklyMeals();
    
    //Waits 5 seconds
    setTimeout(function(){
      //finalRecipes should be 21 recipes long
      expect(finalRecipes.length).toBe(21);
      
      //Compare recipe i, to all later recipes j
      for(var i = 0; i < finalRecipes.length; i++){
        for(var j = finalRecipes.length; j > i; j--){
          //Recipe i does not equal recipe j
          expect(JSON.stringify(finalRecipes[i])).not.toBe(JSON.stringify(finalRecipes[j]));
        }
      }
      done();
    }, 5000);
  })
  
});
});
