describe("User", function() {
  var user;

  beforeEach(function() {
    user = new userInfo("female", 26, 165.1, 65.7709, "75");
  });

  it("should be able to change fields", function() {
    user.gender = "male";
		user.age = 30;
		user.height = 170.1;
		user.weight = 72;
		user.activityFactor = "50";
		
    expect(user.gender).toEqual("male");
		expect(user.age).toEqual(30);
		expect(user.height).toEqual(170.1);
		expect(user.weight).toEqual(72);
		expect(user.activityFactor).toEqual("50");

  });
	
	it("should have a BRM of ~1594.87 as female, 26 yrs, 165.1 cm, 65.7709 lbs, and Very active (75) lifestyle", function() {
    var bmr = calculateBMR(user);
		
		expect(bmr).toBeGreaterThan(1594.87);
		expect(bmr).toBeLessThan(1594.88);

  });
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
});
