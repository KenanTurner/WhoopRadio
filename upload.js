function printThing(...thing){console.log(...thing);}
function doNothing(evt){}
var onPlayerStateChange = printThing;
var onPlayerStateFail = printThing;
function handleYTEvent(event,callback = printThing,album = null){
	console.log(event);
	if(event.data == 5){ //loaded
		var data = uploadYT.getPlaylist();
		if(data){
			if(data.length==200){
				console.log("we got a problem");
			}
			console.log("Are you sure you want to upload a YT playlist this way?");
			//console.log("YT Playlist",data);
			onPlayerStateChange = doNothing;
			callback(data);
			//getYTVideo(data[0],handleYTEvent);
			//upload here prob
		}else{
			uploadYT.playVideo();
		}
	}
	if(event.data == 1){ //playing
		window.uploadYT.pauseVideo();
		let data = uploadYT.getVideoData();
		//console.log(data);
		let track = new Track(uploadYT.getVideoUrl(),data.title);
		track.filetype = "YT";
		track.artist = data.author;
		track.duration = uploadYT.getDuration();
		//callback(track);
		//console.log("New Track",track);
		onPlayerStateChange = doNothing;
		album = Album.fromJson(JSON.stringify(album));
		album.addTrack(track);
		//callback(album,true);
		//Bruh we have to wait for the xhr to complete before alerting the user...
		setTimeout(function(){callback(album,true);}, 100);
	}
}
function ajaxJsonPlaylist(response){
	try{
		let tmp = JSON.parse(response);
		tmp = Album.fromJson(JSON.stringify(tmp));
		//console.log(tmp)
		if(tmp.track_list.length == 0){
			throw "single_track"
		}
		//console.log(tmp);
		uploadAlbum(tmp,true);
	}catch(e){
		/*if(e == "single_track"){
			alert("Upload Failed. To upload a single track, use Upload Track");
		}else{
			alert("Upload Failed");
		}*/
		alert("Upload Failed");
	}
}
function ajaxJsonTrack(response,album){
	try{
		let tmp = JSON.parse(response);
		tmp = Track.fromJson(JSON.stringify(tmp));
		//console.log(tmp)
		if(!tmp.src || tmp.src == ""){
			throw "Invalid Track"
		}
		album = Album.fromJson(JSON.stringify(album));
		album.addTrack(tmp);
		//console.log(tmp,album);
		uploadAlbum(album,true);
	}catch(e){
		alert("Upload Failed");
	}
}
function DEPRECIATEDgetYTVideo(id,album,callback = handleYTEvent,secondCallback = uploadAlbum){
	uploadYT.setVolume(0);
	onPlayerStateChange = function(evt) {
			callback(evt,secondCallback,album);
		}
	onPlayerStateFail = function(evt) {
			alert("Upload Failed");
			onPlayerStateFail = doNothing;
		}
	uploadYT.cueVideoById(musicManager.getYoutubeId(id), 0);
}
function DEPRECIATEDgetYTPlaylist(id,callback = printThing){
	uploadYT.setVolume(0);
	onPlayerStateChange = callback;
	uploadYT.cuePlaylist({listType:'playlist',list: id,index:0,startSeconds:0});
}
function getYTPlaylist(id,folder){
	ajax('getYTPlaylist.php','POST',{'id':id,'folder':folder},ajaxJsonPlaylist,true);
}
function getYTTrack(id,album){
	ajax('getYTTrack.php','POST',{'id':id},function(response){ajaxJsonTrack(response,album)},true);
}
function getBCPlaylist(id){
	ajax('getBCPlaylist.php','POST',{'href':id},ajaxJsonPlaylist);
}
function getBCTrack(id,album){
	ajax('getBCTrack.php','POST',{'href':id},function(response){ajaxJsonTrack(response,album)},true);
}

