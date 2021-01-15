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
		album.addTrack(track);
		//callback(album,true);
		//Bruh we have to wait for the xhr to complete before alerting the user...
		setTimeout(function(){callback(album,true);}, 100);
	}
}
function ajaxYTPlaylist(response){
	try{
		let tmp = JSON.parse(response);
		tmp = Album.fromJson(JSON.stringify(tmp));
		//console.log(tmp)
		if(tmp.track_list.length == 0){
			throw "Bad Playlist Id"
		}
		uploadAlbum(tmp,true);
	}catch(e){
		alert("Upload Failed");
	}
}
function getYTVideo(id,album,callback = handleYTEvent,secondCallback = uploadAlbum){
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
	ajax('getYTPlaylist.php','POST',{'playlist_id':id,'folder':folder},ajaxYTPlaylist);
}

function createUploadYT(){
	window.YT.ready(function() {
		window.uploadYT = new window.YT.Player('tmp_player', {
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

function ajax(url, type, data, callback){
	return $.ajax({
		url: url,
		type: type,
		data: data,
		success: function(data) {
			callback(data);
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


