import mm from './main.js';
import Album from './custom-album.js';
import Track from './custom-track.js';

let volume_btn = document.getElementById("volume");
let previous_btn = document.getElementById("previous");
let play_btn = document.getElementById("play");
let next_btn = document.getElementById("next");
let shuffle_btn = document.getElementById("shuffle");
let loop_btn = document.getElementById("loop");
let progress_container = document.getElementById('progress-container');
let progress_div = document.getElementById('current-progress');
let duration_div = document.getElementById('current-duration');
let current_track_title = document.getElementById('current-track-title');
let current_track_img = document.getElementById('current-track-img');

let input = {_paused:true,_sorted:true,_volume:1};

//###################### keyboard controls ######################
document.addEventListener("keydown", function(e){ //prevent defaults
	if([' ', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) > -1) e.preventDefault();
});
let keyEvent = function(e,key_code,f,...args){
	document.addEventListener(e, function(e){
		if(e.key === key_code) return f(...args);
	}, false);
}


//###################### Play/Pause ######################
Object.defineProperty(input,'paused',{
	set: function(bool){
		this._paused = bool == true;
		mm.enqueue(this._paused? 'pause': 'play');
		play_btn.children[0].src = this._paused? './images/play-white.png': './images/pause-white.png';
		let session = window.top.navigator.mediaSession;
		if(session) session.playbackState = input.paused? "paused": "playing";
	},
	get: function(){ return this._paused; }
});
play_btn.addEventListener('click',function(){
	input.paused = !input.paused;
});
mm.subscribe({type:'done',callback:function(e){
	input.paused = true;
}});
mm.subscribe({type:'loaded',callback:function(e){
	if(!input.paused) input.paused = false;
}});
keyEvent('keyup',' ',play_btn.click.bind(play_btn));


//###################### Next/Prev ######################
previous_btn.addEventListener('click',mm.enqueue.bind(mm,'next',-1));
next_btn.addEventListener('click',mm.enqueue.bind(mm,'next',1));
keyEvent('keyup','.',next_btn.click.bind(next_btn));
keyEvent('keyup',',',previous_btn.click.bind(previous_btn));


//###################### Volume ######################
function clamp(min, number, max){ return Math.max(min, Math.min(number, max)); }
Object.defineProperty(input,'volume',{
	set: function(vol){
		this._volume = clamp(0,vol,1);
		mm.enqueue('setVolume',this._volume);
		volume_btn.value = input.volume.toString();
		volume_btn.dispatchEvent(new Event('change'));
	},
	get: function(){ return this._volume; }
});
volume_btn.addEventListener('change',function(e){
	let vol = Number(this.value);
	if(input.volume !== vol) input.volume = vol;
});
keyEvent('keyup','ArrowUp',function(){
	input.volume += 0.1;
});
keyEvent('keyup','ArrowDown',function(){
	input.volume -= 0.1;
});


//###################### Shuffle ######################
Object.defineProperty(input,'sorted',{
	set: function(bool){
		this._sorted = bool == true;
		this._sorted? mm.queue.sort(): mm.queue.shuffle();
		shuffle_btn.children[0].src = this._sorted? './images/shuffle-white.png': './images/shuffle-highlight.png';
	},
	get: function(){ return this._sorted; }
});
shuffle_btn.addEventListener('click',function(){
	input.sorted = !input.sorted;
});
keyEvent('keyup','s',shuffle_btn.click.bind(shuffle_btn));


//###################### Loop ######################
/*let is_looping = false;
loop_btn.addEventListener('click',function(){
	is_looping = !is_looping;
	loop_btn.children[0].src = is_looping? './images/loop-highlight.png': './images/loop-white.png';
});
mm.subscribe({type:'ended',callback:function(e){
	if(is_looping && !is_paused) mm.enqueue('play');
}});
keyEvent('keyup','l',loop_btn.click.bind(shuffle_btn));*/
loop_btn.addEventListener('click',function(){
	window.top.console._div.classList.toggle('hidden');
});


