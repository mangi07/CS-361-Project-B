
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
var user = "ben2016"; // not used
var key = "DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1";
var failure = 0;


var recipeObject = {};

recipeObject.id = getQueryString("id");
recipeObject.title = getQueryString("title");
assignUrlsAndNutrients(recipeObject);


/* Accepts a recipeObject that must contain at least the property id:number */
function assignUrlsAndNutrients(recipeObject){
    console.log("Request for: " + JSON.stringify(recipeObject));
    var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/"
        + recipeObject.id
        + "/information";
    var req = new XMLHttpRequest();
    //Open and send query
    req.open("GET", reqQuery , true);
    req.setRequestHeader("X-Mashape-Key", key);
    
    req.addEventListener('load', function(){
        assignUrlsAndNutRequestCallback(req, reqQuery, recipeObject);
    });
    
    req.send();
}

/*
    Pre-Conditions:
        (1) req is an XMLHttpRequest object,
        (2) reqQuery is of the form 
        "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/<id>/information"
        (3) valid key/value pair "X-Mashape-Key" in req Header is set
        (4) recipeObject contains two properties: id and title
    Post-Conditions:
        (1) Upon succesful response, each recipeObject should contain the following properties:
        id, title, sourceUrl, servings, extendedIngredients, readyInMinutes, imageUrl
    Note: This function is responsible for obtaining the last five properties in this list.
*/
function assignUrlsAndNutRequestCallback(req, reqQuery, recipeObject){
    var reqCount = 0;
    failure = 0;

    if (req.status >= 500){
        //Ensure only 8 requests are made at most
        if(++reqCount >= 8) {
            failure = 1;
            console.log("assignUrl: Unable to get recipe urls and nutrients from meal id.\n");
            return;
        }
        req.open("GET", reqQuery , true);
        req.setRequestHeader("X-Mashape-Key", key);
        req.send();
    } else {
        var response = JSON.parse(req.responseText);
        // parse response here
        recipeObject.sourceUrl = response.sourceUrl;
        recipeObject.servings = response.servings;
        recipeObject.extendedIngredients = response.extendedIngredients;
        recipeObject.readyInMinutes = response.readyInMinutes;
        recipeObject.imageUrl = response.image;
        assignRecipeInstructions(recipeObject);
    }
}

/*
    Pre-Conditions:
        (1) recipeObject.sourceUrl is a valid url
    Post-Conditions:
        (1) Upon succesful response, each recipeObject should contain the following properties:
            id, title, sourceUrl, servings, extendedIngredients, readyInMinutes, imageUrl, 
            text, and instructions
        OR global failure = 1 (through the callback)
    Note: This function is responsible for obtaining the last two properties in this list.
*/
function assignRecipeInstructions(recipeObject){
    var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?"
        + "forceExtraction=false&"
        + "url=" + recipeObject.sourceUrl;
        
    var req = new XMLHttpRequest();
    
    req.open("GET", reqQuery, true);
    req.setRequestHeader("X-Mashape-Key", key);
    
    req.addEventListener('load', function(){
        assignRecipeInstRequestCallback(req, reqQuery, recipeObject);
    });
    
    req.send();
}

/*
    Pre-Conditions:
        (1) req is a valid XMLHttpRequest object
        (2) reqQuery is of the following form:
            "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/extract?<url>"
        (3) recipeObject.sourceUrl is a valid url
    Post-Conditions:
        (1) Upon succesful response, each recipeObject should contain the following properties:
            id, title, sourceUrl, servings, extendedIngredients, readyInMinutes, imageUrl, 
            text, and instructions
        OR global failure = 1
    Note: This function is responsible for obtaining the last two properties in this list.
*/
function assignRecipeInstRequestCallback(req, reqQuery, recipeObject) {
        var reqCount = 0;
        failure = 0;

        if (req.status >= 500){
        //Ensure only 8 requests are made at most
        if(++reqCount >= 8) {
            failure = 1;
            console.log("assignRecipeInstructions: Unable to get recipe id =" + recipeObject.id + ".\n");
            return;
        }
            req.open("GET", reqQuery , true);
            req.setRequestHeader("X-Mashape-Key", key);
            req.send();
        } else {
            var response = JSON.parse(req.responseText);
            // parse response here
            recipeObject.text = response.text;
            recipeObject.instructions = response.instructions;
            createMealDivs(recipeObject);
        }
}

function createMealDivs(recipeObject){
    /* Needed - better way to display results */
    var header = document.getElementById("header").children[0];
    header.textContent += decodeURIComponent(recipeObject.title);
    var newDiv = document.createElement("div");
    newDiv.id = "content";
    newDiv.textContent = JSON.stringify(recipeObject);
    //Display recipe image
    var img=document.createElement("IMG");
    img.src=recipeObject.imageUrl;
    newDiv.appendChild(img);
    
    document.getElementById("content").appendChild(newDiv);
}
