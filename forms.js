function showMenu(id="settings-menu",...args){
	let menu = document.getElementById(id);
	menu.style.display = "block";
	document.body.style.overflow = "hidden";
	window.addEventListener("click", menuEvent);
	if(id=="settings-menu"){
		return loadSettingsMenu(mm.usrPrefs.customSettings);
	}
	if(id=="track-menu"){
		return loadTrackMenu(...args);
	}
	if(id=="upload-track-menu"){
		return loadUploadTrackMenu(...args);
	}
	if(id=="upload-album-menu"){
		return loadUploadAlbumMenu(...args);
	}
}
function loadSettingsMenu(settings = new CustomSettings()){
	let tags = document.getElementsByTagName("input");
	for(let ele of tags){
		if(ele.type == "color"){
			ele.value = settings[ele.name.replace(/-/g, '_').slice(2)];
			//console.log(ele.parentNode.style.backgroundColor);
			ele.parentNode.style.backgroundColor = ele.value;
			ele.onchange = function() {
				ele.parentNode.style.backgroundColor = ele.value;    
			}
		}
	}
	for(item in settings){
		//console.log("--"+item.replace(/_/g, '-'));
		document.getElementById("--"+item.replace(/_/g, '-')).defaultValue = settings[item];
		if(item[0] != "#"){
			document.getElementById("--"+item.replace(/_/g, '-')).defaultValue = settings[item].substring(0, settings[item].length - 3);
		}
	}
}
function loadTrackMenu(track = Track.fromJson(document.getElementById("track-form").dataset.track)){
	track = Track.fromJson(JSON.stringify(track));
	let tags = document.getElementsByTagName("input");
	for(item in track){
		//console.log("--"+item.replace(/_/g, '-'));
		//console.log("track-"+item.replace(/_/g, '-'));
		let input = document.getElementById("track-"+item.replace(/_/g, '-'));
		if(input){
			input.defaultValue = track[item];
			if(item == "filetype"){
				switch(track.filetype){
					case "BC":
						input.selectedIndex = 1;
						break;
					case "SC":
						input.selectedIndex = 2;
						break;
					case "YT":
						input.selectedIndex = 3;
						break;
					case "HTML":
						input.selectedIndex = 4;
						break;
					default:
						input.selectedIndex = 0;
				}
			}
		}
		//document.getElementById("track-"+item.replace(/_/g, '-')).defaultValue = track[item];
	}
	let form = document.getElementById("track-form")
	form.dataset.track = JSON.stringify(track);
}