//###################### progress bar ######################
mm.subscribe({type:'timeupdate',callback:function(e){
	let p = 100*e.status.time/e.status.duration;
	progress_div.style.width = String(p)+"%";
	duration_div.style.width = String(100-p)+"%";
}});
//make progress bar clickable
progress_container.addEventListener('click',async function(e){
	let status = await mm.getStatus();
	let p = e.offsetX/progress_container.offsetWidth;
	mm.enqueue('seek',status.duration*p);
});
mm.subscribe({type:'loaded',callback:function(e){
	current_track_title.innerText = mm.current_track.title;
	current_track_title.title = mm.current_track.title;
	current_track_img.children[0].src = mm.current_track.artwork_url || './images/default-white.png';
}});
keyEvent('keydown','ArrowRight',mm.enqueue.bind(mm,'fastForward',5));
keyEvent('keydown','ArrowLeft',mm.enqueue.bind(mm,'fastForward',-5));
keyEvent('keyup','0',mm.enqueue.bind(mm,'seek',0));


//###################### Media Session ######################
if ('mediaSession' in navigator) {
	console.log("Using mediaSession");
	let session = window.top.navigator.mediaSession;
	mm.subscribe({type:'loaded',callback:function(e){
		let obj = {}
		obj.title = mm.current_track.title;
		obj.artist = mm.current_track.artist;
		if(!obj.artist && mm.current_album) obj.artist = mm.current_album.artist;
		if(mm.current_album) obj.album = mm.current_album.title;
		if(mm.current_album) obj.artwork = ['96x96','128x128','192x192','256x256','354x384','512x512'].map(function(sizes){
			return {src: mm.current_album.artwork_url || "./images/default-white.png", sizes, type: 'image/png'};
		})
		session.metadata = new MediaMetadata(obj);
	}});
	mm.subscribe({type:'loaded',callback:function(e){
		let setInput = function(key,val){
			return function(){ input[key] = val; }
		}
		try{
			session.setActionHandler('play', setInput('paused',false));
			session.setActionHandler('pause', setInput('paused',true));
			session.setActionHandler('stop', setInput('paused',true));
			session.setActionHandler('seekbackward', function({seekOffset}){
				mm.enqueue('fastForward',seekOffset || -5);
			});
			session.setActionHandler('seekforward', function({seekOffset}){
				mm.enqueue('fastForward',seekOffset || 5);
			});
			navigator.mediaSession.setActionHandler('seekto', function({seekTime}){
				mm.enqueue('seek',seekTime);
			});
			session.setActionHandler('previoustrack', previous_btn.click.bind(previous_btn));
			session.setActionHandler('nexttrack', next_btn.click.bind(next_btn));
		}catch(e){
			console.error("mediaSession failed to initialize: ",e);
		}
	}});
	mm.subscribe({type:'timeupdate',callback:function(e){
		let obj = {}
		obj.duration = e.status.duration || 0;
		obj.position = e.status.time || 0;
		obj.playbackRate = 1;
		session.setPositionState(obj);
	}});
	
}else{
	console.log("mediaSession is unsupported");
}

//###################### Album onLoad ######################
Album.onLoad = async function(album){
	mm.clear();
	mm.enqueue('stop');
	mm.enqueue(mm.queue.clear.bind(mm.queue));
	mm.enqueue(mm.queue.push.bind(mm.queue),album);
	mm.enqueue('load',album.tracks[0]);
	await mm.waitForEvent('loaded');
	input.paused = false;
}

//###################### Track onLoad ######################
Track.onLoad = function(track){
	mm.clear();
	mm.enqueue('load',track);
}

//Fix footer margins
let controls_div = document.getElementById('controls');
window.addEventListener('resize', function(){
	document.body.style.marginBottom = controls_div.clientHeight+"px";
});
window.dispatchEvent(new Event('resize'));


//###################### Window lost focus ######################
document.addEventListener("visibilitychange", function(){
	setTimeout(function(){
		input.paused = input.paused;
	},50);
},false);

console.log("Controls are ready");
export default input;