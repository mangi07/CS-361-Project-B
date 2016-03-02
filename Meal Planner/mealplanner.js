
var req = new XMLHttpRequest();

var reqData = {};
/*  Get reqData parts here */
reqData['maxcalories'] = "1500";
reqData['maxcarbs'] = "100";
reqData['maxfat'] = "100";
reqData['maxprotein'] = "100";
reqData['mincalories'] = "0";
reqData['minCarbs'] = "0";
reqData['minfat'] = "0";
reqData['minProtein'] = "0";



//Build Query Here
/* Documentation at:
     https://market.mashape.com/spoonacular/recipe-food-nutrition#find-by-nutrients */
/* https://spoonacular-recipe-food-nutrition-v1.p.mashape.com */
var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByNutrients?";
var reqDataKeys = Object.keys(reqData);
for(var i = 0; i < reqDataKeys.length; i++){
    reqQuery += reqDataKeys[i] + "=" + reqData[reqDataKeys[i]];
    if(i != reqData.length -1 ){
        reqQuery += "&";
    }
}

var user = "ben2016";
/*
   Production Key: bOmaZvaeU8mshuqpe8f0WkZqUCGMp1mxhsnjsnDvVjriaCBS6D 
   Testing Key: DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1
*/
var key = "DW9XSMsmJ9mshOb8Nu0OUsVY9ry7p1jwSaSjsnB20ChBTkFVg1";
//reqQuery += "&X-Mashape-Key=" + key;

var reqCount = 0;
var failure = 0;
//Open and send query
req.open("GET", reqQuery , true);
req.setRequestHeader("X-Mashape-Key", key);
req.addEventListener('load', function()
{
    /**
     * Do something here with the req.responseText
     */
     if (req.status >= 500)
     {
        //Ensure only 8 requests are made at most
        if(++reqCount >= 8){
            failure = 1;
            console.log("Sorry, we couldn't get a recipe.\n");
            return;
        }
        req.open("GET", reqQuery , true);
        req.setRequestHeader("X-Mashape-Key", key);
        req.send();
     }
     console.log(req.responseText);
});
req.send();