angular.module('firebaseConfig', ['firebase'])
.run(function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDsQzl3UAu6anRw0n_eEYXhfDepOE_Q8MU",
    authDomain: "myqms-ab85f.firebaseapp.com",
    databaseURL: "https://myqms-ab85f.firebaseio.com/",
    storageBucket: "myqms-ab85f.appspot.com",
  };
  firebase.initializeApp(config);
})