function loadUploadTrackMenu(){
	let albumNames = [];
	var fragment = new DocumentFragment();
	mm.data.forEach(function(album){
		albumNames.push(album.title);
		let div = document.createElement('option');
		div.value = album.title;
		div.innerText = album.title;
		fragment.appendChild(div);
	});
	//console.log(fragment);
	let select = document.getElementById("upload-track-album");
	select.appendChild(fragment);
	
}
function loadUploadAlbumMenu(){
	let albumNames = [];
	var fragment = new DocumentFragment();
	mm.data.forEach(function(album){
		albumNames.push(album.title);
		let div = document.createElement('option');
		div.value = album.title;
		div.innerText = album.title;
		fragment.appendChild(div);
	});
	//console.log(fragment);
	let select = document.getElementById("upload-album-album");
	select.appendChild(fragment);
	
}
function uploadNewTrack(){
	if(!verifyForm("upload-track-form","All entries must be filled out","filetype")){
		return;
	}
	let form = document.getElementById("upload-track-form");
	let formData = new FormData(form);
	let track = new Track("LONGANDRANDOMSTRING","LONGANDRANDOMSTRING");
	for(var pair of formData.entries()) {
		console.log(pair[0]+ ', '+ pair[1]);
		if(pair[0] == "filetype" && !pair[1]){
			pair[1] = musicManager.getFiletype(track.src);
			console.log("AHHHHH",pair[1]);
		}
		if(pair[0] == "src" && (pair[1]!=track.src)){
			track.duration = -1;
		}
		track[pair[0]] = pair[1];
	}
	let albumTitle = track.album;
	let album = null;
	if(albumTitle == "new_album"){
		albumTitle = promptValue("Please enter the album title");
		album = new Album(albumTitle,[]);
	}else{
		album = mm.data[mm._albumTitleToAlbum(albumTitle)];
	}
	album = Album.fromJson(JSON.stringify(album));
	track = Track.fromJson(JSON.stringify(track));
	if(track.title == "LONGANDRANDOMSTRING" && track.filetype == "HTML"){
		track.title = promptValue("Please enter the track title");
	}
	if(track.src == "LONGANDRANDOMSTRING"){
		track.src = promptValue("Please enter the src. This really shouldn't happen.");
	}
	switch(track.filetype){
		case "YT":
			getYTTrack(musicManager.getYoutubeId(track.src),album);
			break;
		case "SC":
			getSCPlaylist(track.src,album,true);
			break;
		case "BC":
			getBCTrack(track.src,album);
			break;
		default:
			album.addTrack(track);
			uploadAlbum(album,true);
	}
	console.log(track,album);
	hideMenu();
	
}
function uploadNewAlbum(){
	if(!verifyForm("upload-album-form","All entries must be filled out","filetype")){
		return;
	}
	let form = document.getElementById("upload-album-form");
	let formData = new FormData(form);
	let src = formData.get('src');
	let filetype = formData.get('filetype');
	let album = formData.get('album');
	let albumTitle = null;
	if(!filetype){
		filetype = musicManager.getFiletype(src);
	}
	if(album == "new_album"){
		switch(filetype){
			case "BC":
				album = false;
				break;
			case "YT":
				album = false;
				albumTitle = promptValue("Please enter the album title");
				break;
			case "SC":
				album = new Album(promptValue("Please enter the album title"),[]);
				break;
		}
	}else{
		album = mm.data[mm._albumTitleToAlbum(album)];
		album = Album.fromJson(JSON.stringify(album));
	}
	if(filetype == "YT"){
		src = musicManager.getYoutubePlaylistId(src);
		if(!albumTitle){
			albumTitle = album.title;
		}
	}
	console.log(src,filetype,album,albumTitle);
	switch(filetype){
		case "YT":
			getYTPlaylist(src,albumTitle,album);
			break;
		case "SC":
			getSCPlaylist(src,album);
			break;
		case "BC":
			getBCPlaylist(src,album);
			break;
	}
	hideMenu();
	//console.log(track,album);
	
}
function promptValue(message){
	let value = prompt(message);
	if(!value){return promptValue(message)}
	return value;
}
function hideMenu(){
	let menus = document.getElementsByClassName("menu-bg");
	for(let element of menus){
		element.style.display = "none";
	}
	document.body.style.overflow = "";
}
function resetSettingsMenu(){
	if(confirm("Reset Settings?")){
		setTimeout(loadSettingsMenu, 20);
	}
	//change userprefs here
	hideMenu();
	let tmp = new CustomSettings();
	tmp.setToDefault()
	tmp.applySettings();
	mm.usrPrefs.customSettings = tmp;
	setLocalStorage("customSettings",tmp,true);
}
function resetTrackMenu(){
	if(confirm("Reset Settings?")){
		setTimeout(loadTrackMenu, 20);
	}
	//change userprefs here
}
function menuEvent(event){
	// Close the menu if the user clicks outside of it
	let content = document.getElementsByClassName("menu-content");
	var inside = false;
	for(let element of content){
		if(element.contains(event.target)){
				inside = true;
		}
	}
	if(!inside && !txtBoxHasFocus()){
		hideMenu();
	}
}

function menuValueIncrement(id,step){
	if(step == 0){
		el.parentNode.children[0].innerText = el.value;
		return false;
	}
	let el = document.getElementById(id);
	if(Math.sign(step) == 1){
		el.stepUp(1);
	}else{
		el.stepDown(1);
	}
	el.parentNode.children[0].innerText = el.value;
	return el.value;
}

function verifyForm(id="settings-form",message="All entries must be filled out",...args){
	let form = document.getElementById(id);
	let formData = new FormData(form);
	for(var pair of formData.entries()) {
		//console.log(pair[0]+ ', '+ pair[1]);
		//console.log(settings[pair[0].replace(/-/g, '_').slice(2)]);
		if(args.includes(pair[0])){
			continue;
		}
		if(!pair[1] || !pair[0]){
			alert(message);
			return false;
		}
	}
	return true;
}

