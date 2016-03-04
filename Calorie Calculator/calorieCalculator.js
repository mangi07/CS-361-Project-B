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

// calculate the BMR of the user
function calculateBMR (user) {
    if (user.gender == "female") {
        var bmr = 655 + (9.6 * user.weight) + (1.8 * user.height) - (4.7 * user.age);
    } else if (user.gender == "male") {
        var bmr = 66 + (13.7 * user.weight) + (5 * user.height) - (6.8 * user.age);
    }
    return bmr;
}

// calculate the TDEE
function calculateTDEE(user, bmr) {
    var tdee;

    switch(user.activityFactor) {
        case "Sedentary" :
            tdee = bmr * 1.2;
            break;
        case "Light" :
            tdee = bmr * 1.375;
            break;
        case "Moderate" :
            tdee = bmr * 1.55;
            break;
        case "Very" :
            tdee = bmr * 1.725;
            break;
        case "Extreme" :
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
var genderSelect = document.createElement("select");
document.body.appendChild(genderSelect);

fillSelectChoices(genderSelect, genderChoices);

