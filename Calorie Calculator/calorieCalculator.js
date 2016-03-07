/* TDEE calorie calculator
** TDEE = daily calorie requirements based off of gender, age, height, weight,
** and activity level.
** 
** calculates the users TDEE based off of this formula from this website
** http://www.superskinnyme.com/calculate-tdee.html
** formula is for TDEE = BMR * activity factor
*/

// user info object, stores the gender, age, height, weight, and activity factor
function userInfo(gender, age, height, weight, activityFactor) {
    this.gender = gender;
    this.age = age;
    this.height = height;
    this.weight = weight;
    this.activityFactor = activityFactor;
    this.bmr;
    this.tdee;
}

// function to capture user info from the DOM and put it into a user info object
function captureUserInfo(){
    var weight = document.getElementById("weightInput").value;
    var height = getInches();
    var age = document.getElementById("ageInput").value;
    var gender = document.getElementById("gender").value;
    var activityFactor = document.getElementById("activityFactor").value;
    var userObject = userInfo(gender, age, height, weight, activityFactor);
    return userObject;
}

document.addEventListener("DOMContentLoaded", bindSubmit);

function bindSubmit(){
    document.getElementById("submitButton").addEventListener("click", processInfo);
}

function uiExtract(){
    event.preventDefault();
    var user = captureUserInfo();
    var answer = processInfo(user); //testable portion
    document.getElementById("bmrAnswer").textContent = user.tdee;
    window.location.href = "../Meal Planner/mealplanner.html?tdee=" + answer;
}

function processInfo(userInfo){
    var answer = calculateBMR(userInfo);
    userInfo.bmr = answer;
    answer = calculateTDEE(userInfo);
    userInfo.tdee = answer;
    return userInfo;
}

// calculate the BMR of the user
function calculateBMR (userObject) {
    //var weight = document.getElementById("weightInput").value;
    //var height = getInches();
    //var age = document.getElementById("ageInput").value;
    //var gender = document.getElementById("gender").value;
    var bmr;
    if (userObject.gender == "female") {
        bmr = 655 + (4.35 * userObject.weight) + (4.7 * userObject.height) 
        - (4.7 * userObject.age);
    } else if (userObject.gender == "male") {
        bmr = 66 + (6.23 * userObject.weight) + (12.7 * userObject.height) 
        - (6.76 * userObject.age);
    }
    return bmr;
}

function getInches(){
    var feet = document.getElementById("heightFeetInput").value;
    var inches = document.getElementById("heightInchesInput").value;
    var heightInInches = parseInt((feet * 12)) + parseInt(inches);
    return heightInInches;
}

// calculate the TDEE
function calculateTDEE(userInfo) {
    var tdee;

    //console.log(document.getElementById("activityFactor").value);
    
    //switch(parseInt(document.getElementById("activityFactor").value)) {
    //redone for more test-o-rific style:
    switch(parseInt(userInfo.activityFactor)) {
        case 0:
            tdee = userInfo.bmr * 1.2;
            break;
        case 25:
            tdee = userInfo.bmr * 1.375;
            break;
        case 50:
            tdee = userInfo.bmr * 1.55;
            break;
        case 75:
            tdee = userInfo.bmr * 1.725;
            break;
        case 100:
            tdee = userInfo.bmr * 1.9;
            break;
        default:
            tdee = 0;
            console.log("ERROR! invalid activity factor!");
            break;
    }

    return tdee;
}

// for html file, function to fill in the 'select' menu options
function fillSelectChoices(field, array) {
    for (var i = 0; i < array.length; i++) {
        var option = document.createElement("option");
        option.value = array[i];
        option.text = array[i];
        field.add(option);
    }
}

// constants & select values for select menu
var genderChoices = ["female", "male"];
var activityChoices = ["Sedentary", "Light", "Moderate", "Very", "Extreme"];

// TODO: add a diet preferences to userInfo. diet preferences = vegetarian,
// vegan, paleo ?

// testing calculator and stuff
var testUser = new userInfo("female", 26, 165.1, 65.7709, "75");

testUser = processInfo(testUser);

console.log("Gender", testUser.gender);
console.log("Age", testUser.age);
console.log("Height in inches", testUser.height);
console.log("Weight in lbs", testUser.weight);
console.log("Activity factor (numerical)", testUser.activityFactor)
console.log("BMR", testUser.bmr);
console.log("TDEE", testUser.tdee);

//var testBMR = calculateBMR(testUser);
//testUser.bmr = testBMR;

//console.log("BMR: ", testUser.bmr);

//var testTdee = calculateTDEE(testUser);
//testUser.tdee = testTdee;

//console.log("TDEE: ", testUser.tdee);

// appending things to html
/*
var genderSelect = document.createElement("select");
document.body.appendChild(genderSelect);

fillSelectChoices(genderSelect, genderChoices);
*/

