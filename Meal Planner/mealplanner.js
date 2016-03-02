
var req = new XMLHttpRequest();

var reqData = {};
/*  Get reqData parts here
reqData['maxcalories'] = 
reqData['maxcarbs'] = 
reqData['maxfat'] = 
reqData['maxprotein'] = 
reqData['mincalories'] = 
reqData['minCarbs'] = 
reqData['minfat'] = 
reqData['minprotein'] = 
*/


//Build Query Here
var reqQuery = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByNutrients?";
var reqDataKeys = Object.keys(reqData);
for(var i = 0; i < reqData.length; i++){
    reqQuery += reqDataKeys[i] + "=" + reqData[i];
    if(i != reqData.length -1 ){
        reqQuery += "&";
    }
}

//Open and send query ***NEEDS API USER/KEY
req.open("GET", reqQuery , true /*user, password*/);
req.addEventListener('load', function(){
    /**
     * 
     * Do something here with the req.responseText
     * 
     */
});
req.send();