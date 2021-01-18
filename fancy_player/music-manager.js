/**
 * @fileoverview music-manager is a javascript library enabling the user
 *    to control playback of html audio files along with youtube and
 *    soundcloud links.
 */
 
/*** musicManager class */
class musicManager {
	/**
	 * initializes the musicManager object
	 * @constructor
	 * @param {Dict<string:Dict<string:string>>} data Dictionary that contains all folders, tracks and sources.
	 *     ex: {'folder1':{'track1':'src1'}}
	 * @param {Dict<string:string>=} trackType Dictionary that contains the sources and their respective types.
	 *     Allowed types: 'skipped', 'liked'. Ex: {'src1':'liked','src2':'skipped'}
	 * @param {string=} htmlAudioId id of the html audio element
	 * @param {string=} scAudioId id of the soundcloud iframe element
	 * @param {string=} ytAudioId id of the youtube div element
	 * @param {string=} scApiJs location of local soundcloud api file. If not specified, it will be imported.
	 * @param {string=} ytApiJs location of local youtube api file. If not specified, it will be imported.
	 */
	 //TODO update comments
	constructor(data,userPreferences,htmlAudioId="html-player",scAudioId="sc-player",ytAudioId="yt-player",scApiJs="https://w.soundcloud.com/player/api.js",ytApiJs="https://www.youtube.com/iframe_api"){
		//TODO folderType?
		this._myTimer; //controls YT updateTime
		/**
		 * current volume from 0 to 1
		 * @type {number}
		 */
		this.currentVol=1; // 0 to 1
		/**
		 * A dict containing the folder, track, source, and filetype.
		 *     Ex: {'folder':'tmpFolder','track':'track1','src':'music/track1.mp3','filetype':'HTML'}
		 * @type {Dict<string:string>}
		 */
		this.currentlyPlaying = {}; //1d Dict: folder,trackName,src,filetype
		/**
		 * current duration of song. If set to zero, the duration has yet to be set.
		 * @type {number}
		 */
		this.currentDuration = 0; //set by setDuration
		/**
		 * current playback time in seconds
		 * @type {number}
		 */
		this.currentTime = 0; //set by updateTime
		
		/**
		 * Controlled with togglePlay();
		 * @type {boolean}
		 */
		this._isPlaying 	 = false; //currently Playing Songs
		/**
		 * Controlled with toggleShuffle();
		 * @type {boolean}
		 */
		this._isShuffling    = false; //currently Shuffling Songs
		/**
		 * Controlled with toggleLoop();
		 * @type {boolean}
		 */
		this._isLooping      = false; //currently Looping Songs
		/**
		 * Controlled with togglePlayLiked();
		 * @type {boolean}
		 */
		this._isPlayingLiked = false; //currently Playing Liked Songs
		/**
		 * Controlled with toggleShuffleAll();
		 * @type {boolean}
		 */
		this._isShufflingAll = false; //currently Shuffling All Songs
		
		/**
		 * Contains all folders, tracks and sources.
		 *     Ex: {'folder1':{'track1':'src1','track2':'src2'}}
		 * @type {Dict<string:Dict<string:string>>}
		 */
		//deep copy
		//TODO check if data is in correct format
		this.data = convertToFramework(JSON.parse(JSON.stringify(data)));
		/**
		 * Dictionary containing the src and its respective type.
		 *     Allowed types: 'skipped','liked'
		 *     Ex: {'src1':'liked','src2':'skipped'}
		 * @type {Dict<string:string>}
		 */
		//this.trackType = trackType;
		/**
		 * A shuffled version of this.data. Folders are in the same order.
		 *     Ex: {'folder1':{'track2':'src2','track1':'src1'}}
		 * @type {Dict<string:Dict<string:string>>}
		 */
		//this.shuffled = {};
		//TODO
		/*for(var folder in this.data){
			let tmp = {}
			let copy = JSON.parse(JSON.stringify(this.data[folder]));
			let copyKey = Object.keys(copy);
			let copyVal = Object.values(copy);
			copyVal = musicManager.shuffleArray(copyVal);
			for(let i = 0; i < copyKey.length; i++) {
				tmp[musicManager.getKeyByValue(copy,copyVal[i])] = copyVal[i];
			}
			this.shuffled[folder] = tmp;
		}*/
		
		/**
		 * A Dictionary of subscribers
		 * @type {Dict<object:Dict<number:object>>}
		 */
		this.subscribers = {};
		//TODO
		this.usrPrefs = UserPreferences.fromJson(JSON.stringify(userPreferences));
		
		/**
		 * html audio object. https://developer.mozilla.org/en-US/docs/Web/API/HTMLAudioElement
		 * @type {object}
		 */
		this._htmlAudio = document.getElementById(htmlAudioId);
		var self = this;
		this._htmlAudio.addEventListener("ended", function() {
			if(!self._isLooping){
				self.findNextTrack(1);
			}else{
				if(self._isPlaying){
					self.play();
				}else{
					self.findNextTrack(0);
				}
			}
		});
		this._htmlAudio.addEventListener("timeupdate", function() {
			self._updateTime(self._htmlAudio.currentTime);
		});
		
		/**
		 * soundcloud widget object. https://developers.soundcloud.com/docs/api/html5-widget
		 * @type {object}
		 */
		this._SCAudio;
		/**
		 * youtube iframe object. https://developers.google.com/youtube/iframe_api_reference
		 * @type {object}
		 */
		this._YTAudio;
		
		//select the first folder and track
		this.currentlyPlaying['album'] = this.data[0];
		this.currentlyPlaying['track'] = this.data[0].track_list[0];
		
		//load YT and SC javascript files
		var self = this; //loadScript has its own scope
		musicManager.loadScript(ytApiJs, function() {
			console.log("Youtube Api has been loaded");
			self._loadYT(self,ytAudioId); //create the YT obj when script has loaded
		});
		musicManager.loadScript(scApiJs, function() {
			console.log("Soundcloud Api has been loaded");
			self._loadSC(self,scAudioId); //create the SC obj when script has loaded
		});
	}
	
