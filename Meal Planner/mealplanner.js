
// Ben: need to bind ajax response to Java function that persists meal plans
//  and add ui capability somewhere to load meal plans through a second Java function
var req = new XMLHttpRequest();

var reqData = {};
/**Get reqData parts here 
 * Each data part is per INDIVIDUAL meal
 * Import 
 **/
 
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

var reqCount = 0;
var failure = 0;
req.addEventListener('load', function(){
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
        var meals = JSON.parse(req.responseText);
        var content = document.getElementById("content");
        
        // Ben: for JQuery mobile css, some edits needed here
        for(var i = 0; i < meals['items'].length; i++){
            var curMeal = meals['items'][i];
            var newDiv = document.createElement("div");
            newDiv.id = "content";
            newDiv.innerHTML = JSON.stringify(curMeal);
            content.appendChild(newDiv);
        }
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