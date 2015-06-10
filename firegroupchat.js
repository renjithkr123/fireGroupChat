'use strict';

// Add your Firebase app url here
var ref = new Firebase("https://<YOUR-FIREBASE-APP>.firebaseio.com");

//check authentication state 
var authData = ref.getAuth();

//Create user list html
function userHtml(user){
  if(user.connected){
    var html = '<li class="media">';
        html += '<div class="media-body">';
        html += '<div class="media">';
        html += '<a class="pull-left" href="javascript:;">';
        html += '<img class="media-object img-circle" style="max-height:40px;" src="'+user.img+'" /></a>';
        html += '<div class="media-body" ><h5>'+user.name+'</h5></div>';
        html += '</div></div></li>';
    $('.user_list').prepend(html);
  }
}

//Create chatlist html
function chatHtml(chat){
  var date = moment(chat.date).format("Do MMMM, h:mm a");
  var html = '<li class="media cht"> <div class="media-body"><div class="media">';
      html +='<a class="pull-left" href="javascript:;"><img class="media-object img-circle " src="'+chat.img+'" /></a>';
      html +='<div class="media-body" >'+chat.msg+' <br /><small class="text-muted">'+chat.name+' | '+date+'</small><hr />';
      html +='</div></div></div></li>';
  $('.chat_list').append(html);
  
}

//Always scroll to last message
function scrolltoTop(){
  $('.chat_list').animate({scrollTop: $('.chat_list')[0].scrollHeight});
}

//Get all user and chat data from firebase
function getData(authData){

  $('.fblogin').addClass('hide');
  $('.chat_container').removeClass('hide');
  $('.user_container').removeClass('hide');

  //Called  anytime new user data is added or updated in firebase
  ref.child("users").on("value", function(snapshot) {
    $('.user_list').empty();
    ref.child("users").on("child_added", function(snapshot) {
      userHtml(snapshot.val());
    });
  });

  //Triggered once for each existing chat and then again every time a new chat is added 
  ref.child("chats").on("child_added", function(snapshot) {
    chatHtml(snapshot.val());
  });

  //trigger after load all chat data and scroll to last message
  ref.child("chats").once("value", function(snap) {
      scrolltoTop();
  });

  var myConnectionsRef = ref.child('/users/'+authData.uid+'/connected');

  // stores the timestamp of my last disconnect (the last time I was seen online)
  var lastOnlineRef = ref.child('/users/'+authData.uid+'/lastOnline'); 

  var connectedRef = ref.child('/.info/connected');

  connectedRef.on('value', function(snap) {
    if (snap.val() === true) {
      // Do anything here that should happen only if online (or on reconnect)

      /// add this device to my connections list
      var con = myConnectionsRef.push(true);

      // when I disconnect, remove this device
      con.onDisconnect().remove();

      // when I disconnect, update the last time I was seen online
      lastOnlineRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
    }
  });

}

// Check user is logged in or not
if(authData) {
  getData(authData);
}else {
  $('.fblogin').removeClass('hide');
  console.log("User is not logged in");
}


// Authenticate user with facebook and save user data to firebase
$('.fblogin').click(function(){
  ref.authWithOAuthPopup("facebook", function(error, authData) {
    if (error) {
      console.log("Login Failed!", error);
    }else {
      ref.child("users").child(authData.uid).set({
        uid: authData.uid,
        provider: authData.provider,
        name: authData.facebook.displayName,
        img: authData.facebook.cachedUserProfile.picture.data.url,
      });
      var authData = authData;
      getData(authData);
    }
  });
});

//Send message to firebase server
$('.btn_send').click(function(){
    var msg = $('#inputMsg').val();
    if(msg.length > 0 && authData){
      ref.child("chats").push({
          name: authData.facebook.displayName,
          img: authData.facebook.cachedUserProfile.picture.data.url,
          msg: msg,
          date: Firebase.ServerValue.TIMESTAMP
      })
      $('#inputMsg').val('')
      scrolltoTop();
    }

});

//Trigger enter key keypress
 $('#inputMsg').keypress(function (e) {
   var key = e.which;
   if(key == 13)
    {
      $('.btn_send').click();
      return false;  
    }
  });   
