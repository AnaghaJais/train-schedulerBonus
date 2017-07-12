var config = {
    apiKey: "AIzaSyCPeD_m4M-00LiLAVvRE7Gzdizim2qDD4A",
    authDomain: "anaproject-4cb91.firebaseapp.com",
    databaseURL: "https://anaproject-4cb91.firebaseio.com",
    projectId: "anaproject-4cb91",
    storageBucket: "anaproject-4cb91.appspot.com",
    messagingSenderId: "78796771551"
  };
 
  firebase.initializeApp(config);
 var database = firebase.database();
var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope("profile");
provider.addScope("email");
var provider1 = new firebase.auth.GithubAuthProvider();
 
 $(".second-page").hide();


$(".signIn").on("click",function(){

firebase.auth().signInWithPopup(provider).then(function(result) {
     // This gives you a Google Access Token.
     var token = result.credential.accessToken;
     // The signed-in user info.
     var user = result.user;
     $(".signIn-1").remove();
 $(".signIn").remove();
     $(".second-page").show();    
  
});
 
});
$(".signIn-1").on("click",function(){

  firebase.auth().signInWithPopup(provider1).then(function(result) {
   // This gives you a GitHub Access Token.
   var token = result.credential.accessToken;
   // The signed-in user info.
   var user = result.user;
 }).catch(function(error) {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // The email of the user's account used.
   var email = error.email;
   // The firebase.auth.AuthCredential type that was used.
   var credential = error.credential;
   if (errorCode === 'auth/account-exists-with-different-credential') {
     alert('You have signed up with a different provider for that email.');
     // Handle linking here if your app allows it.
   } else {
     console.error(error);
   }
   $(".signIn-1").remove();
 $(".signIn").remove();
 });

});

var firstTime;
var tFrequency;
var trainName;
var destination;
var nextArrival;
var tMinutesTillTrain;
//var clock;
var counter=4;                                                                                                                                                                                                                                                                                                                                                                                                                                                               


$("#add-employee-btn").on("click", function(event) {
  event.preventDefault(); 

   //clock = setInterval(times, 60000);
  trainName = $("#train-name-input").val().trim();
  destination = $("#destination-input").val().trim();
  firstTime = $("#train-time-input").val().trim();
   tFrequency = $("#frequency-input").val().trim();
   console.log(firstTime);
   var time=moment(firstTime, "hh:mm");
//console.log(time);
   minutesAway(trainName,tFrequency,destination,firstTime);
    // Time is 3:30 AM
    //ar firstTime = "03:30";

    // First Time (pushed back 1 year to make sure it comes before current time)
   
   $(".form-control").val("");
  // Creates local "temporary" object for holding employee data
  
});

database.ref().on("child_added", function(childSnapshot) {
//$(this).closest('tr').index();
  console.log(childSnapshot.val());
  var key=childSnapshot.key;
  console.log(key);
  var trainame = childSnapshot.val().name;
  var traindest= childSnapshot.val().destination;
  var trainFrequency = childSnapshot.val().frequency;
  var arrival=childSnapshot.val().nextArrival;
  var minutes=childSnapshot.val().minutesAway1;
new_arrival=moment().add(arrival,"minutes");
  console.log(new_arrival);
  
  $("#employee-table > tbody").append("<tr class="+key+"><td contenteditable='false' class='item1'>" +  trainame  + "</td><td contenteditable='false'class='item2'>" + traindest + "</td><td contenteditable='false'class='item3'>"
   + trainFrequency +"</td><td contenteditable='false'class='item4'>" + arrival + "</td><td contenteditable='false'class='item5'>" + minutes + "</td>"+"<td><button class='update1' data="+key+">Update</button></td>"+
"<td><button class='delete' data="+key+">Remove</button></td></tr>");
  //counter=4;
  
/*setInterval(function(){
  var current_time=moment().format("hh:mm");
console.log(current_time);

if(arrival>current_time){
 minutes--;
  database.ref(key).update({minutesAway1:minutes});
}
else{
  new_arrival=moment(arrival,"minutes").add(trainFrequency);
  var minutes1=moment(new_arrival,"minutes").diff(moment());
  console.log(new_arrival);
   database.ref(key).update({nextArrival:new_arrival,minutesAway1:minutes1}); 
}},60000);*/

});

function minutesAway(name1,frequency1,destination1,firstTime1){
var time=moment(firstTime1, "hh:mm");
console.log(time);
   var firstTimeConverted = moment(firstTime1, "hh:mm").subtract(1, "years");
    
    console.log(firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % frequency1;
    console.log(tRemainder);

    // Minute Until Train
     tMinutesTillTrain = frequency1 - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
     nextArrival=moment(nextTrain).format("hh:mm")
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

    var newTrain = {
    name: name1,
    destination: destination1,   
   frequency: frequency1,
   firstTime:firstTime1,
   nextArrival:nextArrival,
   minutesAway1:tMinutesTillTrain
  };

  // Uploads employee data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain. destination);
  console.log(newTrain.frequency);  

}
$(document).on("click",".delete",function(){
   var kew= $(this).attr("data");
    database.ref(kew).remove();
    $("."+kew).remove();
   
});


$(document).on("click",".update1",function(){
   
     var key=$(this).attr("data");
console.log(key);
     //var new1=$(this).val("td");
     var row = $(this).closest("tr").attr("class");

     console.log(row);
   
          var currentTD = $(this).closest("tr").find("td");
         //var new1= $(this).parents('tr').find('td[0]').val();
          //console.log(currentTD);
         // console.log(new1);
          if ($(this).html() == "Update") {                  
              $.each(currentTD, function () {
                  $(this).prop('contenteditable', true)
                  
              });
          } else {
             $.each(currentTD, function () {
                  $(this).prop('contenteditable', false)
              });
          }
         
          $(this).html($(this).html() == 'Update' ? 'Save' : 'Update')




 var name11 =$(this).closest("tr").find(".item1").text();
 console.log(name11);
 var destination11 =$(this).closest("tr").find(".item2").text();
var frequency11 = $(this).closest("tr").find(".item3").text();
var nextArrival11 =$(this).closest("tr").find(".item4").text();
var away =moment().diff(moment(nextArrival11), "minutes"); 
console.log(away);
console.log(destination11);
   console.log(frequency11);
   console.log(nextArrival11);
   console.log(away);
   

   var result=database.ref(key);
 // //var key=result.push().key;
 var updates={};
 updates={
    name: name11,
    destination: destination11,   
   frequency: frequency11,   
   nextArrival:nextArrival11,
   minutesAway1:away
 };

 var mainresult=result.update(updates);

 // minutesAway();
  });
database.ref().on("child_changed", function(childSnapshot) {
var key1=childSnapshot.key;
console.log(key1);
var trainame = childSnapshot.val().name;
console.log(trainame);
  var traindest= childSnapshot.val().destination;
  var trainFrequency = childSnapshot.val().frequency;

  var arrival=childSnapshot.val().nextArrival;
  var minutes=childSnapshot.val().minutesAway1;

  
  $("."+key1).html("<td contenteditable='false' class='item1'>" +  trainame  + "</td><td contenteditable='false'class='item2'>" + traindest + "</td><td contenteditable='false'class='item3'>"
   + trainFrequency +"</td><td contenteditable='false'class='item4'>" + arrival + "</td><td contenteditable='false'class='item5'>" + minutes + "</td>"+"<td><button class='update1' data="+key1+">Update</button></td>"+
"<td><button class='delete' data="+key1+">Remove</button></td></tr>");

});