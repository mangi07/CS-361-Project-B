
//getQueryString
describe("When the page loads", function(){
  
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
describe("When called with a recipe object", function(){

  var recipeObject = {};
  recipeObject.id = "123456";
  recipeObject.title = "Test Title";
  recipeObject.day = "1";
  recipeObject.slot = "2";
  
  beforeEach(function(){
    var fakeContent = document.createElement("div");
    fakeContent.id = "content";
    document.body.appendChild(fakeContent);
  });
  
  it("should create a div and append it to the 'content' div", function(){
      var content = document.getElementById("content");
      createMealDivs(recipeObject);
      expect(content.children.length).toBe(1);
  })
  
  afterEach(function (){
    var fakeContent = document.getElementById("content");
    document.body.removeChild(fakeContent);
  });
});

//getWeeklyMeals()

//getWeeklyMealsRequestCallback(req, reqQuery)



//


  // Ben: tests for mealplanner.js needed
  //   as described here: https://piazza.com/class/iir5jzwlu5d3ph?cid=378

/*
  describe("when song has been paused", function() {
    beforeEach(function() {
      player.play(song);
      player.pause();
    });

    it("should indicate that the song is currently paused", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });

    it("should be possible to resume", function() {
      player.resume();
      expect(player.isPlaying).toBeTruthy();
      expect(player.currentlyPlayingSong).toEqual(song);
    });
  });

  // demonstrates use of spies to intercept and test method calls
  it("tells the current song if the user has made it a favorite", function() {
    spyOn(song, 'persistFavoriteStatus');

    player.play(song);
    player.makeFavorite();

    expect(song.persistFavoriteStatus).toHaveBeenCalledWith(true);
  });

  //demonstrates use of expected exceptions
  describe("#resume", function() {
    it("should throw an exception if song is already playing", function() {
      player.play(song);

      expect(function() {
        player.resume();
      }).toThrowError("song is already playing");
    });
  });     */


// fiddling with it

/*
// string = name or title for a spec suite, usually what is under test
 function = block of code that implements the suite
 
 spec 
describe("string", function() {

describe("Hello world", function() {
  it("says hello", function() {
    expect(helloWorld()).toEqual("Hello world!");
  });

});


});

*/