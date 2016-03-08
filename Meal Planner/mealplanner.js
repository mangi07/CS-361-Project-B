
// Ben: need to bind ajax response to Java function that persists meal plans
//  and add ui capability somewhere to load meal plans through a second Java function
var req = new XMLHttpRequest();

var reqData = {};
/**Get reqData parts here 
 * Each data part is per INDIVIDUAL meal
 * Import 
 **/

/* This JSON object will ultimately contain all the information for each recipe
returned by the initial recipes/mealplans/generate call. These will be appended
to finalRecipes[i]. Successive calls to different portions of the Spoonacular API
will add information as follows:
1. GET Compute Daily Meal Plan <recipes/mealplans/generate>
   obtains - id, title, imageType, imageUrls
2. GET Recipe Information <recipes/{id}/information> 
   obtains - sourceUrl (of outside website)
3. GET Extract Recipe From Website <recipes/extract> 
   obtains - servings, extendedIngredients, readyInMinutes, text, instructions
Once all these things have been appended, we have a finalized recipe object
that will be references as finalRecipes[i].
*/
var finalRecipes = [];
 
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

// Ben: swap comments on reqData['targetCalories'] assignment 
//   to deal with GET request from calorieCalculator.js
// reqData['targetCalories'] = getQueryString('tdee');
reqData['targetCalories'] = 2000;
reqData['timeFrame'] = "week";

//Build Query Here
/* Documentation at:
     https://market.mashape.com/spoonacular/recipe-food-nutrition#find-by-nutrients */
/* https://spoonacular-recipe-food-nutrition-v1.p.mashape.com */

var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/mealplans/generate?"
var reqDataKeys = Object.keys(reqData);
for(var i = 0; i < reqDataKeys.length; i++){
    reqQuery += reqDataKeys[i] + "=" + reqData[reqDataKeys[i]];
    if(i != reqData.length-1 ){
        reqQuery += "&";
    }
}


/*
   Production Key: bOmaZvaeU8mshuqpe8f0WkZqUCGMp1mxhsnjsnDvVjriaCBS6D 
   Testing Key: DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1
*/
var user = "ben2016";
var key = "DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1";


//Open and send query
req.open("GET", reqQuery , true);
req.setRequestHeader("X-Mashape-Key", key);


req.addEventListener('load', function(){
    var reqCount = 0;
    var failure = 0;
    /**
     * Do something here with the req.responseText
     */
     if (req.status >= 500){
        //Ensure only 8 requests are made at most
        if(++reqCount >= 8) {
            failure = 1;
            console.log("Sorry, we couldn't get a recipe.\n");
            return;
        }
        req.open("GET", reqQuery , true);
        req.setRequestHeader("X-Mashape-Key", key);
        req.send();
     } else {
/* Call to set up a list of recipes for the week given a daily calorie count
{
  "meals": [
    {
      "id": 484839,
      "title": "Chocolate Peanut Butter Banana Breakfast Shake",
      "readyInMinutes": 5,
      "image": "Chocolate-Peanut-Butter-Banana-Breakfast-Shake-484839.jpg",
      "imageUrls": [
        "Chocolate-Peanut-Butter-Banana-Breakfast-Shake-484839.jpg"
      ]
    },
*/
        var meals = JSON.parse(req.responseText);
        var content = document.getElementById("content");
        
        // Ben: for JQuery mobile css, some edits needed here
        // 1. GET Compute Daily Meal Plan <recipes/mealplans/generate>
        // obtains - id, title, imageType, imageUrls
        for(var i = 0; i < meals['items'].length; i++){
            var curMeal = meals['items'][i];
            finalRecipes.push(JSON.parse(curMeal.value));
            var newDiv = document.createElement("div");
            newDiv.id = "content";
            newDiv.innerHTML = JSON.stringify(curMeal);
            content.appendChild(newDiv);
        }
        // GET MEAL ID HERE
        // 2. addNutrientsToFinalRecipes and return recipe url
        // websiteUrl = getNutrientsReturnRecipeUrl(mealId, finalRecipes); // ajax call
        // 3. addRecipeInstructionsAndAnythingElse
        // extractRecipe(recipeWebsiteUrl); // ajax call
        // finalRecipes[i].push(remainingData);
        /* Java persist finalRecipes */
        
        /* Build Meal Plan Here
        for(var meal in meals){
            if(mealPlanCalories + meals[meal] < dailyMaxCalories){
                mealPlan[meal] = meals[meal];
            }
        }
        */
     }
});
req.send();

/* Call to request a recipe by nutrient content */
/* Request should return JSON as in this example:
           [
              {
                "id": 68608,
                "title": "Chocolate-Cannoli Roll",
                "image": "https://spoonacular.com/recipeImages/chocolate-cannoli_roll-68608.jpg",
                "imageType": "jpg",
                "calories": 280,
                "protein": "8g",
                "fat": "13g",
                "carbs": "35g"
              },
              ...etc
        */
/* TWEAK THIS FUNCTION */
// 2. GET Recipe Information <recipes/{id}/information> 
//    obtains - sourceUrl (of outside website)
// DATA Get Product Information
// make sure this returns sourceUrl
function getNutrientsReturnRecipeUrl(mealId, finalRecipes){
    //var reqCount = 0;
    //var failure = 0;
    /**
     * Do something here with the req.responseText
     */
//     if (req.status >= 500){
//        //Ensure only 8 requests are made at most
//        if(++reqCount >= 8) {
//            failure = 1;
//            console.log("getRecipeUrlFromID: Unable to get recipe url from meal id.\n");
//            return;
//        }
//        req.open("GET", reqQuery , true);
//        req.setRequestHeader("X-Mashape-Key", key);
//        req.send();
//     } else {
        /* Request should return JSON as in this example:
           [
              {
                "id": 68608,
                "title": "Chocolate-Cannoli Roll",
                "image": "https://spoonacular.com/recipeImages/chocolate-cannoli_roll-68608.jpg",
                "imageType": "jpg",
                "calories": 280,
                "protein": "8g",
                "fat": "13g",
                "carbs": "35g"
              },
              ...etc
        */
//        var meals = JSON.parse(req.responseText);
//        var content = document.getElementById("content");
        
        // Ben: for JQuery mobile css, some edits needed here
//        for(var i = 0; i < meals['items'].length; i++){
//            var curMeal = meals['items'][i];
//            finalRecipes.push(JSON.parse(curMeal.value));
//            var newDiv = document.createElement("div");
//            newDiv.id = "content";
//            newDiv.innerHTML = JSON.stringify(curMeal);
//            content.appendChild(newDiv);
}


/* IMPLEMENT AND DOCUMENT */
// 3. GET Extract Recipe From Website <recipes/extract> 
//    obtains - servings, extendedIngredients, readyInMinutes, text, instructions
function extractRecipe(recipeWebsiteUrl){}