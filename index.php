<!DOCTYPE html>
<html>
	<head>
		<script type="text/javascript" src="jquery-3.5.1.min.js"></script>
		<script type="text/javascript" src="cookies.js"></script>
		<script type="text/javascript" src="framework.js"></script>
		<script type="text/javascript" src="display.js"></script>
		<script type="text/javascript" src="fancy_player/music-manager.js"></script>
		<link rel="stylesheet" href="style.css">
	</head>
	<body>	
		<div class="album-header sticky" id="album-header">
			<div class="sq">
				<img class="sq-img" src="images/settings-white.png" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			<div class="sq">
				<img class="sq-img" id="volumeBtn" src="images/speaker-white.png" onerror="this.onerror=null;this.src='images/error.png';" onclick="if(mm.currentVol>0){mm.changeVolume(0,true);}else{mm.changeVolume(1,true);}">
			</div>
			<div class="sq">
				<img class="sq-img" src="images/create-white.png" onerror="this.onerror=null;this.src='images/error.png';">
			</div>
			<div class="sq">
				<img class="sq-img" src="images/help-white.png" onerror="this.onerror=null;this.src='images/error.png';">
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
			<div class="controls">
				<div class="sq">
					<img src="images/loop-white.png" id="loopBtn" class="sq-img" onclick="mm.toggleLoop();">
				</div>
				<div class="sq">
					<img src="images/previous-white.png" class="sq-img" onclick="mm.findNextTrack(-1);">
				</div>
				<div class="sq">
					<img src="images/play-white.png" id="playPauseBtn" class="sq-img" onclick="mm.togglePlay();">
				</div>
				<div class="sq">
					<img src="images/next-white.png" class="sq-img" onclick="mm.findNextTrack(1);">
				</div>
				<div class="sq">
					<img src="images/shuffle-white.png" id="shuffleBtn" class="sq-img" onclick="mm.toggleShuffle();">
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
				var tmpUsrPref = new UserPreferences([],[]);
				var data = <?php include "getData.php";?>;
				var tmpData = JSON.parse(JSON.stringify(data));
				convertToFramework(data);
				window.mm = new musicManager(data,tmpUsrPref,'html-player','sc-player','yt-player','fancy_player/SoundcloudApi.js','fancy_player/YoutubeApi.js');
				document.getElementsByClassName("album-container")[0].innerHTML = "";
				mm.data.forEach(function(album){
					document.getElementsByClassName("album-container")[0].appendChild(album.toHTML());
				});
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
				
				// Sticky header
				// When the user scrolls the page, execute adjustHeader
				//window.onscroll = function() {adjustHeader()};
				//adjustHeader();
				
			</script>
		</div>
	</body>
</html>
