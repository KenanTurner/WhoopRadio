function showTracks(album_div){
	hideTracks();
	let tmp = document.getElementsByClassName("album-container")[0];
	tmp.classList.add("show-tracks");
	album_div.children[2].classList.add("show-tracks");
	window.scrollTo(0, 0);
	for(let tracks of album_div.children[2].children){
		if(!tracks.children[2].children[0].src){ //lazyloading
			tracks.children[0].children[0].src = tracks.children[0].children[0].dataset.lazysrc;
			tracks.children[2].children[0].src = "images/heart-white.png";
		}
	}
	updateCurrentlyPlaying();
	document.getElementsByClassName("album-header")[0].classList.add("show-tracks");
	tmp = document.getElementsByClassName("track-header")[0];
	tmp.classList.add("show-tracks");
	let album = divElementToAlbum(album_div);
	tmp.children[1].children[0].innerText = album.title;
	tmp.children[1].children[1].innerText = album.getArtists();
	if(!album.getArtists()){
		tmp.children[1].children[1].innerText = "Unknown Artist";
	}
	tmp = document.getElementById("track-sort");
	tmp.dataset.index = sortByToIndex(divElementToAlbum(album_div).sort_by);
	tmp = document.getElementById("bg-image");
	tmp.style.backgroundImage = "url("+album.artwork_url+")";
	
}

function hideTracks(){
	hideDropDowns();
	let album = getParentDivByClass(document.getElementsByClassName("show-tracks")[3],"album");
	let tmp = document.getElementsByClassName("album-container")[0];
	tmp.classList.remove("show-tracks");	
	let tmp2 = document.getElementsByClassName("show-tracks");
	for(let trackList of tmp2){
		trackList.classList.remove("show-tracks");
	}
	if(album){
		scrollIntoViewHeader(album,"album-header");
	}
	
	document.getElementsByClassName("album-header")[0].classList.remove("show-tracks");
	document.getElementsByClassName("track-header")[0].classList.remove("show-tracks");
	let tmp3 = document.getElementById("track-sort");
	tmp3.classList.remove("show-content");
	
}

function getParentDivByClass(element,class_name){
	try{
		element.classList
	}catch(err){
		return false;
	}
	if(element.classList.contains(class_name)){
		return element;
	}else{
		return getParentDivByClass(element.parentElement,class_name);
	}
}

function divElementToTrack(element){
	element = getParentDivByClass(element,"track");
	if(!element){return false;}
	let album = mm.data.find(function(album){
		try{
			return album.title == element.children[1].children[0].dataset.album;
		}catch(err){
			return false;
		}
	});
	if(!album){
		return false;
	}
	let track = album.track_list.find(function(album){
		try{
			return album.title == element.children[1].children[0].innerText;
		}catch(err){
			return false;
		}
	});
	if(!track){
		return false;
	}
	return track;
}

function divElementToAlbum(element){
	element = getParentDivByClass(element,"album");
	if(!element){return false;}
	let album = mm.data.find(function(album){
		try{
			return album.title == element.children[1].children[0].innerText;
		}catch(err){
			return false;
		}
	});
	if(!album){
		return false;
	}
	return album;
}

function albumToDivElement(album){
	let albums = document.getElementsByClassName("album-container")[0].children;
	for (let item of albums) {
		if(item.dataset.title == album.title){
			return item;
		}
	}
	return false;
}
function updateTitle(bool){
	if(bool){
		document.title = mm.currentlyPlaying.track.title + ' // ' + mm.currentlyPlaying.album.title;
	}else{
		document.title = documentTitle;
	}
}

function trackToDivElement(album,track){
	let albumElement = albumToDivElement(album);
	if(!albumElement){return false;}
	for (let item of albumElement.children[2].children) {
		if(item.dataset.title == track.title){
			return item;
		}
	}
	return false;
}
function trackToDivElement2(albumElement,track){
	for (let item of albumElement.children[2].children) {
		if(item.dataset.title == track.title){
			return item;
		}
	}
	return false;
}

