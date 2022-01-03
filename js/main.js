import HTML from '../js/plugins/HTML/html.js';
import YT from '../js/plugins/YT/youtube.js';
import BC from '../js/plugins/BC/bandcamp.js';
import SC from '../js/plugins/SC/soundcloud.js';
import VGM from '../js/plugins/VGM/vgm.js';
import Custom from '../js/custom.js';
import Album from '../js/custom-album.js';
import MetaAlbum from '../js/custom-meta.js';
import MM from '../MetaMusic/src/meta-music.js';
Object.setPrototypeOf(HTML.Track,Custom); //This is poggers
Object.setPrototypeOf(HTML.Track.prototype,Custom.prototype); //Like super poggers
Object.setPrototypeOf(MM,MetaAlbum); //This is poggers
Object.setPrototypeOf(MM.prototype,MetaAlbum.prototype); //Like super poggers

//Now it goes HTML.Track > Custom > Track
let imports = [HTML,YT,BC,SC,VGM,Custom,Album,MM,MetaAlbum];
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

let upload_btn = document.getElementById("upload");
let volume_btn = document.getElementById("volume");
let previous_btn = document.getElementById("previous");
let play_btn = document.getElementById("play");
let next_btn = document.getElementById("next");
let shuffle_btn = document.getElementById("shuffle");
let loop_btn = document.getElementById("loop");
let current_track_title = document.getElementById('current-track-title');
let current_track_img = document.getElementById('current-track-img');

let load_promise = mm.waitForEvent('ready');

upload_btn.addEventListener('click',function(){
	let url = window.prompt("Please enter the url:");
	try{
		let tmp = new URL(url);
		//we need to determine if it is a track for album
		//let p = [Album._validURL(url),Album._validAlbumURL(url)].filter(Boolean);
		let isTrack = Album._validURL(url);
		let isAlbum = Album._validAlbumURL(url);
		if(isTrack && isAlbum){
			if(window.confirm('Is this url for a track?')){
				isAlbum = false;
			}else if(window.confirm('Is this url for an album?')){
				isTrack = false;
			}else{
				throw new Error("Cancelled");
			}
		}
		if(isTrack){
			return Album.fetchTrack(url)
			.then(function(o){
				if(!current_album || mm.equals(current_album)) return new Promise(function(res,rej){
					window.alert("Click on any album to add the track");
					waitForOpen = res
				}).then(function(){return o});
				return o;
			})
			.then(function(o){
				let album = albums.find(function(a){
					return a.equals(current_album);
				});
				let obj = album.toJSON();
				obj.tracks.push(o);
				return Album.uploadAlbum(obj)
				.then(function(obj){
					let pred = album.equals(current_album);
					album.push(o);
					if(pred){
						Album.onClose(current_album);
						current_album = album;
						Album.onOpen(current_album);
					}
					return obj;
				});
			}).then(function(o){
				console.log("Uploaded:",o);
				window.alert("Upload Completed!");
			});
		}
		if(isAlbum){
			return Album.fetchAlbum(url)
			.then(function(o){
				return Album.uploadAlbum(o)
				.then(function(obj){
					let album = new Album(obj);
					
					let index = albums.findIndex(function(a){
						return a.title === obj.title && a.src === obj.src;
					});
					if(index === -1){
						albums.push(album);
					}else{
						console.log(albums[index],current_album);
						let pred = albums[index].equals(current_album);
						albums[index] = album;
						if(pred){
							Album.onClose(current_album);
							current_album = album;
							Album.onOpen(current_album);
						}
					}
					updateAlbums();					
					return obj;
				});
			}).then(function(o){
				console.log("Uploaded:",o);
				window.alert("Upload Completed!");
			});
		}
		throw new Error("Invalid url");
	}catch(e){
		console.error(e);
		window.alert("Upload Failed!");
	}
});
volume_btn.addEventListener('change',function(e){
	load_promise.then(mm.chain('setVolume',this.value));
});
previous_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('next',-1));
});
play_btn.addEventListener('click',function(){
	if(mm._status.paused){
		load_promise.then(mm.chain('play'));
	}else{
		load_promise.then(mm.chain('pause'));
	}
});
next_btn.addEventListener('click',function(){
	load_promise.then(mm.chain('next',1));
});
shuffle_btn.addEventListener('click',function(){
	if(mm._status.shuffled){
		load_promise.then(mm.chain('unshuffle'));
	}else{
		load_promise.then(mm.chain('shuffle'));
	}
});
loop_btn.addEventListener('click',function(){
	mm._status.repeat = !mm._status.repeat;
	if(mm._status.repeat){
		loop_btn.children[0].src = './images/loop-highlight.png';
	}else{
		loop_btn.children[0].src = './images/loop-white.png';
	}
});
mm.subscribe('volumechange',function(e){
	if(mm._status.volume !== volume_btn.value) volume_btn.value = mm._status.volume;
});
mm.subscribe('play',function(e){
	play_btn.children[0].src = './images/pause-white.png';
});
mm.subscribe('pause',function(e){
	play_btn.children[0].src = './images/play-white.png';
});
mm.subscribe('shuffle',function(e){
	if(mm.length != 0) shuffle_btn.children[0].src = './images/shuffle-highlight.png';
});
mm.subscribe('sort',function(e){
	shuffle_btn.children[0].src = './images/shuffle-white.png';
});
mm.subscribe('loaded',function(e){
	current_track_title.innerText = mm._track.title;
	current_track_title.title = mm._track.title;
	current_track_img.children[0].src = mm._track.artwork_url || './images/default-white.png';
});

