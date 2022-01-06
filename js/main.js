import HTML from '../MetaMusic/src/plugins/HTML/html.js';
import YT from '../MetaMusic/src/plugins/YT/youtube.js';
import BC from '../MetaMusic/src/plugins/BC/bandcamp.js';
import SC from '../MetaMusic/src/plugins/SC/soundcloud.js';
import Queue from '../MetaMusic/src/queue.js';
import MetaMusic from '../MetaMusic/src/meta-music.js';
import Track from './custom-track.js';
import Album from './custom-album.js';
import MetaQueue from './custom-queue.js';
let Player = Object.getPrototypeOf(MetaMusic);

//Inject the Custom class into the prototype chain
Object.setPrototypeOf(Player.Track,Track); //This is poggers
Object.setPrototypeOf(Player.Track.prototype,Track.prototype); //Like super poggers
Object.setPrototypeOf(Queue,MetaQueue); //This is poggers
Object.setPrototypeOf(Queue.prototype,MetaQueue.prototype); //Like super poggers
BC.proxy_url = '../MetaMusic/src/plugins/BC/bandcamp-proxy.php';

let imports = {Player,HTML,YT,BC,SC,MetaMusic,Album};
function map(src,dest={},key=function(k){return k},value=function(v){return v}){for(let k in src){dest[key(k)] = value(src[k]);};return dest;}
map(imports,window);
console.log("Imports Loaded");

MetaMusic.players = {HTML,YT,SC,BC};

window.mm = new MetaMusic();
mm.subscribe({type:'error',callback:function(err){
	console.error(err);
	alert("There was an error playing the requested file");
}});
mm.subscribe({type:'all',callback:function(e){console.debug(e)}});
export default mm;


//################### Handle user interaction ###################
let album_container = document.getElementById('album-container');
let album_track_container = document.getElementById('album-track-container');

let current_album;
Album.onOpen = function(album){
	if(current_album) current_album.elements.forEach(function(div){ div.remove(); });
	album_container.classList.add('hidden');
	album_track_container.appendChild(album.toTrackContainer());
	album_track_container.classList.remove('hidden');
	window.scrollTo(0, 0);
	current_album = album;
	if(!album.equals(window.history.state)) window.history.pushState(album.toJSON(),'',album.title? '#'+encodeURI(album.title): '#');
}
Album.onClose = function(album){
	window.history.back();
}
let queue_btn = document.getElementById('queue');
queue_btn.addEventListener('click',function(e){
	Album.onOpen(mm.queue);
});
function historyChange(e){
	//console.log("History changed: ",e.state);
	if(!e.state){
		if(current_album) current_album.elements.forEach(function(div){ div.remove(); });
		album_container.classList.remove('hidden');
		album_track_container.classList.add('hidden');
		return current_album = undefined;
	}
	let album = metadata.find(function(a){
		return a.equals(e.state);
	});
	if(!album && mm.queue.equals(e.state)) album = mm.queue;
	if(!album) return console.warn("Disappearing album: ",e.state);
	Album.onOpen(album);
};


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
window.metadata = (await (await fetch("../php/metadata.php")).json()).map(function(data){
	return new Album(data);
}).filter(function(album){
	return album.tracks.length > 0;
}).sort(function(a,b){
	if(a.title < b.title) return -1;
	if(a.title > b.title) return 1;
	if(a.title === b.title) return 0;
});
metadata.forEach(function(album){
	album_container.appendChild(album.toNode());
});

//################### Reflect History ###################
window.addEventListener('popstate', historyChange);
historyChange(window.history);
if(!window.history.state && window.location.hash){
	let title = decodeURI(window.location.hash.substring(1));
	let album = metadata.find(function(a){
		return a.title === title
	});
	if(album){
		window.history.pushState(null,'','#');
		Album.onOpen(album);
	}
}
