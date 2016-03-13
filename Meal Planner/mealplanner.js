
/* javaPersistence.js must be loaded before this file
to include the functions:
javaLoadData and javaHasData */

/* This JSON object will ultimately contain all the information for each recipe
returned by the initial recipes/mealplans/generate call. These will be appended
to finalRecipes[i]. Successive calls to different portions of the Spoonacular API
will add information as follows:
1. GET Compute Daily Meal Plan <recipes/mealplans/generate>
   obtains - id, title
2. GET Recipe Information <recipes/{id}/information> 
   obtains - sourceUrl (of outside website), servings, extendedIngredients,
   readyInMinutes, and meal image url, 
3. GET Extract Recipe From Website <recipes/extract> 
   obtains - text, instructions
Once all these things have been appended, we have a finalized recipeObject
that will be referenced as finalRecipes[i].
*/
var finalRecipes = [];
//Recipe Object moved into closure for getWeeklyRequestCallback()
 
/** Function written by: Chris Ferdinandi 3/2/2015
 *  Sourced From: http://gomakethings.com/how-to-get-the-value-of-a-querystring-with-native-javascript/
 *
 *  Use: Will parse a url for "get" queries. Pass 'field' that you want, 'url' is optional
 **/
var getQueryString = function ( field, url ) {
    var href = url ? url : window.location.href;
    var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
    var string = reg.exec(href);
    return string ? string[1] : null;
};


/* Spoonacular API Documentation at:
    https://market.mashape.com/spoonacular/recipe-food-nutrition#find-by-nutrients
    https://spoonacular-recipe-food-nutrition-v1.p.mashape.com

    Production Key: bOmaZvaeU8mshuqpe8f0WkZqUCGMp1mxhsnjsnDvVjriaCBS6D 
    Testing Key: DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1
*/
var userObject = {};
//Ben's Key
//var key = "DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1";
//Sean's Key
var key = "tfLrZlE8BnmshZ63qgU2qsYtQ28Lp1QdIOHjsnwgplvCOGLesM";
var failure = 0;
var reqCount = 0;

/* This function initiates a chain of function calls as follows:
    getWeeklyMealsRequestCallback,
    assignUrlsAndNutrients,
    assignUrlsAndNutRequestCallback,
    assignRecipeInstructions,
    assignRecipeInstRequestCallback
    
    adding properties to a given recipeObject on each RequestCallback.
    Upon completion of this chain of function calls,
    if no particular request was attempted more than 7 times,
    each of the 21 recipeObjects should contain the following 9 properties:
        id, title, sourceUrl, servings, extendedIngredients, readyInMinutes, imageUrl, 
        text, and instructions
*/
function getWeeklyMeals() {
    var req = new XMLHttpRequest();
    var reqData = {};
    /**Get reqData parts here 
     * Each data part is per INDIVIDUAL meal
     **/

    // Ben: swap comments on reqData['targetCalories'] assignment 
    //   to deal with GET request from calorieCalculator.js
    
    reqData['targetCalories'] = getQueryString('tdee');
    
    if(parseInt(reqData['targetCalories']) < 1200 || isNaN(reqData['targetCalories'])){
        alert("Error: Unhealthy calorie intake indicated. Intake set to 1200 calories.");
        reqData['targetCalories'] = 1200;
    } 

    reqData['timeFrame'] = "week";
    document.getElementById('tdee').innerHTML = reqData['targetCalories'];
    
    var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?";
    reqQuery += "targetCalories=" + reqData['targetCalories'];
    reqQuery += "&timeFrame=" + reqData['timeFrame'];
    
    //Open and send query
    req.open("GET", reqQuery , true);
    req.setRequestHeader("X-Mashape-Key", key);
    req.addEventListener('load', function(){
        getWeeklyMealsRequestCallback(req, reqQuery);
        // add finalRecipes and tdee to userObject
        userObject.tdee = reqData['targetCalories'];
        userObject.finalRecipes = finalRecipes;
    });
    req.send();
    
    // trigger native Java method to persist userObject as a JSON string
    //   javaSaveData(JSON.stringify(userObject));

}

/* Upon succesful response, 
    adds 21 recipeObjects to the finalRecipes array,
    each recipeObject containing an id and title*/
function getWeeklyMealsRequestCallback(req, reqQuery){

    if (req.status >= 400) {
        //Ensure only 8 requests are made at most
        if(++reqCount >= 8) {
            console.log("Sorry, we couldn't get a meal plan.\n");
            failure = 1;
            return;
        }
        req.open("GET", reqQuery , true);
        req.setRequestHeader("X-Mashape-Key", key);
        req.send();
    } else {
        
        var meals = JSON.parse(req.responseText);
        
        var uniqueCallbackGenerator = function(curMeal){
            return function(){

                // 1. GET Compute Daily Meal Plan <recipes/mealplans/generate>
                // obtains - id, title
                var curMealInfo = JSON.parse(curMeal.value);  //Holds id, image type, and title
                
                /* All the data needed for a single recipe will be gathered into this object:
                id, title, */
                var recipeObject = {};                        //Unique recipe object for each function
                recipeObject.day = parseInt(curMeal.day);
                recipeObject.slot = parseInt(curMeal.slot);
                recipeObject.id = curMealInfo.id;
                recipeObject.title = curMealInfo.title;
                finalRecipes.push(recipeObject);              //Pushes unique object to global array
            };
        };
        
        for(var i = 0; i < meals['items'].length; i++){
            //Generates a unique callback for each meal
            var uniqueCallbackFunction = uniqueCallbackGenerator(meals['items'][i]);
            //Calls unique function
            uniqueCallbackFunction();
        }
        
        //finalRecipes should be fully populated with 21 unique recipeObjects
        for (var x = 0; x < finalRecipes.length; x++){
            createMealDivs(finalRecipes[x]);
        }
    }
}

function createMealDivs(recipeObject){
    var newDiv = document.createElement("div");
    newDiv.id = "content";
    var meal;
    if(recipeObject.slot==1){
        meal="Breakfast";
    }    
    else if (recipeObject.slot==2){
        meal="Lunch";
    }
    else if (recipeObject.slot==3){
        meal="Dinner";
    } else {
        meal="ERROR ";
    }
    
    var recipeTitle="Day " + recipeObject.day + " " + meal +  ":" + recipeObject.title;
    var newLink = document.createElement("a");
    newLink.id = recipeObject.id;
    newLink.href = "recipePage.html?id=" + recipeObject.id + "&title=" + recipeObject.title;
    newLink.textContent = recipeTitle;
    newDiv.appendChild(newLink);
    
    document.getElementById("content").appendChild(newDiv);
}

// check if App has saved meals
// if so...calls native Java method loadWeeklyMeals()
if (javaHasData()) {
    loadWeeklyMeals();
} else {
    getWeeklyMeals();
}


function loadWeeklyMeals() {
    // test this out
    userObject = JSON.parse(javaLoadData());
    var recipes = userObject.finalRecipes;
    for (var x = 0; x < recipes.length; x++){
        createMealDivs(recipes[x]);
    }
};



/* Needed - Persist finalRecipes in Java */

/* potential options:
 sqlite (database)
 localStorage (stored as a string with a keyvalue)
      here is an example of it working https://jsfiddle.net/4sof033n/1/
        negatives: stores the data as a giant string so we have to recreate the
        object if  we want to use it
            - only stores the first 21 recipes on the first call, so we have to make
                sure to check if data is stored before doing anything else
        pros: dont have to learn new things
      
      */