	/**
	 * Enables the user to subscribe to certain events
	 * @param {object} event Which event to subscribe to.
	 * @param {object} callback Function to be called.
	 * @param {object=} rest Arguments to be used with callback function.
	 * @returns {Dict<object:object>}    this.subscribers
	 */
	subscribe(event, callback, ...rest) {
		if (!this.subscribers[event]) {
			this.subscribers[event] = [];
		}
		this.subscribers[event].push([callback,rest]);
		return this.subscribers;
	}
	
	/**
	 * Enables the user to unsubscribe to certain events
	 * @param {object} event Which event to unsubscribe from.
	 * @param {object} callback Function to be removed.
	 * @returns {Dict<object:object>}    this.subscribers
	 */
	unsubscribe(event, callback){
		if(this.subscribers[event]){
			this.subscribers[event].splice(this.subscribers[event].indexOf(callback),1);
		}
		return this.subscribers[event];
	}
	
	/**
	 * Publishes the event to subscribed objects
	 * @param {object} event Event to be published.
	 * @param {object} data Arguments to be passed to subscriber.
	 */
	_publish(event, data) {
		if (!this.subscribers[event]){return;}
		this.subscribers[event].forEach(subscriberCallback => subscriberCallback[0](data,...subscriberCallback[1]));
	}
	