function updateTrackDuration(currentDuration){
	dur = document.getElementById('remaining-progress');
	dur.innerText = fancyTimeFormat(currentDuration);
	}
	function updateTrackTime(currentTime){
	bar = document.getElementById('progress-bar');
	if(mm.currentDuration==0){ //prevents division by zero
		bar.style.width = "0px";
	}else{
		bar.style.width = parseInt(((currentTime / mm.currentDuration) * document.getElementById('progress-container').clientWidth), 10) + "px";
	}
	pos = document.getElementById('current-progress');
	pos.innerText = fancyTimeFormat(currentTime);
}

function updateCurrentlyPlaying(){
	let track = mm.currentlyPlaying.track;
	let album = mm.currentlyPlaying.album;
	let trackElement = document.getElementById("currently-playing").children[0];
	if(track.artwork_url){
		trackElement.children[0].children[0].src = track.artwork_url;
	}else if(album.artwork_url){
		trackElement.children[0].children[0].src = album.artwork_url;
	}else{
		trackElement.children[0].children[0].src = "images/default-white.png";
	}
	trackElement.children[1].children[0].innerText = track.title;
	trackElement.children[1].children[0].dataset.album = album.title;
	if(track.artist){
		trackElement.children[1].children[1].innerText = track.artist;
	}else{
		trackElement.children[1].children[1].innerText = album.title;
	}
	trackElement.children[2].children[0].src = "images/heart-white.png";
	let oldElement = document.getElementById("currently-playing-track");
	var fragment = new DocumentFragment();
	if(oldElement){
		oldElement.children[0].children[0].src = oldElement.children[0].children[0].dataset.lazysrc;
		oldElement.id = "";
		oldElement.classList.remove("playing");
		oldElement.children[0].style.position = "";
		if(oldElement.children[0].childElementCount > 1){
			fragment.appendChild(oldElement.children[0].children[1]);
		}
	}
	let element = trackToDivElement(album,track);
	element.id = "currently-playing-track";
	element.children[0].children[0].src = "images/stopped.png";
	element.classList.add("playing");
	if(mm._isPlaying){
		element.children[0].children[0].src = "images/playing.gif";
	}
	if(!fragment.childElementCount){
		let div = document.createElement('div');
		div.classList.add('blur-img');
		fragment.appendChild(div);
	}
	fragment.children[0].style.backgroundImage = "url("+ element.children[0].children[0].dataset.lazysrc+")";
	element.children[0].style.position = "relative";
	element.children[0].appendChild(fragment);
}

//https://stackoverflow.com/a/11486026
function fancyTimeFormat(duration){   
	// Hours, minutes and seconds
	var hrs = ~~(duration / 3600);
	var mins = ~~((duration % 3600) / 60);
	var secs = ~~duration % 60;

	// Output like "1:01" or "4:03:59" or "123:03:59"
	var ret = "";

	if (hrs > 0) {
		ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
	}

	ret += "" + mins + ":" + (secs < 10 ? "0" : "");
	ret += "" + secs;
	return ret;
}

