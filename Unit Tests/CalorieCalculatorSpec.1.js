describe("User", function() {
  var user;

  beforeEach(function() {
    user = new userInfo("Female", 26, 165.1, 65.7709, "75");
  });

  it("should be able to change fields", function() {
    user.gender = "Male";
		user.age = 30;
		user.height = 170.1;
		user.weight = 72;
		user.activityFactor = "50";
		
    expect(user.gender).toEqual("Male");
		expect(user.age).toEqual(30);
		expect(user.height).toEqual(170.1);
		expect(user.weight).toEqual(72);
		expect(user.activityFactor).toEqual("50");

  });
});

describe("Calorie Calculator", function() {
    describe("calculateBMR", function() {
      var user;
      
      beforeEach(function() {
        user = new userInfo("Female", 26, 165.1, 65.7709, "75");
      });
      
    	// calculateBRM test 1: test for valid input
    	it("should have a BRM of ~1594.87 as female, 26 yrs, 165.1 cm, 65.7709 lbs, and Very active (75) lifestyle", function() {
        var bmr = calculateBMR(user);
    		
    		expect(bmr).toBeGreaterThan(1594.87);
    		expect(bmr).toBeLessThan(1594.88);
    
      });
      
      // calculateBRM test 2: test for null brm return value
      it("should return undefined because \"female\" is invalid value for gender", function() {
         user.gender = "female";
         var bmr = calculateBMR(user);
         
         expect(bmr).toBeUndefined();
      });
    });
    
    describe("calculateTDEE", function() {
      var user;
      
      beforeEach(function() {
        user = new userInfo("Female", 26, 165.1, 65.7709, "75");
      });
      
      // calculateTDEE test 1: test for valid input
      it("should have a TDEE of 2751.15075 with brm 1594.87 and Very active (75) lifestyle", function() {
         var bmr = 1594.87;
         user.bmr = bmr;
         user.activityFactor = 75;
         var tdee = calculateTDEE(user);
         
         expect(tdee).toEqual(2751.15075);
      });
      
      // calculateTDEE test 2: test for invalid activityFactor
      it("with brm of 1594.87 and invalid activityFactor of 100.1 should cause tdee to be set to 0", function() {
        user.bmr = 1594.87;
        user.activityFactor = 101;
        var tdee = calculateTDEE(user);
        
        expect(tdee).toEqual(0);
      });
    });
});
  


