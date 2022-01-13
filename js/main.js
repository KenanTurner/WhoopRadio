import HTML from '../MetaMusic/src/plugins/HTML/html.js';
import YT from '../MetaMusic/src/plugins/YT/youtube.js';
import BC from '../MetaMusic/src/plugins/BC/bandcamp.js';
import SC from '../MetaMusic/src/plugins/SC/soundcloud.js';
import Queue from '../MetaMusic/src/queue.js';
import MetaMusic from '../MetaMusic/src/meta-music.js';
import CustomTrack from './custom-track.js';
import CustomAlbum from './custom-album.js';
import CustomQueue from './custom-queue.js';
let Player = Object.getPrototypeOf(MetaMusic);

//Inject the Custom class into the prototype chain
Object.setPrototypeOf(Player.Track,CustomTrack); //This is poggers
Object.setPrototypeOf(Player.Track.prototype,CustomTrack.prototype); //Like super poggers
Object.setPrototypeOf(Queue,CustomQueue); //This is poggers
Object.setPrototypeOf(Queue.prototype,CustomQueue.prototype); //Like super poggers
BC.proxy_url = '../MetaMusic/src/plugins/BC/bandcamp-proxy.php'; //Don't forget to fix BC proxy

let imports = {Player,HTML,YT,BC,SC,MetaMusic};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

MetaMusic.players = {HTML,YT,SC,BC};

window.mm = new MetaMusic();
mm.subscribe({type:'error',callback:function(err){
	console.error(err);
	//alert("There was an error playing the requested file");
}});
mm.subscribe({type:'all',callback:function(e){console.debug(e)}});
export default mm;


//################### Handle user interaction ###################
let album_container = document.getElementById('album-container');
let album_track_container = document.getElementById('album-track-container');

mm.current_album = undefined;
CustomAlbum.onOpen = function(album,update_history = true){
	if(mm.current_album) mm.current_album.containers.remove();
	album_container.classList.add('hidden');
	album_track_container.appendChild(album.toTrackContainer());
	album_track_container.classList.remove('hidden');
	window.scrollTo(0, 0);
	mm.current_album = album;
	if(update_history) window.history.pushState(album.toJSON(),'',album.title? '#'+encodeURI(album.title): '#');
}
CustomAlbum.onClose = function(album){
	window.history.back();
}
let queue_btn = document.getElementById('queue');
queue_btn.addEventListener('click',function(e){
	CustomAlbum.onOpen(mm.queue);
});
CustomAlbum.onAppend = function(album){
	mm.queue.push(album);
}
CustomAlbum.onInsert = function(album){
	mm.queue.insertNext(album);
}
CustomTrack.onAppend = function(track){
	mm.queue.push(track);
}
CustomTrack.onInsert = function(track){
	mm.queue.insertNext(track);
}

let previous_track;
mm.subscribe({type:'loaded',callback:function(e){
	if(previous_track) previous_track.css('remove','playing');
	mm.queue.tracks.forEach(function(t){
		t.css('remove','playing');
	});
	mm.current_track.css('add','playing');
	previous_track = mm.current_track;
}});

//################### Download Metadata ###################
let {default:metadata} = await import('./metadata.js');
metadata.forEach(function(album){
	album_container.appendChild(album.toNode());
});

//################### Reflect History ###################
function historyChange(e){
	if(!e.state){
		if(mm.current_album) mm.current_album.containers.remove();
		album_container.classList.remove('hidden');
		album_track_container.classList.add('hidden');
		return mm.current_album = undefined;
	}
	let album = metadata.find(function(a){
		return a.equals(e.state);
	});
	if(!album) album = metadata.find(function(a){
		return a.title === e.state.title;
	});
	if(!album && mm.queue.equals(e.state)) album = mm.queue;
	if(!album) return console.warn("Disappearing album: ",e.state);
	CustomAlbum.onOpen(album,false);
};
window.addEventListener('popstate', historyChange);
historyChange(window.history);
if(!window.history.state && window.location.hash){
	let title = decodeURI(window.location.hash.substring(1));
	let album = metadata.find(function(a){
		return a.title === title
	});
	if(album){
		window.history.pushState(null,'','#');
		CustomAlbum.onOpen(album);
	}
}
