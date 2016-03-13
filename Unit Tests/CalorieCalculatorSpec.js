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
        spyOn(window, 'alert').and.callFake(function(val){console.log(val);});
        var tdee = calculateTDEE(user);
        
        expect(tdee).toEqual(0);
      });
    });
    
    describe("Capturing user info", function(){

  it("should alert the user if they try to enter an age < 18", function(){
    var ageInput = document.createElement("input");
    ageInput.id = "ageInput";
    ageInput.type = "number";
    ageInput.value = 17.9;
    document.body.appendChild(ageInput);
    
    spyOn(window, 'alert').and.callFake(function(){return 1;});
    captureUserInfo();
    expect(window.alert.calls.count()).toBe(1);
  })
  
  it("should alert the user if they try to enter a total height <= 0", function(){
    document.getElementById("ageInput").value = 18;
    
    var heightFeetInput = document.createElement("input");
    heightFeetInput.id = "heightFeetInput";
    heightFeetInput.type = "number";
    heightFeetInput.value = -1;

    var heightInchesInput = document.createElement("input");
    heightInchesInput.id = "heightInchesInput";
    heightInchesInput.type = "number";
    heightInchesInput.value = -1;
    
    document.body.appendChild(heightFeetInput);
    document.body.appendChild(heightInchesInput);
    
    spyOn(window, 'alert').and.callFake(function(){return 1;});
    captureUserInfo();
    expect(window.alert.calls.count()).toBe(1);
  })
  
  it("should alert the user if they try to enter a weight <= 0", function(){

    document.getElementById("heightFeetInput").value = 6;
    document.getElementById("heightInchesInput").value = 2;
    
    var weightInput = document.createElement("input");
    weightInput.id = "weightInput";
    weightInput.type = "number";
    weightInput.value = -1;
    
    document.body.appendChild(weightInput);
    
    spyOn(window, 'alert').and.callFake(function(){return 1;});
    captureUserInfo();
    document.body.removeChild(document.getElementById("ageInput"));
    document.body.removeChild(document.getElementById("heightFeetInput"));
    document.body.removeChild(document.getElementById("heightInchesInput"));
    document.body.removeChild(document.getElementById("weightInput"));
    expect(window.alert.calls.count()).toBe(1);
  })
  

});

});





