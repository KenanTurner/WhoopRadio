<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="jquery-3.5.1.min.js"></script>
		<script type="text/javascript" src="cookies.js"></script>
		<script type="text/javascript" src="framework.js"></script>
		<script type="text/javascript" src="display.js"></script>
		<script type="text/javascript" src="forms.js"></script>
		<script type="text/javascript" src="fancy_player/music-manager.js"></script>
		<script type="text/javascript" src="upload.js"></script>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		<div class="menu-bg" id="settings-menu">
			<div class="menu-content">
				<form onreset="resetSettingsMenu();return true;" id="settings-form">
					<!--
					--bg-color-main: #121212;
					--bg-color-header: #121212;
					--bg-color-controls: #4a4a4a;
					--highlight-color: #4a4a4a;
					--txt-color-main: #ffffff;
					--txt-color-alt: #d1d1d1;
					--progress-color-main: #03cffc;
					--progress-color-alt: #8a8a8a;
					--sq-img-mobile: 10rem;
					--sq-album-mobile: 42rem;
					--sq-header-mobile: 10rem;
					--sq-controls-mobile: 10rem;
					--track-cols: 1;
					-->
					<div class="heading">
						Color Scheme:
					</div>
					<div class="subheading">Background Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--bg-color-main" name="--bg-color-main" value="#121212" required>
					</div>
					<div class="subheading">Header Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--bg-color-header" name="--bg-color-header" value="#121212" required>
					</div>
					<div class="subheading">Controls Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--bg-color-controls" name="--bg-color-controls" value="#4a4a4a" required>
					</div>
					<div class="subheading">Highlight Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--highlight-color" name="--highlight-color" value="#4a4a4a" required>
					</div>
					<div class="subheading">Text Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--txt-color-main" name="--txt-color-main" value="#ffffff" required>
					</div>
					<div class="subheading">Text Color Alt:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--txt-color-alt" name="--txt-color-alt" value="#d1d1d1" required>
					</div>
					<div class="subheading">Progress Color:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--progress-color-main" name="--progress-color-main" value="#03cffc" required>
					</div>
					<div class="subheading">Progress Color Alt:</div>
					<div class="color-picker-wrapper">
						<input type="color" id="--progress-color-alt" name="--progress-color-alt" value="#8a8a8a" required>
					</div>
					<div class="heading">
						Sizing:
					</div>
					<div class="subheading">Track Size:</div>
					<div class="number-wrapper">
						<input type="number" id="--sq-img-mobile" name="--sq-img-mobile" value="10" min="3" max="32" required>
						<button onclick="menuValueIncrement('--sq-img-mobile',1);return false;">+</button>
						<button onclick="menuValueIncrement('--sq-img-mobile',-1);return false;">-</button>
					</div>
					<div class="subheading">Album Size:</div>
					<div class="number-wrapper">
						<input type="number" id="--sq-album-mobile" name="--sq-album-mobile" value="42" min="12" max="64" required>
						<button onclick="menuValueIncrement('--sq-album-mobile',1);return false;">+</button>
						<button onclick="menuValueIncrement('--sq-album-mobile',-1);return false;">-</button>
					</div>
					<div class="subheading">Header Size:</div>
					<div class="number-wrapper">
						<input type="number" id="--sq-header-mobile" name="--sq-header-mobile" value="10" min="3" max="32" required>
						<button onclick="menuValueIncrement('--sq-header-mobile',1);return false;">+</button>
						<button onclick="menuValueIncrement('--sq-header-mobile',-1);return false;">-</button>
					</div>
					<div class="subheading">Progress Bar Size:</div>
					<div class="number-wrapper">
						<input type="number" id="--progress-bar-size" name="--progress-bar-size" value="23" min="6" max="64" required>
						<button onclick="menuValueIncrement('--progress-bar-size',1);return false;">+</button>
						<button onclick="menuValueIncrement('--progress-bar-size',-1);return false;">-</button>
					</div>
					<div class="subheading">Controls Size:</div>
					<div class="number-wrapper">
						<input type="number" id="--sq-controls-mobile" name="--sq-controls-mobile" value="10" min="3" max="32" required>
						<button onclick="menuValueIncrement('--sq-controls-mobile',1);return false;">+</button>
						<button onclick="menuValueIncrement('--sq-controls-mobile',-1);return false;">-</button>
					</div>
				  <input type="reset">
				  <button onclick="submitSettingsForm()" class="fakesubmit" value="Submit" type="button">Submit</button>
				</form>
			</div>
		</div>
		<div class="menu-bg" id="upload-menu">
			<div class="menu-content">
				<form>
					<button class="heading" onclick="hideMenu();showMenu('upload-track-menu');" type="button">Upload Track</button>
					<button class="heading" onclick="hideMenu();showMenu('upload-album-menu');" type="button">Upload Album</button>
				</form>
			</div>
		</div>
		<div class="menu-bg" id="help-menu">
			<div class="menu-content">
				<div class="help">
					<?php include 'help.html';?>
					<?php include 'version.html';?>
				</div>
			</div>
		</div>
		<div class="menu-bg" id="upload-track-menu">
			<div class="menu-content">
				<form id="upload-track-form">
					<div class="menu-heading">
						Upload Track
					</div>
					<div class="heading">
						Source:
					</div>
					<input type="text" id="upload-track-src" name="src" required>
					<div class="heading">
						Filetype:
					</div>
					<select id="upload-track-filetype" name="filetype">
						<option value="">Default</option>
						<option value="BC">Bandcamp</option>
						<option value="SC">Soundcloud</option>
						<option value="YT">Youtube</option>
						<option value="HTML">mp3,mp4,wav,ogg,flac</option>
					</select>
					<div class="heading">
						Album:
					</div>
					<select id="upload-track-album" name="album">
						<option value="new_album">New Album</option>
					</select>
					<button onclick="uploadNewTrack()" class="fakesubmit" value="Submit" type="button">Submit</button>
				</form>
			</div>
		</div>
		<div class="menu-bg" id="upload-album-menu">
			<div class="menu-content">
				<form id="upload-album-form">
					<div class="menu-heading">
						Upload Album
					</div>
					<div class="heading">
						Source:
					</div>
					<input type="text" id="album-src" name="src" required>
					<div class="heading">
						Filetype:
					</div>
					<select id="upload-album-filetype" name="filetype">
						<option value="">Default</option>
						<option value="BC">Bandcamp</option>
						<option value="SC">Soundcloud</option>
						<option value="YT">Youtube</option>
					</select>
					<div class="heading">
						Album:
					</div>
					<select id="upload-album-album" name="album">
						<option value="new_album">New Album</option>
					</select>
					<button onclick="uploadNewAlbum()" class="fakesubmit" value="Submit" type="button">Submit</button>
				</form>
			</div>
		</div>
		<div class="menu-bg" id="album-menu">
			<div class="menu-content">
				<form onreset="resetAlbumMenu();return true;" id="album-form">
					<div class="heading">
						Title:
					</div>
					<input type="text" id="album-title" name="title" required>
					<div class="heading">
						Artists:
					</div>
					<input type="text" id="album-artists" name="artists">
					<div class="heading">
						Artwork URL:
					</div>
					<input type="text" id="album-artwork-url" name="artwork_url">
					<div class="heading">
						Genre:
					</div>
					<input type="text" id="album-genre" name="genre">
					<button onclick="submitAlbumForm(true)" class="fakedelete" value="Submit" type="button">Delete Album</button>
					<input type="reset">
					<button onclick="submitAlbumForm()" class="fakesubmit" value="Submit" type="button">Submit</button>
				</form>
			</div>
		</div>
		<div class="menu-bg" id="track-menu">
			<div class="menu-content">
				<form onreset="resetTrackMenu();return true;" id="track-form">
					<div class="heading">
						Title:
					</div>
					<input type="text" id="track-title" name="title" required>
					<div class="heading">
						Source:
					</div>
					<input type="text" id="track-src" name="src" required>
					<div class="heading">
						Artist:
					</div>
					<input type="text" id="track-artist" name="artist">
					<div class="heading">
						Artwork URL:
					</div>
					<input type="text" id="track-artwork-url" name="artwork_url">
					<div class="heading">
						Filetype:
					</div>
					<select id="track-filetype" name="filetype">
						<option value="">Default</option>
						<option value="BC">Bandcamp</option>
						<option value="SC">Soundcloud</option>
						<option value="YT">Youtube</option>
						<option value="HTML">mp3,mp4,wav,ogg,flac</option>
					</select>
					<div class="heading" style="grid-column: span 1; display: none;">
						Track Number:
					</div>
					<div class="number-wrapper" style="display: none;">
						<input type="number" id="track-track-num" name="track_num" value="0" min="0" max="199" required>
						<button onclick="menuValueIncrement('track-track-num',1);return false;">+</button>
						<button onclick="menuValueIncrement('track-track-num',-1);return false;">-</button>
					</div>
					<button onclick="submitTrackForm(true)" class="fakedelete" value="Submit" type="button">Delete Track</button>
					<input type="reset">
					<button onclick="submitTrackForm()" class="fakesubmit" value="Submit" type="button">Submit</button>
				</form>
			</div>
		</div>
		<div class="album-header sticky" id="album-header">
			<div class="sq">
				<img class="sq-img" src="images/settings-white.png" onclick="setTimeout(showMenu, 10);" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			<div class="sq">
				<img class="sq-img" id="volumeBtn" src="images/speaker-white.png" onerror="this.onerror=null;this.src='images/error.png';" onclick="if(mm.currentVol>0){mm.changeVolume(0,true);}else{mm.changeVolume(1,true);}">
			</div>
			<div class="sq">
				<img class="sq-img" onclick="setTimeout(function(){showMenu('upload-menu')}, 10);" src="images/create-white.png" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			<div class="sq">
				<img class="sq-img" onclick="setTimeout(function(){showMenu('help-menu')}, 10);" src="images/help-white.png" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			<div class="sq">
				<img class="sq-img" src="images/sort-white.png" onclick="toggleDropDown('album-sort')" onerror="this.onerror=null;this.src='images/error.png';">
				<div id="album-sort" class="dropdown-content" data-index="0">
					<button onclick="sortAlbums('title',0);">Title</button>
					<button onclick="sortAlbums('artist',1);">Artist</button>
					<button onclick="sortAlbums('genre',2);">Genre</button>
					<button onclick="sortAlbums('duration',3,true);">Duration</button>
					<button onclick="sortAlbums('_upload_date',4,true);">Date</button>
					<!--<button onclick="sortAlbums('description',3);">Description</button>-->
				</div>
			</div>
		</div>
		<div class="track-header sticky" id="track-header">
			<div class="sq">
				<img class="sq-img" src="images/back-white-drop.png" onclick="hideTracks()" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			
			<div class="txt-box">
				<div class="txt-line title" data-album="ABZU">To Know, Water</div>
				<div class="txt-line subtitle">Artist Goes Here</div>
				
			</div>
			<div class="sq">
				<img class="sq-img" src="images/sort-white-drop.png" onclick="toggleDropDown('track-sort')" onerror="this.onerror=null;this.src='images/error.png';">
				<div id="track-sort" class="dropdown-content" data-index="0">
					<button onclick="sortTracks('track_num',0);">Track #</button>
					<button onclick="sortTracks('title',1);">Title</button>
					<button onclick="sortTracks('artist',2);">Artist</button>
					<button onclick="sortTracks('duration',3,true);">Duration</button>
					<button onclick="sortTracks('_upload_date',4,true);">Date</button>
				</div>
			</div>
			<div class="bg-image-container">
				<div class="bg-image" id="bg-image"></div>
			</div>
			
		</div>
		<div class="album-container" id="content">

		</div>
		
		<footer id="footer">
			<div class="progress-container" id="progress-container">
				<div class="progress-bar" id="progress-bar"></div>
				<div class="current-progress" id="current-progress">
					Loading...
				</div>
				
				<div class="remaining-progress" id="remaining-progress">
					Loading...
				</div>
			</div>
			<div id="currently-playing">
				<div class="track">
					<div class="sq">
						<img class="sq-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" onerror="this.onerror=null;this.src='images/error.png';">
						<div class="blur-img"></div>
					</div>
					<div class="txt-box">
						<div class="txt-line title">
							Loading...
						</div>
						<div class="txt-line subtitle">
							Loading...
						</div>
					</div>
					<div class="sq">
						<img class="sq-img" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=" onerror="this.onerror=null;this.src='images/error.png';">
					</div>
				</div>
			</div>
			<div class="controls" id="controls">
				<div class="sq" onclick="mm.toggleLoop();">
					<img src="images/loop-white.png" id="loopBtn" class="sq-img" >
				</div>
				<div class="sq" onclick="mm.findNextTrack(-1);">
					<img src="images/previous-white.png" class="sq-img" >
				</div>
				<div class="sq" onclick="mm.togglePlay();">
					<img src="images/play-white.png" id="playPauseBtn" class="sq-img">
				</div>
				<div class="sq" onclick="mm.findNextTrack(1);">
					<img src="images/next-white.png" class="sq-img" >
				</div>
				<div class="sq" onclick="mm.toggleShuffle();">
					<img src="images/shuffle-white.png" id="shuffleBtn" class="sq-img" >
				</div>
			</div>
		</footer>
		<div style="display: none;"> <!-- to unhide, change display to block -->
			<audio id="html-player" src="" preload="none" controls="true" preload="metadata"></audio> <!--html audio-->
			<div id="yt-player"></div> <!--Youtube embed-->
			<iframe id="sc-player" width="100%" height="144" scrolling="no" frameborder="no" allow="autoplay"
			  src="https://w.soundcloud.com/player/?url=;"> <!--Soundcloud embed-->
			</iframe>
			<script>
				//load cookies here
				var customSettings = getLocalStorage("customSettings");
				if(!customSettings){
					customSettings = new CustomSettings();
					setLocalStorage("customSettings",customSettings,true);
				}else{
					customSettings = CustomSettings.fromJson(customSettings);
				}
				customSettings.applySettings();
				var tmpUsrPref = new UserPreferences([],[],CustomSettings.fromJson(JSON.stringify(customSettings)));
				var data = <?php include "getData.php";?>;
				
				//Liked album
				var liked_album = getLocalStorage("liked_album");
				if(liked_album != ""){
					liked_album = Album.fromJson(liked_album);
				}else{
					liked_album = new Album("Liked Tracks",[],"is_liked_album","Favorites","images/heart-white.png");
					uploadAlbum(liked_album);
					console.log("creating new liked_album");
				}
				liked_album.description = "is_liked_album";
				
				convertToFramework(data);
				//remove phantom liked album
				data = data.filter(function(album){
					if(album.description == "is_liked_album"){
						return false;
					}
					return true;
				});
				data.push(liked_album);
				window.mm = new musicManager(data,tmpUsrPref,'html-player','sc-player','yt-player','fancy_player/SoundcloudApi.js','fancy_player/YoutubeApi.js');
				mm._sortAlbums();
				document.getElementsByClassName("album-container")[0].innerHTML = "";
				var fragment = new DocumentFragment();
				mm.data.forEach(function(album){
					fragment.appendChild(album.toHTML());
				});
				
				document.getElementsByClassName("album-container")[0].appendChild(fragment);
				loadEventListeners();
				mm.subscribe(mm._setTrack,updateCurrentlyPlaying);
				mm.subscribe(mm._updateTime,updateTrackTime);
				mm.subscribe(mm._setDuration,updateTrackDuration);
				mm.subscribe(mm.togglePlay,playPauseEvent);
				mm.subscribe(mm.play,playPauseEvent);
				mm.subscribe(mm.pause,playPauseEvent);
				mm.subscribe(mm.toggleLoop,loopEvent);
				mm.subscribe(mm.toggleShuffle,shuffleEvent);
				mm.subscribe(mm.changeVolume,volumeEvent);
				mm.subscribe(mm._setTrack,updateTitle);
				mm.subscribe(mm.togglePlay,updateTitle);
				
				if ('mediaSession' in navigator) {
					console.log("Using mediaSession");
					try{
						mm.subscribe(mm._setTrack,updateMetadata);
					}catch(e){
						console.log("mediaSession metadata is unsupported");
					}
					try{
						mm.subscribe(mm._updateTime,updatePositionState);
						mm.subscribe(mm._setDuration,updatePositionState);
					}catch(e){
						console.log("mediaSession positionState is unsupported");
					}
					try{
						mm.subscribe(mm.play,function(isPlaying){
							if(isPlaying){
								navigator.mediaSession.playbackState = "playing";
							}else{
								navigator.mediaSession.playbackState = "paused";
							}
						});
						mm.subscribe(mm.pause,function(isPlaying){
							if(isPlaying){
								navigator.mediaSession.playbackState = "playing";
							}else{
								navigator.mediaSession.playbackState = "paused";
							}
						});
					}catch(e){
						console.log("mediaSession playbackState is unsupported");
					}
					
					try{
						navigator.mediaSession.setActionHandler('play', function(){
							mm.play();
						});
						navigator.mediaSession.setActionHandler('pause', function(){
							mm.pause();
						});
					}catch(e){
						console.log("mediaSession play/pause is unsupported");
					}
					try{
						navigator.mediaSession.setActionHandler('seekbackward', function(){mm.fastForward(-10)});
						navigator.mediaSession.setActionHandler('seekforward', function(){mm.fastForward(10)});
						navigator.mediaSession.setActionHandler('previoustrack', function(){mm.findNextTrack(-1)});
						navigator.mediaSession.setActionHandler('nexttrack', function(){mm.findNextTrack(1)});
						navigator.mediaSession.setActionHandler('seekto', function(event) {
							console.log('> User clicked "Seek To" icon.');
							mm.fastForward(event.seekTime-mm.currentTime);
						});
					}catch(e){
						console.log("mediaSession extras is unsupported");
					}
				}else{
					console.log("mediaSession is unsupported");
				}
				
				//keyboard controls
				document.addEventListener('keyup', keyUp, false);
				document.addEventListener('keydown', keyDown, false); //media controls
				document.addEventListener("keydown", function(e) {
					if(txtBoxHasFocus()){
						return true;
					}
					// space and arrow keys
					if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
						e.preventDefault();
					}
				}, false);
				
				//Title
				var documentTitle = document.title;
				
				//mobile check
				/*if(musicManager.mobileAndTabletCheck()){
					if (firstVisit == ""){
						console.log("First Visit");
						setCookie("firstVisit", false, 365);
						console.log("Mobile user");
						alert('You are using the mobile version of this site. For full functionality, switch to the desktop version');
					}
				}*/
				
				//Version Check
				var current_version = getCookie("current_version");
				if(current_version == ""){ //First Visit or updating systems
					current_version = document.getElementById("version_log").lastElementChild.innerText;
					setCookie("current_version",current_version,365);
					if(getCookie("firstVisit") != ""){
						alert("Update Completed:\n"+current_version);
					}else{
						console.log("First Visit");
						if(musicManager.mobileAndTabletCheck()){
							console.log("Mobile user");
							alert('You are using the mobile version of this site. For full functionality, switch to the desktop version');
						}
					}					
				}else if(current_version != document.getElementById("version_log").lastElementChild.innerText){
					current_version = document.getElementById("version_log").lastElementChild.innerText;
					alert("Update Completed:\n"+current_version);
					setCookie("current_version",current_version,365);
				}
				
				//Remove depreciated cookies
				deleteCookie("useMediaSession");
				deleteCookie("firstVisit");
				
			</script>
			<div id="tmp-yt"></div> <!--Youtube embed-->
			<script>
				// 2. This code loads the IFrame Player API code asynchronously.
				musicManager.loadScript("fancy_player/YoutubeApi.js", function() {
					console.log("Soutube Api has been loaded");
					createUploadYT();
				});
			</script>
			<iframe id="tmp-sc" width="100%" height="144" scrolling="no" frameborder="no" allow="autoplay"
			  src="https://w.soundcloud.com/player/?url=;"> <!--Soundcloud embed-->
			</iframe>
			<script>
				var tmp_sc = null;
				musicManager.loadScript("fancy_player/SoundcloudApi.js", function() {
					console.log("Soundsoup Api has been loaded");
					createUploadSC();
				});
			</script>
		</div>
	</body>
</html>
