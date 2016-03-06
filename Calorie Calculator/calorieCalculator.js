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

document.addEventListener("DOMContentLoaded", bindSubmit);

function bindSubmit(){
    document.getElementById("submitButton").addEventListener("click", processInfo);
}

function processInfo(){
    event.preventDefault();
    var answer = calculateBMR();
    answer = calculateTDEE(answer);
    document.getElementById("bmrAnswer").textContent = answer;
    window.location.href = "../Meal Planner/mealplanner.html?tdee=" + answer;
    
}

// calculate the BMR of the user
function calculateBMR () {
    var weight = document.getElementById("weightInput").value;
    var height = getInches();
    var age = document.getElementById("ageInput").value;
    var gender = document.getElementById("gender").value;
    var bmr;
    if (gender == "Female") {
        bmr = 655 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
    } else if (gender == "Male") {
        bmr = 66 + (6.23 * weight) + (12.7 * height) - (6.76 * age);
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
function calculateTDEE(bmr) {
    var tdee;

    console.log(document.getElementById("activityFactor").value);
    
    switch(parseInt(document.getElementById("activityFactor").value)) {
        case 0:
            tdee = bmr * 1.2;
            break;
        case 25:
            tdee = bmr * 1.375;
            break;
        case 50:
            tdee = bmr * 1.55;
            break;
        case 75:
            tdee = bmr * 1.725;
            break;
        case 100:
            tdee = bmr * 1.9;
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
var user = new userInfo("female", 26, 165.1, 65.7709, "Very");

var bmr = calculateBMR(user);
user.bmr = bmr;

console.log("BMR: ", user.bmr);

var tdee = calculateTDEE(user, user.bmr);
user.tdee = tdee;

console.log("TDEE: ", user.tdee);

// appending things to html
/*
var genderSelect = document.createElement("select");
document.body.appendChild(genderSelect);

fillSelectChoices(genderSelect, genderChoices);
*/