	/**
	 * Creates _SCAudio object
	 * @param {object} obj object for _SCAudio to be added to
	 * @param {string} id id of the soundcloud iframe element
	 */
	_loadSC(obj,id){ //creates _SCAudio
		obj._SCAudio = SC.Widget(id);
			obj._SCAudio.bind(SC.Widget.Events.FINISH, function() {
				if(!obj._isLooping){
					obj.findNextTrack();
				}else{
					if(obj._isPlaying){
						obj.play();
					}else{
						obj.findNextTrack(0);
					}
				}
			});
			obj._SCAudio.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
				obj._updateTime(data['currentPosition']/1000);
			});
		console.log('Soundcloud is ready');
	}
	
	/**
	 * Creates _YTAudio object
	 * @param {object} obj object for _YTAudio to be added to
	 * @param {string} id id of the youtube div element
	 */
	_loadYT(obj,id){ //creates _YTAudio
		window.YT.ready(function() {
			obj._YTAudio = new window.YT.Player(id, {
				height: "144",
				width: "100%",
				playerVars: {'controls': 0,'disablekb':1,'fs':0,'modestbranding':1,'playsinline':1},
				videoId: ""
			});
			obj._YTAudio.addEventListener('onStateChange','_globalYTEvent')
			obj._YTAudio.addEventListener('onReady','_globalYTReady')
		});
		
	}
	
	/**
	 * Handles all youtube events
	 * @param {object} event
	 */
	_YTEvent(event) {
		if (event.data == 0) { //ENDED
			if(!this._isLooping){
				this.findNextTrack();
			}else{
				if(this.isPlaying){
					this.play();
				}else{
					this.findNextTrack(0);
				}
			}
		}
		if (event.data == 1){ //PLAYING
			this._setDuration(Math.ceil(this._YTAudio.getDuration()));
			var self = this; //keep a copy to use later
			this._myTimer = setInterval(function(){
				self._updateTime(self._YTAudio.getCurrentTime()); //manually call updateTime
			}, 100); // 100 ms
		}
		if (event.data != 1){
			clearInterval(this._myTimer); //stop calling updateTime
		}
	}
	
	/**
	 * Plays the currently selected track
	 * @returns {boolean}    this._isPlaying
	 */
	play(){
		let self = this;
		switch(this.currentlyPlaying['track']['filetype']){
			case "SC":
				this._SCAudio.bind(SC.Widget.Events.READY, function() {
					self._SCAudio.getDuration(function(duration){
						self._setDuration(duration/1000);
					});
					if(self.currentlyPlaying['track']['filetype']=='SC'){
						self._SCAudio.play();
					}
					self._SCAudio.setVolume(self.currentVol*100);
				});
				break;
			case "YT":
				this._YTAudio.playVideo();
				break;
			case "BC":
				//set track handles dynamically loading the url
				if(!this.currentlyPlaying['track']['oldsrc']){ //needs new src
					console.log("Needs new src. This really shouldn't happen");
					this._setTrack();
					break;
				}
			case "HTML":
			default:
				this._htmlAudio.play();
				this._getHTMLAudioDuration(this.currentlyPlaying['track']['src'], function (duration) {
					self._setDuration(duration);
				});
				break;
				
		}
		this._isPlaying=true;
		this._publish(this.play,this._isPlaying);
		return this._isPlaying;
	}
	
	/**
	 * Pauses the currently selected track
	 * @returns {boolean}    this._isPlaying
	 */
	pause(){
		this._htmlAudio.pause();
		this._YTAudio.pauseVideo();
		this._SCAudio.pause();
		this._isPlaying=false;
		this._publish(this.pause,this._isPlaying);
		return this._isPlaying;
	}
	
	/**
	 * toggles the playing of tracks
	 * @returns {boolean}    this._isPlaying
	 */
	togglePlay(){
		if(this._isPlaying){
			this.pause();
		}else{
			this.play();
		}
		this._publish(this.togglePlay,this._isPlaying);
		return this._isPlaying;
	}
	
	/**
	 * Sets the folder, track, src, and filetype of this.currentlyPlaying.
	 *     Continues playing if not paused.
	 * @param {string=} folder Folder to be played
	 * @param {string=} trackName Track to be played
	 * @returns {Dict}    this.currentlyPlaying
	 */
	_setTrack(album=this.currentlyPlaying['album'],track=this.currentlyPlaying['track']){
		this.currentlyPlaying['album'] = album;
		this.currentlyPlaying['track'] = track;
		let src = track["src"];
		let filetype = track["filetype"];
		
		this._stopPlaying(); //stop currently playing track
		switch(this.currentlyPlaying['track']['filetype']){
			case "SC": //the long string appended makes soundcloud load the absolute minimum
				this._SCAudio.load(src+"&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=false&visual=false&start_track=0&callback=true");
				break;
			case "YT":
				this._YTAudio.cueVideoById(musicManager.getYoutubeId(src), 0);
				break;
			case "BC":
				//we need to load the url dynamically
				if(!this.currentlyPlaying['track']['oldsrc']){
					this.currentlyPlaying['track']['oldsrc'] = this.currentlyPlaying['track']['src'];
					var tmp = this.currentlyPlaying['track'];
					var self = this;
					$.ajax({
						url: 'loadBC.php',
						type: 'POST',
						data: {href:src},
						success: function(data) {
							var tracks = JSON.parse(data);
							tmp['src'] = Object.values(tracks)[0];
							if(JSON.stringify(self.currentlyPlaying['track']) == JSON.stringify(tmp)){
								self._setTrack();
							}else{
								console.log("Moving too fast");
							}
						}
					});
					this._publish(this._setTrack,this.currentlyPlaying);
					return this.currentlyPlaying;
					break;
				}
			case "HTML":
			default:
				this._htmlAudio.src = src;
				break;
		}
		if(this._isPlaying){
			this.play();
		}
		this._publish(this._setTrack,this.currentlyPlaying);
		return this.currentlyPlaying;
	}
	
	/**
	 * Recursively finds the next track to play. If entire folder is skipped, move onto the next folder.
	 * @param {number=} step Direction for search for next track.
	 * @param {boolean=} hasCheckedFolder Whether the folder is completely skipped or not.
	 * @returns {Dict}    this.currentlyPlaying
	 */
	 //TODO i'm not dealing with blocking folders
	findNextTrack(step=1,hasCheckedFolder=false){
		if(this._isShufflingAll){ //shuffling all songs
			var tmp = this._getRandomTrack();
			this.currentlyPlaying['album'] = tmp['album'];
			this.currentlyPlaying['track'] = tmp['track'];
			//check if track is good
			if(!this.usrPrefs.hasBlockedTrack(this.currentlyPlaying['track'])){
				return this._setTrack();
			}
		}
		if(!hasCheckedFolder){
			if(!this._isValidFolder(this.currentlyPlaying['album'])){
				//skip to next folder
				return this.findNextFolder(1);
			}
			hasCheckedFolder = true;
		}
		//Normal
		let album = this.currentlyPlaying['album'];
		if(album.sort_by != "track_num" && this._isShuffling){
			let shuffled = album.shuffled;
			album = Album.fromJson(JSON.stringify(album));
			album.sort();
			album.shuffled = shuffled;
		}
		let trackIndex = containsObject(this.currentlyPlaying['track'],album.track_list);
		if(this._isShuffling){
			trackIndex = album.shuffled.indexOf(trackIndex);
		}
		if(trackIndex + step >= album.track_list.length){this.pause()}
		let mod = function mod(n, m) {return ((n % m) + m) % m;}
		trackIndex = mod(trackIndex + step,album.track_list.length);
		let track = album.track_list[trackIndex];
		if(this._isShuffling){
			track = album.track_list[album.shuffled[trackIndex]];
		}
		this.currentlyPlaying['track'] = track;	
		if(this.usrPrefs.hasBlockedTrack(track)){
			//track has been skipped
			step = Math.sign(step);
			return this.findNextTrack(step,true);
		}
		//found a non-skipped song
		return this._setTrack();
	}
	
	/**
	 * Recursively finds the folder to play. If entire folder is skipped, move onto the next folder.
	 * @param {number=} step Direction for search for next folder.
	 * @param {boolean=} hasCheckedAllFolders Whether all folder are skipped or not.
	 * @returns {Dict}    this.currentlyPlaying
	 */
	findNextFolder(step=1,hasCheckedAllFolders=false){
		let folderIndex = containsObject(this.currentlyPlaying['album'],this.data);
		if(this._isPlayingLiked){
			return "Playing Liked Album";
		}
		let mod = function mod(n, m) {return ((n % m) + m) % m;}
		folderIndex = mod(folderIndex + step,this.data.length);
		this.currentlyPlaying['album'] = this.data[folderIndex];
		if(!this._isValidFolder(this.data[folderIndex])){
			//console.log("Entire Folder Is Skipped");
			if(!hasCheckedAllFolders){
				if(!this._hasValidFolders()){
					//Every folder is skipped
					this.currentlyPlaying['album'] = this.data[0];
					this.currentlyPlaying['track'] = this.data[0].track_list[0];
					alert("Every track is blocked");
					return;
				}
			}
			return this.findNextFolder(step,true);
		}
		this.currentlyPlaying['track'] = this.data[folderIndex].track_list[0];
		if(this._isShuffling){
			this.currentlyPlaying['track'] = this.currentlyPlaying['album'].track_list[this.currentlyPlaying['album'].shuffled[0]];
		}
		return this.findNextTrack(0,true);
	}
	
	/**
	 * Attempts to play the specified track. Disables all shuffling.
	 * @param {string} folder
	 * @param {string} track
	 * @returns {Dict}    this.currentlyPlaying
	 */
	findTrack(album,track){
		if(this._isShuffling){
			this.toggleShuffle();
		}
		if(this._isShufflingAll){
			this.toggleShuffleAll();
		}
		if(this._isPlayingLiked){
			this.toggleLikedTracks();
		}
		this.currentlyPlaying['album'] = album;
		this.currentlyPlaying['track'] = track;
		return this.findNextTrack(0);
	}
	
	/**
	 * Controls skipping forwards and backwards
	 * @param {number} timeStep The amount in seconds to skip forwards or backwards.
	 * @returns {number}    this.currentTime
	 */
	fastForward(timeStep){
		let self = this;
		switch(this.currentlyPlaying['track']['filetype']){
			case "SC":
				this._SCAudio.getPosition(function(currentTimeSC){
					currentTimeSC += (timeStep*1000);
					self._SCAudio.seekTo(currentTimeSC);
					return self._updateTime(currentTimeSC/1000);
				});
				break;
			case "YT":
				if(this.currentDuration!=0){ //Wait till video is loaded
					let currentPos = this._YTAudio.getCurrentTime();
					currentPos+=timeStep;
					this._YTAudio.seekTo(currentPos,true);
					return this._updateTime(currentPos);
				}
				break;
			case "HTML":
			case "BC":
			default:
				this._htmlAudio.currentTime+=timeStep;
				return this._updateTime(this._htmlAudio.currentTime);
				break;
		}
	}
	
	/**
	 * Controls the volume. Values range from 0 to 1.
	 * @param {number} step The amount to change volume by
	 * @param {boolean=} force Set volume directly
	 * @returns {number}    this.currentVol
	 */
	changeVolume(step,force=false){
		this.currentVol+=step;
		if(force){
			this.currentVol = step;
		}
		if(this.currentVol>1){
			this.currentVol=1;
		}
		if(this.currentVol<0){
			this.currentVol=0;
		}
		
		this._htmlAudio.volume=this.currentVol;
		this._YTAudio.setVolume(this.currentVol*100);
		this._SCAudio.setVolume(this.currentVol*100);
		this._publish(this.changeVolume,this.currentVol);
		return this.currentVol;
	}
	
	/**
	 * Stops all currently playing tracks. Does not change this._isPlaying.
	 *    Use pause() or togglePlay() instead.
	 */
	_stopPlaying(){
		this._htmlAudio.pause();
		this._YTAudio.pauseVideo();
		this._SCAudio.pause();
		this._setDuration(0);
		this._updateTime(0);
		this._SCAudio.load("&auto_play=false&buying=false&liking=false&download=false&sharing=false&show_artwork=false&show_comments=false&show_playcount=false&show_user=false&hide_related=false&visual=false&start_track=0&callback=true");
		this._YTAudio.cueVideoById("", 0);
		this._htmlAudio.src = "";
	}
	
	/**
	 * Toggles looping a singular track.
	 * @returns {boolean}    this._isLooping
	 */
	toggleLoop(){
		if(this._isLooping){
			this._isLooping = false;
		}else{
			this._isLooping = true;
		}
		this._publish(this.toggleLoop,this._isLooping);
		return this._isLooping;
	}
	
	/**
	 * Toggles shuffling all songs within a folder
	 * @returns {boolean}    this.isShuffling
	 */
	toggleShuffle(){
		if(this._isShuffling){
			this._isShuffling = false;
			this.currentlyPlaying['track'] = this.currentlyPlaying['album'].track_list[0];
			this.data.forEach(function(album){
				delete album.shuffled;
			});
			delete this.usrPrefs.liked_tracks.shuffled;
			this.findNextTrack(0);
		}else{
			this._isShuffling = true;
			if(this._isShufflingAll){
				this.toggleShuffleAll();
			}
			//if(this._isPlayingLiked){
			//	this.toggleLikedTracks();
			//}
			this.data.forEach(function(album){
				var tmp = Array.from(Array(album.track_list.length).keys());
				musicManager.shuffleArray(tmp);
				album.shuffled = tmp;
			});
			//liked_tracks
			var tmp = Array.from(Array(this.usrPrefs.liked_tracks.track_list.length).keys());
			musicManager.shuffleArray(tmp);
			this.usrPrefs.liked_tracks.shuffled = tmp;
			this.currentlyPlaying['track'] = this.currentlyPlaying['album'].track_list[this.currentlyPlaying['album'].shuffled[0]];
			this.findNextTrack(0);
		}
		this._publish(this.toggleShuffle,this._isShuffling);
		return this._isShuffling;
	}
	
	/**
	 * Toggles shuffling all tracks in all folders
	 * @returns {boolean}    this._isShufflingAll
	 */
	toggleShuffleAll(){
		if(this._isShufflingAll){
			this._isShufflingAll = false;
		}else{
			this._isShufflingAll = true;
			if(this._isShuffling){
				this.toggleShuffle();
			}
			if(this._isPlayingLiked){
				this._toggleLikedTracks();
			}
			this.findNextTrack(0);
		}
		this._publish(this.toggleShuffleAll,this._isShufflingAll);
		return this._isShufflingAll;
	}
	
	/**
	 * Toggles playing of only liked tracks.
	 * @returns {boolean}    this._isPlayingLiked
	 */
	toggleLikedTracks(){
		if(this._isPlayingLiked || this.usrPrefs.liked_tracks.track_list.length==0){
			if(this.usrPrefs.liked_tracks.track_list.length==0){
				alert("Zero tracks have been liked. Like a track to get started!")
				return "No liked tracks";
			}
			this._isPlayingLiked = false;
			this.currentlyPlaying['track'] = this.currentlyPlaying['album'].track_list[0];
			this.findNextTrack(0);
		}else{
			if(this._isShufflingAll){
				this.toggleShuffleAll();
			}
			this._isPlayingLiked = true;
			this.currentlyPlaying['track'] = this.usrPrefs.liked_tracks.track_list[0];
			if(this._isShuffling){
				this.currentlyPlaying['track'] = this.usrPrefs.liked_tracks.track_list[this.usrPrefs.liked_tracks.shuffled[0]];
			}
			this.currentlyPlaying['album'] = this.usrPrefs.liked_tracks;
			this.findNextTrack(0,true);
		}
		this._publish(this.toggleLikedTracks,this._isPlayingLiked);
		return this._isPlayingLiked;
	}
	
	/**
	 * Adds the track to the specified folder.
	 * @param {string} folderName
	 * @param {string} trackName
	 * @param {string} src
	 * @returns {Dict}    this.data
	 */
	 //TODO depreciated
	addTrack(folderName,trackName,src){
		if(!this.data[folderName]){
			this.data[folderName] = {};
		}
		this.data[folderName][trackName] = src;
		this._publish(this.addTrack,this.data);
		return this.data;
	}
	
	/**
	 * Removes the track from the specified folder.
	 * @param {string} folderName
	 * @param {string} trackName
	 * @returns {Dict}    this.data
	 */
	 //TODO depreciated
	removeTrack(folderName,trackName){
		if(!this.data[folderName]){
			return this.data;
		}
		delete this.data[folderName][trackName];
		if(Object.keys(this.data[folderName]).length == 0){
			delete this.data[folderName];
		}
		this._publish(this.removeTrack,this.data);
		return this.data;
	}
	
	/**
	 * Sets a tracks type. Setting it again removes the type, unless force == true.
	 * @param	{string} type type to be set. Must be one of two: 'skipped','liked'
	 * @param	{boolean=} force whether to force set the type
	 * @param	{string} src src for track. Defaults to current track
	 * @returns {Dict<string:string>}    this.trackType
	 */
	 //TODO depreciated
	setTrackType(type,force=false,src=this.currentlyPlaying['src']){
		if(this.trackType[src]==type && !force){
			delete this.trackType[src];
		}else{
			this.trackType[src] = type;
			if(src==this.currentlyPlaying['src'] && type=='skipped'){
				this.findNextTrack(1);
			}
		}
		this._publish(this.setTrackType,this.trackType);
		return this.trackType;
	}
	
	/**
	 * Deletes any elements matching the specified type from trackType
	 * @param {string=} type Type to be deleted. Leave empty to remove all types.
	 * @returns {Dict<string:string>}    this.trackType
	 */
	 //TODO depreciated
	resetTracksByType(type){
		if(!type){
			this.trackType = {};
		}else{
			for (var src in this.trackType){
				if(this.trackType[src] == type){
					delete this.trackType[src];
				}
			}
		}
		this._publish(this.resetTracksByType,this.trackType);
		return this.trackType;
	}
	
	/**
	 * https://stackoverflow.com/a/41245574. Finds html audio duration and executes callback.
	 */
	_getHTMLAudioDuration(url, next) {
		var _player = new Audio(url);
		_player.addEventListener("durationchange", function (e) {
			if (this.duration!=Infinity) {
			   var duration = this.duration
			   //IOS had a problem with this before
			   _player.src = "";
			   _player = null;
				next(Math.ceil(duration));
				next = function(){};
			};
		}, false);      
		_player.load();
		_player.currentTime = 24*60*60; //fake big time
		_player.volume = 0;
		_player.play();
		//waiting...
	};
	
	
	/**
	 * Sets the duration of the current track.
	 * @param {number} duration
	 * @returns {number}    this.currentDuration
	 */
	_setDuration(duration){
		this.currentDuration = duration;
		if(duration && this.currentlyPlaying['track'].duration != duration){
			this.currentlyPlaying['track'].duration = duration;
			//TODO upload here?
			uploadAlbum(this.currentlyPlaying['album'],false,false,"Duration",this.currentlyPlaying.album.title,this.currentlyPlaying.track.title);
		}
		this._publish(this._setDuration,this.currentDuration);
		return this.currentDuration;
	}
	
	/**
	 * Sets the current playback time in seconds
	 * @param {number} time
	 * @returns {number}    this.currentTime
	 */
	_updateTime(time){
		this.currentTime = time;
		this._publish(this._updateTime,this.currentTime);
		return this.currentTime;
	}
	
	/**
	 * Checks folder to see if all tracks have been skipped.
	 * @param {string} folder Folder to be checked
	 * @returns {boolean}    Whether entire folder is skipped or not.
	 */
	_isValidFolder(folder){
		let self = this;
		return folder.track_list.some(function(track){
			return !self.usrPrefs.hasBlockedTrack(track);
		});
	}
	
	/**
	 * Checks to see if all folders have been skipped.
	 * @returns {boolean}    Whether all folders are skipped or not.
	 */
	_hasValidFolders(){
		let self = this;
		return this.data.some(function(folder){
			return self._isValidFolder(folder);
		});
	}
	
	/**
	 * Gets a random track from all available tracks.
	 * @returns {Dict<string:string>}    Dictionary of {'folder':'exFolder','track':'exTrack'}
	 */
	_getRandomTrack(){
		var folderIndex = Math.floor(Math.random() * this.data.length);
		var trackIndex = Math.floor(Math.random() * this.data[folderIndex].track_list.length);
		return {'album':this.data[folderIndex],'track':this.data[folderIndex].track_list[trackIndex]};
	}
	
	//TODO
	_trackToAlbum(track){
		let albumContainer = [];
		this.data.forEach(function(album){
			if(album.hasTrack(track)){albumContainer.push(album);}
		});
		return albumContainer;
	}
	
	//TODO
	_albumTitleToAlbum(title){
		let index = -1;
		this.data.forEach(function(album,i){
			if(album.title == title){
				index = i;
			}
		});
		return index;
	}
	
	//TODO
	_sortAlbums(key="title",reversed=false){
		if(!this.data.length){return true};
		switch(typeof(this.data[0][key])){
			case "number":
				this.data.sort(function(a,b){
					let tmp = a[key]-b[key];
					if(tmp!=0){return tmp;}
					if (a["title"] < b["title"]) {
						return -1;
					}
					if (a["title"] > b["title"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "object": //TODO
				this.data.sort(function(a,b){
					var nameA = new Date(a[key]);
					var nameB = new Date(b[key]);
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					// names must be equal
					if (a["title"] < b["title"]) {
						return -1;
					}
					if (a["title"] > b["title"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "string":
				this.data.sort(function(a,b){
					var nameA = a[key].toUpperCase(); // ignore upper and lowercase
					var nameB = b[key].toUpperCase(); // ignore upper and lowercase
					if(nameA.length==0 || nameB.length==0){
						if (nameA < nameB) {
							return 1;
						}
						if (nameA > nameB) {
							return -1;
						}
					}
					
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					// names must be equal
					if (a["title"] < b["title"]) {
						return -1;
					}
					if (a["title"] > b["title"]) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				if(key == "artist"){
					this.data.sort(function(a,b){
						var nameA = a.getArtists().toUpperCase(); // ignore upper and lowercase
						var nameB = b.getArtists().toUpperCase(); // ignore upper and lowercase
						if(nameA.length==0 || nameB.length==0){
							if (nameA < nameB) {
								return 1;
							}
							if (nameA > nameB) {
								return -1;
							}
						}
						
						if (nameA < nameB) {
							return -1;
						}
						if (nameA > nameB) {
							return 1;
						}
						// names must be equal
						if (a["title"] < b["title"]) {
							return -1;
						}
						if (a["title"] > b["title"]) {
							return 1;
						}
						return 0;
					});
				}else if(key == "duration"){
					this.data.sort(function(a,b){
						let tmp = a.getTotalDuration()-b.getTotalDuration();
						if(tmp!=0){return tmp;}
						if (a["title"] < b["title"]) {
							return -1;
						}
						if (a["title"] > b["title"]) {
							return 1;
						}
						return 0;
					});
					break;
				}else{
					console.log("Error sorting");
					return this._sortAlbums("title",reversed);
				}
		}
		if(reversed){
			this.data.reverse();
		}
	}
	
	
	/**
	 * Returns the filetype of the given source.
	 * @param {string} src Source of file
	 * @returns {string}    One of three: 'HTML','SC','YT'
	 */
	 //TODO: needs cleaning
	static getFiletype(src){
		if(musicManager.getYoutubeId(src) != ""){
			return "YT"
		}
		try{
			let tmp = new URL(src);
			src = tmp["host"];
			if(src.search('soundcloud')>-1){
				if(tmp["href"].search('/sets/')>-1){
					//TODO Weird stuff with sc
					return "SC";
				}
				return "SC";
			}
			if(src.search('bandcamp')>-1||src.search('music')>-1&&src.search('musicradio')==-1){
				return "BC";
			} 
			return "HTML";
		}catch(e){
			return "HTML";
		}
	}
	
	/**
	 * https://stackoverflow.com/a/28191966. Gets key by value.
	 * @param {object} object
	 * @param {object} value
	 * @returns {object}    key
	 */
	static getKeyByValue(object, value) {
		return Object.keys(object).find(key => object[key] === value);
	}
	
	/**
	 * Shuffles 1d arrays.
	 * @param {Array<number>} array
	 * @param {number=} times Number of times to shuffle
	 * @param {number=} count Keeps track of number of shuffles
	 * @returns {Array<number>}    The shuffled array
	 */
	static shuffleArray(array,times=1,count=1){
		for (var i = 0; i < array.length; i++){
			const j = Math.floor(Math.random() * i);
			const temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		if(count<times){ //do it two times
			return musicManager.shuffleArray(array,times,count+=1);
		}
		return array;
	}
	
	/**
	 * Shuffles 2d arrays
	 * @param {Array<number>} array
	 * @returns {Array<number>}    The shuffled array
	 */
	static shuffle2dArray(array){
		for (var i = 0; i < array.length; i++){
			array[i] = musicManager.shuffleArray(array[i]);
		}
		return array;
	}
	
	/**
	 * Shuffles Dictionarys while keeping key:value pairs
	 * @param {Dict<object:object>} object
	 * @returns {Dict<object:object>}    The shuffled Dict
	 */
	static shuffleDict(object){
		let tmp = {};
		let copyKey = Object.keys(object);
		let copyVal = Object.values(object);
		copyVal = musicManager.shuffleArray(copyVal);
		for(let i = 0; i < copyKey.length; i++) {
			tmp[musicManager.getKeyByValue(object,copyVal[i])] = copyVal[i];
		}
		return tmp;
	}
	
	/**
	 * https://stackoverflow.com/a/950146 Loads the specified script
	 * @param {string} url
	 * @param {object} callback
	 */
	static loadScript(url, callback){
		// Adding the script tag to the head as suggested before
		var head = document.head;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = url;

		// Then bind the event to the callback function.
		// There are several events for cross browser compatibility.
		script.onreadystatechange = callback;
		script.onload = callback;

		// Fire the loading
		head.appendChild(script);
	}
	
	/**
	 * http://detectmobilebrowsers.com/ Determines if the user is using the mobile version.
	 * @returns {boolean}
	 */
	static mobileAndTabletCheck(){
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}
	
	/**
	 * Parses the youtube url for the id.
	 * @param {string} url Url of youtube video.
	 * @returns {string}    Id on success, empty string otherwise.
	 */
	 //TODO: needs cleaning
	static getYoutubeId(url){
		if(url.length == 11 && url.indexOf(".") == -1){ //Will be Depreciated
			return url;
		}
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
				if(tmp.pathname == "/watch"){
					let index = tmp.search.indexOf("?v=");
					return tmp.search.substr(index+3,11);
				}else{
					return tmp.pathname.substr(1,11);
				}
			}
			return "";
		}catch(e){
			return "";
		}
	}
	
	static getYoutubePlaylistId(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be"){
				let searchParams = new URLSearchParams(tmp.search);
				let id = searchParams.get("list");
				if(!id){return ""}
				return id;
			}
			return "";
		}catch(e){
			return "";
		}
	}
}

//Youtube calls event functions in a global scope
/**
 * Youtube calls events in global scope. This function catches it and
 *     sends it to all musicManager objects available.
 * @param {object} event
 */
function _globalYTEvent(event){
	for(var key in window) {
		  if (window[key] instanceof musicManager) {
			  //console.log(window[key]);
			  window[key]._YTEvent(event);
		  }
	}
}

/**
 * Youtube calls the ready event in global scope. This function catches it and
 *     _setTrack of all musicManager objects available.
 * @param {object} event
 */
function _globalYTReady(event){
	console.log('Youtube is ready');
	for(var key in window) {
		  if (window[key] instanceof musicManager) {
			  //console.log(window[key]);
			  window[key].findNextTrack(0);
		  }
	}
}
