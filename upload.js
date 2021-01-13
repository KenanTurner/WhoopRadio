function printThing(thing){console.log(thing);}
function onPlayerStateChange(event,callback = printThing) {
	console.log("event: ",event);
	if(event.data == 5){ //loaded
		var data = uploadYT.getPlaylist();
		if(data){
			if(data.length==200){
				console.log("we got a problem");
			}
			console.log(data);
			uploadYT.playVideo();
			//upload here prob
		}else{
			uploadYT.playVideo();
		}
	}
	if(event.data == 1){ //playing
		window.uploadYT.pauseVideo();
		let data = uploadYT.getVideoData();
		console.log(data);
		let track = new Track(uploadYT.getVideoUrl(),data.title);
		track.filetype = "YT";
		track.artist = data.author;
		track.duration = uploadYT.getDuration();
		callback(track);
	}
}
function DEPRECIATEDgetYTPlaylist(id){
	uploadYT.setVolume(0);
	uploadYT.cuePlaylist({listType:'playlist',list: id,index:0,startSeconds:0});
}
function getYTPlaylist(id,folder,callback = printThing){
	ajax('getYTPlaylist.php','POST',{'playlist_id':id,'folder':folder},function(response){
		let tmp = JSON.parse(response);
		tmp[1].forEach(function(track,index,array){
			array[index] = Track.fromJson(track);
		});
		tmp = Album.fromJson(JSON.stringify(tmp));
		callback(tmp);
	});
}
function getYTVideo(id){
	uploadYT.setVolume(0);
	uploadYT.cueVideoById(musicManager.getYoutubeId(id), 0);
}
function createUploadYT(){
	window.YT.ready(function() {
		window.uploadYT = new window.YT.Player('tmp_player', {
			height: "144",
			width: "100%",
			playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
			videoId: ""
		});
		uploadYT.addEventListener('onStateChange','onPlayerStateChange');
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
function uploadAlbum(album){
	//console.log(album);
	let tmpAlbum = Album.fromJson(JSON.stringify(album));
	tmpAlbum.sort();
	$.ajax({
		url: 'setData.php',
		type: 'POST',
		data:({
			filename: album["title"],
			data: JSON.stringify(tmpAlbum,null,'\t')
		}),
		success:function(results) {
			console.log(results);
		}
	});
}
function uploadAllAlbums(){
	mm.data.forEach(function(album){
		uploadAlbum(album);
	});
}