function toggleDropDown(id,trackSort=false){
	let tmp = document.getElementById(id);
	if(tmp.classList.contains("show-content")){
		hideDropDowns();
	}else{
		tmp.classList.add("show-content");
		tmp.children[tmp.dataset.index].focus();
		window.addEventListener("click", dropDownEvent);
	}
}
function dropDownEvent(event){
	// Close the dropdown if the user clicks outside of it
	let element = document.getElementsByClassName("show-content")[0];
	if(element.parentNode.contains(event.target)){
		
	}else{
		hideDropDowns();
	}
}
function hideDropDowns(){
	let tmp = document.getElementById("album-sort");
	if(tmp.classList.contains("show-content")){
		tmp.classList.remove("show-content");
	}
	tmp = document.getElementById("track-sort");
	if(tmp.classList.contains("show-content")){
		tmp.classList.remove("show-content");
	}
	window.removeEventListener("click", dropDownEvent);
}
function sortTracks(key,index,reversed=false){
	let albumElement = document.getElementsByClassName("show-tracks")[3];
	let album = divElementToAlbum(albumElement);
	album.sort(key,reversed);
	//var timer = new Timer();
	//timer.start();
	var fragment = new DocumentFragment();
	//albumElement.textContent = '';
	/*while (albumElement.lastChild) {
		albumElement.lastChild.remove();
	}*/
	let albumElement2 = albumToDivElement(album);
	album.track_list.forEach(function(track){
		let tmp = trackToDivElement2(albumElement2,track);
		//let tmp = track.toHTML(album.title,album.artwork_url);
		let subTitle = tmp.children[1].children[1];
		//console.log(subTitle);
		switch(key){
			case "artist":
				subTitle.innerText = track.artist;
				if(!track.artist){subTitle.innerText="Unkown Artist";}
				break;
			case "duration":
				subTitle.innerText = fancyTimeFormat(track.duration);
				if(track.duration == -1){subTitle.innerText="Undetermined Duration";}
				break;
			case "_upload_date":
				subTitle.innerText = new Date(track._upload_date).toUTCString();
				if(!track._upload_date){subTitle.innerText="Unknown Date";}
				break;
			default:
				tmp.children[1].children[1].innerText = track.artist;
				if(!track.artist){subTitle.innerText=album.title;}
			
		}
		//tmp.children[0].children[0].src = tmp.children[0].children[0].dataset.lazysrc;
		//tmp.children[2].children[0].src = "images/heart-white.png";
		//console.log(tmp);
		//tmp.parentNode.appendChild(tmp);
		fragment.appendChild(tmp);
	});
	albumElement.append(fragment);
	//timer.end();
	//alert(timer.end());
	let tmp = document.getElementById("track-sort");
	tmp.dataset.index = index;
	tmp.children[tmp.dataset.index].focus();
}
function sortByToIndex(key){
	switch(key){
		case "track_num":
			return 0;
		case "title":
			return 1;
		case "artist":
			return 2;
		case "duration":
			return 3;
		case "_upload_date":
			return 4;
	}
	return -1;
}
function sortAlbums(key, index=0,reversed=false){
	mm._sortAlbums(key,reversed);
	var fragment = new DocumentFragment();
	mm.data.forEach(function(album){
		let tmp = albumToDivElement(album);
		let tmpText = tmp.children[1].children[1];
		switch(key){
			case "artist":
				tmpText.innerText = album.getArtists();
				if(!album.getArtists()){tmpText.innerText="Unkown Artist";}
				break;
			case "genre":
				tmpText.innerText = album[key];
				if(!album[key]){tmpText.innerText="Unkown Genre";}
				break;
			case "description":
				tmpText.innerText = album[key];
				if(!album[key]){tmpText.innerText="No Description";}
				break;
			case "duration":
				tmpText.innerText = fancyTimeFormat(album.getTotalDuration());
				if(album.getTotalDuration() == 0){tmpText.innerText="Undetermined Duration";}
				break;
			case "_upload_date":
				tmpText.innerText = new Date(album[key]).toUTCString();
				if(!album[key]){tmpText.innerText="Unknown Date";}
				break;
			default:
				tmp.children[1].children[1].innerText = "";
			
		}
		//tmp.parentNode.appendChild(tmp);
		//window.scrollTo(0, 0);
		//let tmp = document.getElementsByClassName("album-container")[0];
		//tmp.children[0].children[1].children[1].innerText = "Austin Wintory";
		//console.log();
		fragment.appendChild(tmp);
	});
	let albumElement = document.getElementsByClassName("album-container")[0];
	albumElement.append(fragment);
	let tmp = document.getElementById("album-sort");
	tmp.dataset.index = index;
	tmp.children[tmp.dataset.index].focus();
	
}

function progressBarClick(e) {
	// calculate the normalized position clicked
	var clickPosition = (e.pageX  - this.offsetLeft) / this.offsetWidth;
	var clickTime = clickPosition * mm.currentDuration;

	// move the playhead to the correct position
	mm.fastForward(clickTime - mm.currentTime);
}