function createUploadYT(id = "tmp-yt"){
	window.YT.ready(function() {
		window.uploadYT = new window.YT.Player(id, {
			height: "144",
			width: "100%",
			playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
			videoId: ""
		});
		uploadYT.addEventListener("onStateChange", function(evt) {
			onPlayerStateChange(evt);
		});
		uploadYT.addEventListener("onError", function(evt) {
			onPlayerStateFail(evt);
		});
	});
}
function createUploadSC(id = "tmp-sc"){
	window.uploadSC = "SC";
	uploadSC = SC.Widget(id);
	uploadSC.bind(SC.Widget.Events.FINISH, function() {
		if(uploadSC._isPlaying){
			uploadSC.pause();
		}
	});
	uploadSC.setVolume(0);
	console.log('SoundSoup is ready');
}
//https://soundcloud.com/waltzforluma/sets/sketches
function getSCPlaylist(url,album,singleTrack = false){
	uploadSC.load(url,{start_track:9999999,callback:function(){
		console.log('Widget is reloaded.');
		getSounds(uploadSC,album,singleTrack);
	}})
}
function getSounds(obj,album,singleTrack){
	obj.getSounds(function(currentSound) {
		//console.log(currentSound[0]);
		//console.log(currentSound[currentSound.length-1]);
		var isValid = true;
		currentSound.forEach(function(sound){
			if(!sound["permalink_url"]){
				isValid = false;
			}
		} );
		if(isValid){
			console.log("done");
			try{
				if(singleTrack && currentSound.length>1){
					throw "Must be single track";
				}
				currentSound.forEach(function(sound,index,array){
					console.log(sound);
					if(!sound.artwork_url){
						sound.artwork_url = sound.user.avatar_url;
						console.log(sound.artwork_url);
					}
					array[index] = new Track(sound.permalink_url,sound.title,sound.user.username,sound.duration/1000,"SC",-1,sound.artwork_url);
					album.addTrack(array[index]);
					//console.log(sound.title,sound.permalink_url);
				});
				console.log(album);
				uploadAlbum(album,true);
			}catch(e){
				if(singleTrack){
					alert("Upload Failed. To upload a soundcloud playlist, use Upload Album");
				}else{
					alert("Upload Failed");
				}
			}
		}else{
			console.log("100 mill");
			setTimeout(function () {
				return getSounds(obj,album,singleTrack);
			}, 100);
		}
	})
}

function ajax(url, type, data, callback, showError = false){
	return $.ajax({
		url: url,
		type: type,
		data: data,
		success: function(data) {
			callback(data);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log('ERROR: ' + jqXHR.status);
			if(showError){
				alert("Upload Failed");
			}
		}
	});
}

function downloadObj(obj) {
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(obj,null,'\t'));
	hiddenElement.target = '_blank';
	hiddenElement.download = 'data.json';
	hiddenElement.click();
}
function downloadMinObj(obj) {
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'data:attachment/text,' + encodeURI(JSON.stringify(obj));
	hiddenElement.target = '_blank';
	hiddenElement.download = 'data.json';
	hiddenElement.click();
}
function downloadAllAlbums() {
	var hiddenElement = document.createElement('a');
	hiddenElement.href = 'getData.php';
	hiddenElement.target = '_blank';
	hiddenElement.download = 'data.json';
	hiddenElement.click();
}
function quickUpdate(album,artworkUrl="",artist="",genre=""){
    album.artwork_url = artworkUrl;
    album.setArtists(artist);
    album.genre = genre;
    console.log(album);
    uploadAlbum(album);
}
function uploadAlbum(album,displayToUser = false){
	//console.log(album);
	let tmpAlbum = Album.fromJson(JSON.stringify(album));
	tmpAlbum.sort();
	var callback = function(data){
		console.log(data);
	}
	if(displayToUser){
		callback = function(data){
			console.log(data,"Alerting User");
			alert("Uploaded Successfully");
		}
	}
	$.ajax({
		url: 'setData.php',
		type: 'POST',
		data:({
			filename: album["title"],
			data: JSON.stringify(tmpAlbum,null,'\t')
		}),
		success:callback
	});
}
function uploadAllAlbums(){
	mm.data.forEach(function(album){
		uploadAlbum(album);
	});
}

/*examples
 * getYTPlaylist("PLplWQWlFS075ub5htDKmtPOBhn8JXL1YM","DOOM");
 * getYTPlaylist("PL66C3A99730C3F3F2","Minish Cap");
 * getYTVideo("https://youtu.be/B7T9t5Swu0c?list=PL66C3A99730C3F3F2",mm.data[0])
 */