function submitSettingsForm(){
	if(!verifyForm()){
		return;
	}
	let form = document.getElementById("settings-form");
	let formData = new FormData(form);
	let settings = new CustomSettings();
	for(var pair of formData.entries()) {
		//console.log(pair[0]+ ', '+ pair[1]);
		//console.log(settings[pair[0].replace(/-/g, '_').slice(2)]);
		settings[pair[0].replace(/-/g, '_').slice(2)] = pair[1];
		if(pair[1].indexOf("#")==-1){
			settings[pair[0].replace(/-/g, '_').slice(2)] = pair[1]+"rem";
		}
	}
	mm.usrPrefs.customSettings = settings;
	setLocalStorage("customSettings",settings,true);
	settings.applySettings();
	hideMenu();
	return settings;
}

function submitTrackForm(deleteTrack = false){
	if(!verifyForm("track-form","Title and Source must be filled out","artist","artwork_url","filetype")){
		return;
	}
	if(deleteTrack){
		deleteTrack = confirm("Delete Track?");
		if(!deleteTrack){
			return;
		}
	}
	let oldTrack = Track.fromJson(document.getElementById("track-form").dataset.track);
	let album = mm._trackToAlbum(oldTrack)[0];
	album = Album.fromJson(JSON.stringify(album));
	
	let form = document.getElementById("track-form");
	let formData = new FormData(form);
	let title = formData.get('title');
	let src = formData.get('src');
	let artist = formData.get('artist');
	let artwork_url = formData.get('artwork_url');
	let filetype = formData.get('filetype');
	let track_num = formData.get('track_num');
	let track = Track.fromJson(JSON.stringify(oldTrack));
	track.title = title;
	track.src = src;
	track.artist = artist;
	track.artwork_url = artwork_url;
	track.filetype = filetype;
	track.track_num = track_num;
	if(src != oldTrack.src){
		track.filetype = musicManager.getFiletype(src);
	}
	
	album.removeTrack(oldTrack);
	if(!deleteTrack){
		album.addTrack(track);
	}else{
		console.log("Removed Track",oldTrack);
	}
	console.log(track,album);
	uploadAlbum(album,true);
	hideMenu();
	return;
}

function updateAlbum(album){
	let div = albumToDivElement(album);
}

function updateTrack(oldTrack,newTrack){
	oldTrack = Track.fromJson(JSON.stringify(oldTrack));
	newTrack = Track.fromJson(JSON.stringify(newTrack));
	let div = albumToDivElement(oldTrack);
	for(item in oldTrack){
		//console.log(oldTrack[item],newTrack[item]);
		if(oldTrack[item] != newTrack[item]){
			console.log(oldTrack[item],newTrack[item]);
			switch(item){
				case "title":
					//TODO
					div.dataList.title = newTrack.title;
					div.children[1].children[0].innerText = newTrack.title;
					break;
				case "src":
					break;
				case "artist":
					break;
			}
		}
	}
	
	/*toHTML(album_title,album_artwork="images/default.png"){
		let track = document.createElement("div");
		let att = document.createAttribute("class");
		att.value = "track";
		track.setAttributeNode(att);
		att = document.createAttribute("data-title");
		att.value = this.title;
		track.setAttributeNode(att);
			//sq
			let sq = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "sq";
			sq.setAttributeNode(att);
				//img
				let img = document.createElement("img");
				att = document.createAttribute("class");
				att.value = "sq-img";
				img.setAttributeNode(att);
				att = document.createAttribute("data-lazysrc");
				//TODO find parent album
				att.value = album_artwork;
				if(!album_artwork){
					att.value = "images/default-white.png";
				}
				if(this.artwork_url){
					att.value = this.artwork_url;
				}
				img.setAttributeNode(att);
				att = document.createAttribute("onerror");
				att.value = "this.onerror=null;this.src='images/error.png';";
				img.setAttributeNode(att);
				sq.appendChild(img);
			track.appendChild(sq);
			//txt-box
			let txt_box = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "txt-box";
			txt_box.setAttributeNode(att);
				//title
				let txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line title";
				txt_line.setAttributeNode(att);
				txt_line.innerText = this.title;
					//extra data
					att = document.createAttribute("data-album");
					att.value = album_title;
					txt_line.setAttributeNode(att);
				txt_box.appendChild(txt_line);
				//album or artist
				txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line subtitle";
				txt_line.setAttributeNode(att);
				txt_line.innerText = album_title;
				if(this.artist){
					txt_line.innerText = this.artist;
				}
				txt_box.appendChild(txt_line);
			track.appendChild(txt_box);
			//sq
			sq = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "sq";
			sq.setAttributeNode(att);
				//img
				img = document.createElement("img");
				att = document.createAttribute("class");
				att.value = "sq-img";
				img.setAttributeNode(att);
				att = document.createAttribute("data-lazysrc");
				att.value = "heart-white.png";
				img.setAttributeNode(att);
				sq.appendChild(img);
			track.appendChild(sq);
		return track;*/
}

