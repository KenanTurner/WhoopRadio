import HTML from '../js/plugins/HTML/html.js';
import YT from '../js/plugins/YT/youtube.js';
import BC from '../js/plugins/BC/bandcamp.js';
import SC from '../js/plugins/SC/soundcloud.js';
import VGM from '../js/plugins/VGM/vgm.js';
import Custom from '../js/custom.js';
import Album from '../js/custom-album.js';
import MM from '../MetaMusic/src/meta-music.js';
Object.setPrototypeOf(HTML.Track,Custom); //This is poggers
Object.setPrototypeOf(HTML.Track.prototype,Custom.prototype); //Like super poggers
Object.setPrototypeOf(MM,Album); //This is poggers
Object.setPrototypeOf(MM.prototype,Album.prototype); //Like super poggers

//Now it goes HTML.Track > Custom > Track
let imports = [HTML,YT,BC,SC,VGM,Custom,Album,MM];
function map(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}
map(imports,window);
console.log("Loaded");

window.map = function(arr,obj={},f=function(i){return i}){arr.forEach(function(i){if(i.name) this[i.name] = f(i)}.bind(obj));return obj;}

MetaMusic.players = {"HTML":HTML,"YT":YT,"SC":SC,"BC":BC,"VGM":VGM};
window.mm = new MetaMusic();
//TODO fix BC constructor
mm._players.BC._bc_php = "./MetaMusic/src/plugins/BC/loadBC.php"
mm.subscribe('error',function(err){
	console.error(err);
});
//mm.subscribe('all',function(e){console.log(e)});

let previous_btn = document.getElementById("previous");
let backward_btn = document.getElementById("backward");
let play_btn = document.getElementById("play");
let pause_btn = document.getElementById("pause");
let stop_btn = document.getElementById("stop");
let forward_btn = document.getElementById("forward");
let next_btn = document.getElementById("next");

let load_promise = mm.waitForEvent('ready');

previous_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('next',-1));
});
backward_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('fastForward',-5));
});
play_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('play'));
});
pause_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('pause'));
});
stop_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('stop'));
});
forward_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('fastForward',5));
});
next_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('next',1));
});

let previous_track = undefined;
mm.subscribe('loaded',function(e){
	if(previous_track) Custom.onUnload(previous_track);
	Custom.onLoad(mm._track);
	previous_track = mm._track;
});

let progress_div = document.getElementById('current-progress');
mm.subscribe('timeupdate',function(e){
	let p = 100*mm._status.time/mm._status.duration;
	progress_div.style.width = String(p)+"%";
});

//make progress bar clickable
let progress_container = document.getElementById('progress-container');
progress_container.addEventListener('click',function(e){
	let p = e.offsetX/progress_container.offsetWidth;
	mm.seek(mm._status.duration*p);
});

let album_container = document.getElementById('album-container');
let track_container = document.getElementById('track-container');
let previous_album = undefined;
Album.onClick = function(a){
	if(previous_album) Album.onClose(previous_album);
	Album.onOpen(a);
	window.history.pushState(a.toJSON(),'','#'+encodeURI(a.title));
}
//Soundcloud causes huge issues :(
Album.onBack = function(a){
	if(window.history.state){
		window.history.back();
	}else{
		window.history.pushState(a.toJSON(),'','#'+encodeURI(a.title));
		window.history.back();
	}
}
Album.onClose = function(a){
	album_container.style.display = 'grid';
	window.scrollTo(0, 0);
	while(track_container.firstChild) track_container.removeChild(track_container.lastChild);
	a.tracks.forEach(function(t,i,arr){
		t.elements.length = 0; //May cause issues later
	});
}
Album.onOpen = function(a){
	album_container.style.display = 'none';
	window.scrollTo(0, 0);
	track_container.appendChild(a.toAlbumHeader());
	a.tracks.forEach(function(t){
		track_container.appendChild(t.toHTML());
		if(t.equals(mm._track)) Custom.onLoad(t);
	});
	previous_album = a;
}
Album.onPlay = function(a){
	mm.stop();
	mm.clear();
	mm.push(a);
	mm.load(a.tracks[0])
	.then(mm.chain('play'));
}
window.addEventListener('popstate', function(e){
	if(previous_album) Album.onClose(previous_album);
  if(e.state){
		let a = albums.find(function(tmp){return tmp.equals(e.state)})
		Album.onOpen(a);
	}
});

