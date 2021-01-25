function genUser(){
	return "_"+Math.random().toString(36).substr(2,9);
}

//Delete all track cookies
function deleteTrackCookies(){
	console.log("Deleting Track Cookies");
	trackType = {};
	setLocalStorage("trackType", trackType, true);
	location.reload();
}

//display all tracked cookies
function loadCookies(){
	var cookies = document.cookie;
	console.log(cookies);
}

//gets cookie by name
function cookieToArr(name){
	var json_str = getCookie(name);
	var arr = JSON.parse(json_str);
	return arr;
}

//sets cookie by name
function arrToCookie(name, arr, exdays){
	var json_str = JSON.stringify(arr);
	setCookie(name, json_str, exdays);
	
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for(var i = 0; i <ca.length; i++) {
	var c = ca[i];
	while (c.charAt(0) == ' ') {
	  c = c.substring(1);
	}
	if (c.indexOf(name) == 0) {
	  return c.substring(name.length, c.length);
	}
  }
  return "";
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function deleteCookie(cname) {
  var d = new Date();
  d.setTime(d.getTime() + (-1*24*60*60*1000)); //expires yesterday
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=;"+ expires + ";path=/";
}

function logCustomUser(id,page) {
    $.ajax({
        url: 'logCustomUser.php',
        type: 'POST',
        data: {id:id, page:page},
        success: function(data) {
            console.log('Custom user logged'); // Inspect this in your console
        }
    });
};

//Onload
function loaded(){
    //Check for user id
    var userId = getCookie("userId");
    if (userId == ""){
	console.log("Initializing UserId");
	userId = genUser();
	setCookie("userId", userId, 365);
    }
    console.log("User: ",userId);
    logCustomUser(userId,window.location.pathname);
}

function logUserEvent(...logging){
    var userId = getCookie("userId");
    if (userId == ""){
	    console.log("Initializing UserId");
	    userId = genUser();
	    setCookie("userId", userId, 365);
    }
    var page = window.location.pathname;
    var data = JSON.stringify(logging);
    $.ajax({
        url: 'logCustomUser.php',
        type: 'POST',
        data: {
	    id:userId,
	    page:page,
	    data:data
	},
        success: function(data) {
            //console.log('Custom Action logged'); // Inspect this in your console
        }
    });
}

function getAllStorage() {

    var archive = [],
        keys = Object.keys(localStorage),
        i = 0, key;

    for (; key = keys[i]; i++) {
        archive.push( key + '=' + localStorage.getItem(key));
    }
    console.log(archive);
    return archive;
}

//creates a string variable in local storage
function setLocalStorage(name,value,jsonify=false){
	if(jsonify){
		var json_str = JSON.stringify(value);
		window.localStorage.setItem(name, json_str);
	}else{
		window.localStorage.setItem(name, value);
	}
}

//retrieves a variable in local storage
function getLocalStorage(name,jsonify=false){
	if(window.localStorage.getItem(name)==null){
		return "";
	}
	if(jsonify){
		return JSON.parse(localStorage.getItem(name));
	}else{
		return window.localStorage.getItem(name);
	}
}

function deleteLocalStorage(name){
	localStorage.removeItem(name);
}

loaded();