function loadEventListeners(){
	let trackCollection = document.getElementsByClassName("track-container");
	for (let trackList of trackCollection) { //track cards
		for (let track of trackList.children) {
			track.children[0].addEventListener('click', function(e) {
				mm.findTrack(divElementToAlbum(e.target),divElementToTrack(e.target));
				//e.target.src="images/playing.gif";
			});
			track.children[1].addEventListener('click', function(e) {
				//console.log(divElementToTrack(e.target));
				mm.findTrack(divElementToAlbum(e.target),divElementToTrack(e.target));
				//alert("Selected Track");
			});
			track.children[2].addEventListener('click', function(e) {
				//console.log(divElementToTrack(e.target));
				alert("Liked");
			});
			
		}
		trackList.addEventListener('contextmenu', function(e) {
			//alert("You've tried to open context menu"); //here you draw your own menu
			e.preventDefault();
			let track = divElementToTrack(e.target);
			if(track){
				showMenu("track-menu",track);
			}
		}, false);
		
	}
	let albums = document.getElementsByClassName("album-container")[0].children;
	for (let album of albums) { //album cards
		album.children[0].addEventListener('click', function(e) {
			//console.log(divElementToAlbum(e.target));
			//alert("Playing");
			showTracks(getParentDivByClass(e.target,"album"));
		});
		album.children[1].addEventListener('click', function(e) {
			//console.log(divElementToAlbum(e.target));
			//alert("Playing");
			showTracks(getParentDivByClass(e.target,"album"));
		});
		album.children[0].addEventListener('contextmenu', function(e) {
			//alert("You've tried to open context menu"); //here you draw your own menu
			e.preventDefault();
			console.log(divElementToAlbum(e.target));
			alert("Options");
		}, false);
		album.children[1].addEventListener('contextmenu', function(e) {
			//alert("You've tried to open context menu"); //here you draw your own menu
			e.preventDefault();
			console.log(divElementToAlbum(e.target));
			alert("Options");
		}, false);
	}
	document.addEventListener("visibilitychange", function(){
		if(document.hidden && mm._isPlaying){ //keeps yt playing
			mm.play();
		}
	}, true);
	//progress bar
	var progress = document.getElementById('progress-container');
	progress.addEventListener('click', progressBarClick);
	//currentlyPlaying
	let trackElement = document.getElementById("currently-playing").children[0];
	//if(trackElement.children[1].children[0].innerText == "Loading..."){
		//console.log(trackElement);
		trackElement.children[0].addEventListener('click', function(e) {
			//console.log(mm.currentlyPlaying);
			//console.log(albumToDivElement(mm.currentlyPlaying.album));
			showTracks(albumToDivElement(mm.currentlyPlaying.album));
			scrollIntoViewHeader(trackToDivElement(mm.currentlyPlaying.album,mm.currentlyPlaying.track));
			
		});
		trackElement.children[1].addEventListener('click', function(e) {
			//console.log(mm.currentlyPlaying);
			showTracks(albumToDivElement(mm.currentlyPlaying.album));
			scrollIntoViewHeader(trackToDivElement(mm.currentlyPlaying.album,mm.currentlyPlaying.track));
		});
		trackElement.children[2].addEventListener('click', function(e) {
			//console.log(divElementToTrack(e.target));
			alert("Liked");
		});
	//}
}

function playPauseEvent(){
	let btn = document.getElementById("playPauseBtn");
	let element = trackToDivElement(mm.currentlyPlaying.album,mm.currentlyPlaying.track);
	if(mm._isPlaying){
		btn.src = "images/pause-white.png";
		element.children[0].children[0].src = "images/playing.gif";
	}else{
		btn.src = "images/play-white.png";
		element.children[0].children[0].src = "images/stopped.png";
	}
}

function loopEvent(){
	let btn = document.getElementById("loopBtn");
	if(mm._isLooping){
		btn.src = "images/loop-highlight.png";
	}else{
		btn.src = "images/loop-white.png";
	}
}

function shuffleEvent(){
	let btn = document.getElementById("shuffleBtn");
	if(mm._isShuffling){
		btn.src = "images/shuffle-highlight.png";
	}else{
		btn.src = "images/shuffle-white.png";
	}
}