Custom.onClick = function(t){
	let paused = mm._status.paused;
	mm.load(t).then(function(e){
		if(!paused) mm.play();
	});
}
Custom.onLoad = function(t){
	t.elements.forEach(function(e){
		e.classList.add('playing');
	});
}
Custom.onUnload = function(t){
	t.elements.forEach(function(e){
		e.classList.remove('playing');
	});
}

//keyboard controls
let keyEvent = function(e,key_code,f,...args){
	document.addEventListener(e, function(e){
		if(e.key === key_code && f.name === "") return f(...args);
		if(e.key === key_code) return mm[f](...args);
	}, false);
}
let keyToggle = function(e,key_code,attr,f,g,...args){
	document.addEventListener(e, function(e){
		if(e.key === key_code && mm._status[attr]) return mm[f](...args);
		if(e.key === key_code && !mm._status[attr]) return mm[g](...args);
	});
}
//prevent defaults
document.addEventListener("keydown", function(e) {
	if([' ', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) > -1) {
		e.preventDefault();
	}
});

// handle keyboard events
keyToggle('keyup',' ','paused','play','pause');
keyToggle('keyup','s','shuffled','unshuffle','shuffle');
keyEvent('keyup','.','next',1);
keyEvent('keyup',',','next',-1);
keyEvent('keydown','ArrowRight','fastForward',5);
keyEvent('keydown','ArrowLeft','fastForward',-5);
keyEvent('keyup','ArrowUp',function(){
	let vol = mm._status.volume+0.1;
	vol = Math.max(Math.min(vol,1),0)
	mm.setVolume(vol);
});
keyEvent('keyup','ArrowDown',function(){
	let vol = mm._status.volume-0.1;
	vol = Math.max(Math.min(vol,1),0)
	mm.setVolume(vol);
});
keyEvent('keyup','m',function(){
	if(mm._status.volume == 0){
		mm.setVolume(1);
	}else{
 		mm.setVolume(0);
	}
});
keyEvent('keyup','s','shuffle');
keyEvent('keyup','0','seek',0);

//Media Session
if ('mediaSession' in navigator) {
	console.log("Using mediaSession");
	//TODO use cool metadata api
	try{
		navigator.mediaSession.setActionHandler('play', function(){mm.play();});
		navigator.mediaSession.setActionHandler('pause', function(){mm.pause();});
		navigator.mediaSession.setActionHandler('seekbackward', function(){mm.fastForward(-5)});
		navigator.mediaSession.setActionHandler('seekforward', function(){mm.fastForward(5)});
		navigator.mediaSession.setActionHandler('previoustrack', function(){mm.next(-1)});
		navigator.mediaSession.setActionHandler('nexttrack', function(){mm.next(1)});
		//TODO seekto event
	}catch(e){
		console.log("mediaSession extras is unsupported");
	}
}else{
	console.log("mediaSession is unsupported");
}

//load albums
fetch("./php/get-albums.php").then(function(r){return r.json()}).then(function(arr){
	window.albums = [];
	arr.forEach(function(data){
		let a = new Album(data);
		albums.push(a);
		album_container.appendChild(a.toHTML());
	});
	if(window.location.hash){
		if(window.history.state){
			Album.onOpen(new Album(window.history.state));//this will cause problems
		}else{
			//We need to create a new event?
			let tmp = window.location.hash.substring(1);
			let title = decodeURI(tmp);
			albums.forEach(function(a){
				if(a.title == title) Album.onOpen(a);
			});
		}
	}
});