let previous_track = undefined;
mm.subscribe('loaded',function(e){
	if(previous_track) Custom.onUnload(previous_track);
	Custom.onLoad(mm._track);
	previous_track = mm._track;
});

let progress_div = document.getElementById('current-progress');
let duration_div = document.getElementById('current-duration');
mm.subscribe('timeupdate',function(e){
	let p = 100*mm._status.time/mm._status.duration;
	progress_div.style.width = String(p)+"%";
	duration_div.style.width = String(100-p)+"%";
});

//make progress bar clickable
let progress_container = document.getElementById('progress-container');
progress_container.addEventListener('click',function(e){
	let p = e.offsetX/progress_container.offsetWidth;
	mm.seek(mm._status.duration*p);
});

let album_container = document.getElementById('album-container');
let album_track_container = document.getElementById('album-track-container');
window.current_album = undefined;
Album.onClick = function(a){
	window.history.pushState(a.toJSON(),'','#'+encodeURI(a.title));
	historyChange(window.history);
}
Album.onBack = function(a){
	window.history.back();
}
Album.onClose = function(a){
	let parent = a.elements.pop();
	a.tracks.forEach(function(t,i,arr){
		t.elements = t.elements.filter(function(el){
			return el.parentElement != parent;
		});
	});
	parent.remove();
}
let waitForOpen = undefined;
Album.onOpen = function(a){
	if(waitForOpen && !a.equals(mm)) waitForOpen();
	window.scrollTo(0, 0);
	album_track_container.appendChild(a.toTrackContainer());
	a.tracks.forEach(function(t){
		let index = mm.find(t);
		if(index != -1) mm.tracks[index].elements = t.elements;
		if(t.equals(mm._track)) mm._track.elements = t.elements;
	});
	if(mm._track) Custom.onLoad(mm._track);
}
Album.onLoad = function(a){
	if(mm._track) mm.stop();
	mm.clear();
	mm.push(a);
	mm.sort();
	mm.load(a.tracks[0])
	.then(mm.chain('play'));
}
//Soundcloud really screws this up :(
function historyChange(e){
	//always close current album
	if(current_album) Album.onClose(current_album);
	//if no album is set, close the desktop
	if(!current_album) album_container.classList.add('hidden');
	//no state specified, return to desktop
	if(!e.state){
		album_container.classList.remove('hidden');
		current_album = undefined;
	}else{
		current_album = albums.find(function(a){
			return a.equals(e.state);
		});
		if(mm.equals(e.state)) current_album=mm;
		if(!current_album){
			console.log("Disappearing album:",e.state);
			if(e.state.title === mm.title){
				mm.push(...e.state.tracks);
				current_album = mm;
			}else{
				let tmp = albums.find(function(a){
					return a.title === e.state.title;
				});
				if(!tmp) return;
				current_album = tmp;
			}
		}
		Album.onOpen(current_album);
	}
};
window.addEventListener('popstate', historyChange);

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
Custom.onOpen = function(t){
	t.elements.forEach(function(e){
		e.lastChild.style.display = "none"
		t.toOptions().forEach(function(node){
			e.appendChild(node);
		})
	});
}
Custom.onClose = function(t){
	t.elements.forEach(function(e){
		while(e.children.length > 3) e.removeChild(e.lastChild)
		e.lastChild.style.display = "unset"
	});
}
Custom.onAppend = function(t){
	mm.push(t);
}
Custom.onInsert = function(t){
	mm.insertNext(t);
}
function reloadAlbum(e){
	if(!current_album) return;
	let a = e.target;
	if(!current_album.equals(a)) return;
	Album.onClose(current_album);
	Album.onOpen(current_album);
}
mm.subscribe('add',reloadAlbum);
mm.subscribe('remove',reloadAlbum);
mm.subscribe('clear',reloadAlbum);
mm.subscribe('shuffle',reloadAlbum);
mm.subscribe('sort',reloadAlbum);