function volumeEvent(){
	let btn = document.getElementById("volumeBtn");
	if(mm.currentVol >= 0.66){
		btn.src = "images/speaker-white.png";
	}else if(mm.currentVol >= 0.33){
		btn.src = "images/speaker-white-66.png";
	}else if(mm.currentVol > 0){
		btn.src = "images/speaker-white-33.png";
	}else{
		btn.src = "images/speaker-white-mute.png";
	}
}

function setRootVariable(variable,value){
	document.documentElement.style.setProperty(variable, value);
}
function getRootVariable(variable){
	return getComputedStyle(document.body).getPropertyValue(variable).trim();
}

function scrollIntoViewHeader(element,id="track-header"){
	window.scroll(0, element.offsetTop - getHeaderHeight(id));
}

function getHeaderHeight(id){
	let header = document.getElementById(id);
	let headerHeight = header.offsetHeight;
	return headerHeight;
}

function txtBoxHasFocus(){
	if (document.activeElement.nodeName == 'TEXTAREA' || document.activeElement.nodeName == 'INPUT') {
		return true;
	}
	return false;
}

function keyUp(event){
	if(txtBoxHasFocus()){
		return;
	}
	if(event.which == 32 || event.which == 179) { //play pause: space
		mm.togglePlay();
	}
	if(event.which == 77) { //mute: m
		if(mm.currentVol>0){
			mm.changeVolume(0,true);
		}else{
			mm.changeVolume(1,true);
		}
	}
	if(event.which == 39) { //rewind forward: ->
		mm.fastForward(10);
	}
	if(event.which == 37) { //rewind forward: <-
		mm.fastForward(-10);
	}
	if(event.which == 38) { //vol up down: ^
		mm.changeVolume(0.1);
	}
	if(event.which == 40) { //vol up down: Down
		mm.changeVolume(-0.1);
	}
	if(event.which == 76) { //loop: L
		mm.toggleLoop();
	}
	if(event.which == 188 || event.which == 177) { //skip track: <
		mm.findNextTrack(-1);
	}
	if(event.which == 190 || event.which == 176) { //skip track: >
		mm.findNextTrack(1);
	}
	if(event.which == 219) { //skip folder: [
		mm.findNextFolder(-1);
	}
	if(event.which == 221) { //skip folder: ]
		mm.findNextFolder(1);
	}
	if(event.which == 83) { //shuffle: S
		mm.toggleShuffle();
	}
	if(event.which == 65) { //shuffle all: A
		mm.toggleShuffleAll();
	}
	/*if(event.which == 85) { //Upvote song
		mm.setTrackType('liked');
	}
	if(event.which == 88) { //X to xterminate song
		mm.setTrackType('skipped',force=true);
	}
	if(event.which == 69) { //E to expand all
		expandAll();
	}
	if(event.which == 67) { //C to collapse all
		collapseAll();
	}
	if(event.which == 80) { //p to play liked
		mm.toggleLikedTracks();
	}
	*/
	if(event.which == 96) { //Zero
		mm.fastForward(-1*mm.currentTime);
	}
}
//var mediaPause = false;
function keyDown(event){ //media controls
	if(event.which == 179) { //play pause: space
		mm.togglePlay();
	}
	/*if(event.which == 39) { //rewind forward: ->
		mm.fastForward(10);
	}
	if(event.which == 37) { //rewind forward: <-
		mm.fastForward(-10);
	}
	if(event.which == 38) { //vol up down: ^
		mm.changeVolume(0.1);
	}
	if(event.which == 40) { //vol up down: Down
		mm.changeVolume(-0.1);
	}*/
	if(event.which == 177) { //skip track: <
		mm.findNextTrack(-1);
	}
	if(event.which == 176) { //skip track: >
		mm.findNextTrack(1);
	}
}

class Timer{
	constructor(start=false){
		this.startTime;
		this.endTime;
		if(start){this.start();}
	}
	start() {
		this.startTime = new Date();
	};
	end() {
		this.endTime = new Date();
		var timeDiff = this.endTime - this.startTime; //in ms
		console.log(timeDiff + " ms");
		return timeDiff;
	}
	measureFunction(fun,...args){
		this.start();
		fun(...args);
		return this.end();
	}
	
}






