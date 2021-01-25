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
	</head>
	<body>
		<div style="padding: 16px">
			<div id="currentTrack">Loading. . .</div>
			<div id="currentFolder">Loading. . .</div>
			<div id="progressText">
				<div id="currentPos">0:00</div>
				<div id="" style="float:left; width: 10%">/</div>
				<div id="currentDur">0:00</div>
			</div>
							
			
			<button onclick="mm.setTrackType('liked')" class="" id="likeTrackBtn">Like Track</button>
			<button onclick="mm.changeVolume(-0.1)">Volume Down</button>
			<button onclick="mm.findNextFolder(-1)">last Folder</button>
			<button onclick="mm.findNextTrack(-1)">|<</button>
			<button onclick="mm.fastForward(-10)"><<</button>
			<button onclick="mm.togglePlay()" id="playBtn">Play</button>
			<button onclick="mm.fastForward(10)">>></button>
			<button onclick="mm.findNextTrack(1)">>|</button>
			<button onclick="mm.findNextFolder(1)">Next Folder</button>
			<button onclick="mm.changeVolume(0.1)">Volume Up</button>
			
			<input id="vol-control" type="range" min="0" max="1" value="1" step="0.1" oninput="mm.changeVolume(parseFloat(this.value),true)" onchange="mm.changeVolume(parseFloat(this.value),true)" style="width: 170px;"></input>
			<br><br>
			<button onclick="mm.setTrackType('skipped',true)" class="" id="skipTrackBtn">Skip Track</button>
			<button onclick="mm.resetTracksByType('skipped')" class="">Reset Skipped Tracks</button>
			<button onclick="mm.resetTracksByType('liked')" class="">Reset Liked Tracks</button>
			<button onclick="mm.toggleLoop()" class="" id="loopBtn">Loop</button>
			<button onclick="mm.toggleShuffleAll()" class="" id="shuffleAllBtn">Shuffle All</button>
			<button onclick="mm.toggleShuffle()" class="" id="shuffleBtn">Shuffle</button>
			<button onclick="mm.toggleLikedTracks()" class="" id="likeBtn">Liked Tracks</button>
			<button onclick="collapseAll()">Collapse All</button>
			<button onclick="expandAll()">Expand All</button>
			<a href="http://crusader.company/dev/getData.php" download>Download?</a>
			<script>
				var data = <?php include "getData.php";?>;
				convertToFramework(data);
			</script>
			
		<div style="display: block;"> <!-- to unhide, change display to block -->
			<audio id="html-player" src="" preload="none" controls="true" preload="metadata"></audio> <!--html audio-->
			<div id="yt-player"></div> <!--Youtube embed-->
			<div id="tmp_player"></div> <!--Youtube embed-->
			<script>
				// 2. This code loads the IFrame Player API code asynchronously.
				musicManager.loadScript("fancy_player/YoutubeApi.js", function() {
					console.log("Soutube Api has been loaded");
				});

				// 3. This function creates an <iframe> (and YouTube player)
				//    after the API code downloads.
				var tmp_player;
				function onYouTubeIframeAPIReady() {
					tmp_player = new YT.Player('tmp_player', {
						height: '144',
						width: '100%',
						videoId: '',
						events: {
							'onStateChange': onPlayerStateChange
						}
					});
				}
				function onPlayerStateChange(event) {
					//console.log("event: ",event);
					if(event.data == 5){
						var data = tmp_player.getPlaylist();
						if(data.length==200){
							console.log("we got a problem");
						}
						console.log(data);
						//upload here prob
					}
				}
				function getYTPlaylist(id){
					tmp_player.cuePlaylist({listType:'playlist',list: id,index:172,startSeconds:0});
				}
			</script>
			<iframe id="sc-player" width="100%" height="144" scrolling="no" frameborder="no" allow="autoplay"
			  src="https://w.soundcloud.com/player/?url=;"> <!--Soundcloud embed-->
			</iframe>
			<script>
				var trackType = getLocalStorage('trackType',true);
				if(trackType==null){
					console.log('initializing');
					trackType = {};
					setLocalStorage('trackType',trackType,true);
				}
				var folderType = getLocalStorage('folderType',true);
				if(folderType==null){
					console.log('initializing');
					folderType = {};
					setLocalStorage('folderType',folderType,true);
				}
				var tmpUsrPref = new UserPreferences([],[]);
				window.mm = new musicManager(data,tmpUsrPref,'html-player','sc-player','yt-player','fancy_player/SoundcloudApi.js','fancy_player/YoutubeApi.js');
			</script>
			<script>
				function getURL(url){
					document.getElementById('frame').src 
					   = 'proxyscript.php?url='+encodeURIComponent(url);
				}
			</script>
			<button onclick="getURL( 'https://www.youtube.com/embed/?enablejsapi=1&origin=https%3A%2F%2Fcrusaderradio.net&widgetid=2')">Google</button>
			<iframe id="frame" src=""></iframe>
		</div>
	</body>
</html>
