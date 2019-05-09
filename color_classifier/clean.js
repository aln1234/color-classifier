let ref;
let database;

function setup() {
  noCanvas();
  // Initialize Firebase
  var config = {
      apiKey: "AIzaSyDgbjcC5F7USKfpb76iEgxlUKHEnH3vmew",
      authDomain: "color-classification-74317.firebaseapp.com",
      databaseURL:"https://color-classification-74317.firebaseio.com",
      projectId: "color-classification-74317",
      storageBucket: "color-classification-74317.appspot.com",
      messagingSenderId: "815796255423"
    };
  firebase.initializeApp(config);
  database = firebase.database();
  let ref = database.ref('colors');
  ref.once('value', gotData);



function gotData(results)
{
  let data = results.val();

  let allData={
    entries: []
  };


  let keys= Object.keys(data);
  for (let key of keys)
  {
    let record = data[key];
    allData.entries.push(record);

  }
  saveJSON(allData,'colorData.json');
  }
}