class CustomSettings{
	constructor(
		bg_color_main = getRootVariable("--bg-color-main"),
		bg_color_header = getRootVariable("--bg-color-header"),
		bg_color_controls = getRootVariable("--bg-color-controls"),
		highlight_color = getRootVariable("--highlight-color"),
		txt_color_main = getRootVariable("--txt-color-main"),
		txt_color_alt = getRootVariable("--txt-color-alt"),
		progress_color_main = getRootVariable("--progress-color-main"),
		progress_color_alt = getRootVariable("--progress-color-alt"),
		sq_img_mobile = getRootVariable("--sq-img-mobile"),
		sq_album_mobile = getRootVariable("--sq-album-mobile"),
		sq_header_mobile = getRootVariable("--sq-header-mobile"),
		sq_controls_mobile = getRootVariable("--sq-controls-mobile"),
		progress_bar_size = getRootVariable("--progress-bar-size")){
		this.bg_color_main = bg_color_main;
		this.bg_color_header = bg_color_header;
		this.bg_color_controls = bg_color_controls;
		this.highlight_color = highlight_color;
		this.txt_color_main = txt_color_main;
		this.txt_color_alt = txt_color_alt;
		this.progress_color_main = progress_color_main;
		this.progress_color_alt = progress_color_alt;
		this.sq_img_mobile = sq_img_mobile;
		this.sq_album_mobile = sq_album_mobile;
		this.sq_header_mobile = sq_header_mobile;
		this.sq_controls_mobile = sq_controls_mobile;
		this.progress_bar_size = progress_bar_size;
		/*if(isDesktop){
			this.sq_img_mobile = "6rem";
			this.sq_album_mobile = "23rem";
			this.sq_header_mobile = "6rem";
			this.sq_controls_mobile = "5rem";
		}*/
	}
	static fromJson(json){
		var obj = JSON.parse(json);
		return new CustomSettings(...obj);
	}
	toJSON(){
		return [this.bg_color_main,
		this.bg_color_header,
		this.bg_color_controls,
		this.highlight_color,
		this.txt_color_main,
		this.txt_color_alt,
		this.progress_color_main,
		this.progress_color_alt,
		this.sq_img_mobile,
		this.sq_album_mobile,
		this.sq_header_mobile,
		this.sq_controls_mobile,
		this.progress_bar_size];
	}
	applySettings(){
		setRootVariable("--bg-color-main", this.bg_color_main);
		setRootVariable("--bg-color-header", this.bg_color_header);
		setRootVariable("--bg-color-controls", this.bg_color_controls);
		setRootVariable("--highlight-color", this.highlight_color);
		setRootVariable("--txt-color-main", this.txt_color_main);
		setRootVariable("--txt-color-alt", this.txt_color_alt);
		setRootVariable("--progress-color-main", this.progress_color_main);
		setRootVariable("--progress-color-alt", this.progress_color_alt);
		setRootVariable("--sq-img-mobile", this.sq_img_mobile);
		setRootVariable("--sq-album-mobile", this.sq_album_mobile);
		setRootVariable("--sq-header-mobile", this.sq_header_mobile);
		setRootVariable("--sq-controls-mobile", this.sq_controls_mobile);
		setRootVariable("--progress-bar-size", this.progress_bar_size);
	}
	setToDefault(){
		this.bg_color_main = "#121212";
		this.bg_color_header = "#121212";
		this.bg_color_controls = "#4a4a4a";
		this.highlight_color = "#4a4a4a";
		this.txt_color_main = "#ffffff";
		this.txt_color_alt = "#d1d1d1";
		this.progress_color_main = "#03cffc";
		this.progress_color_alt = "#8a8a8a";
		this.sq_img_mobile = "10rem";
		this.sq_album_mobile = "42rem";
		this.sq_header_mobile = "10rem";
		this.sq_controls_mobile = "10rem";
		this.progress_bar_size = "23rem";
		if(window.innerWidth > window.innerHeight){
			this.sq_img_mobile = "6rem";
			this.sq_album_mobile = "23rem";
			this.sq_header_mobile = "6rem";
			this.sq_controls_mobile = "5rem";
			this.progress_bar_size = "10rem"
		}
	}
	
}
