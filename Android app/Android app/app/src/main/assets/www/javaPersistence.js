/* Returns JSON object that was stored as string in Android internal storage. */
function javaLoadData() {
    return JSON.parse(Android.loadData());
}

function javaHasData(){
    return Android.hasData();
}

function javaSaveData(userObject) {
    Android.saveData(userObject);
}