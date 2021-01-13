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
function getYTPlaylist(id){
	uploadYT.setVolume(0);
	uploadYT.cuePlaylist({listType:'playlist',list: id,index:0,startSeconds:0});
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