//open queue when clicked on
let queue_div = document.getElementById('queue');
queue_div.addEventListener('click',function(e){
	if(!mm.equals(current_album)) Album.onClick(mm);
});

//prevent defaults
document.addEventListener("keydown", function(e) {
	if([' ', 'ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].indexOf(e.key) > -1) {
		e.preventDefault();
	}
});

let clickBtn = function(div){
	div.click();
}

let keyEvent = function(e,key_code,f,...args){
	document.addEventListener(e, function(e){
		if(e.key === key_code) return f(...args);
	}, false);
}

// handle keyboard events
keyEvent('keyup',' ',clickBtn,play_btn);
keyEvent('keyup','s',clickBtn,shuffle_btn);
keyEvent('keyup','.',clickBtn,next_btn);
keyEvent('keyup',',',clickBtn,previous_btn);
keyEvent('keyup','l',clickBtn,loop_btn);
keyEvent('keydown','ArrowRight',function(){
	mm.fastForward(5);
});
keyEvent('keydown','ArrowLeft',function(){
	mm.fastForward(-5);
});
keyEvent('keyup','0',function(){
	mm.seek(0);
});

keyEvent('keyup','ArrowUp',function(){
	//Lol gotta convert from string to number and back again
	mm.setVolume(mm._status.volume+0.1);
});
keyEvent('keyup','ArrowDown',function(){
	mm.setVolume(mm._status.volume-0.1);
});
keyEvent('keyup','m',function(){
	if(mm._status.volume > 0){
		mm.setVolume(0);
	}else{
		mm.setVolume(1);
	}
});

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

function updateAlbums(){
	albums.sort(function(a,b){
		if(a.title < b.title) return -1;
		if(a.title > b.title) return 1;
		if(a.title === b.title) return 0;
	})
	while(album_container.firstChild){
		album_container.removeChild(album_container.lastChild);
	}
	albums.forEach(function(a){
		album_container.appendChild(a.toHTML());
	});
}

//load albums
fetch("./php/get-albums.php").then(function(r){return r.json()}).then(function(arr){
	window.albums = [];
	arr.forEach(function(data){
		let a = new Album(data);
		albums.push(a);
	});
	updateAlbums();
	if(window.history.state){
		historyChange(window.history);
	}else if(window.location.hash){
		//We need to create a new event?
		let tmp = window.location.hash.substring(1);
		let title = decodeURI(tmp);
		let a = albums.find(function(a){
			return a.title == title
		});
		Album.onClick(a); //this will cause problems
	}
});

//Fix footer margins
let controls_div = document.getElementById('controls');
window.addEventListener('resize', function(){
	document.body.style.marginBottom = controls_div.clientHeight+"px";
});
