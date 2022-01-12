import HTML from './HTML/html.js';
import YT from './YT/youtube.js';
import BC from './BC/bandcamp.js';
import SC from './SC/soundcloud.js';
import VGM from './VGM/vgm.js';
import CustomAlbum from '../custom-album.js';
import metadata from '../metadata.js';
let imports = {"mp3,mp4,wav,flac":HTML,"Youtube":YT,"Bandcamp":BC,"Soundcloud":SC,"VGM link":VGM};

let Track = {};
let track_div = document.getElementById("upload-track");
let track_type = document.getElementById("track-type");
for(let key in imports){
	let opt = document.createElement('option');
    opt.value = key;
    opt.innerText = key;
    track_type.appendChild(opt);
}
track_type.addEventListener('change',function(e){
	let key = Object.keys(imports).find(function(key){return imports[key] === HTML});
	if(track_type.value === key){
		track_title.parentElement.classList.remove('hidden');
	}else{
		track_title.parentElement.classList.add('hidden');
	}
});
let track_dest = document.getElementById("track-dest");
metadata.forEach(function(album){
	let opt = document.createElement('option');
    opt.value = album.title;
    opt.innerText = album.title;
    track_dest.appendChild(opt);
});
track_dest.addEventListener('change',function(e){
	if(track_dest.selectedIndex === 1){
		track_album_title.parentElement.classList.remove('hidden');
	}else{
		track_album_title.parentElement.classList.add('hidden');
	}
});
let track_src = document.getElementById("track-src");
let track_title = document.getElementById("track-title");
let track_album_title = document.getElementById("track-album");
Track['div'] = track_div;
Track['arr'] = [track_type,track_dest,track_src,track_title,track_album_title];
Track['submit'] = async function(){
	let Player = imports[track_type.value];
	let track = {title:track_title.value,src:track_src.value,filetype:Player.name};
	if(Player.fetchTrack){
		let obj = await Player.fetchTrack(track);
		track = {...track,...obj};
	}
	if(!await Player.isValidTrack(track)) throw new Error(track);
	
	let album = metadata.find(function(a){
		return a.title === track_dest.value;
	});
	if(track_dest.selectedIndex === 1){
		album = new CustomAlbum({title:track_album_title.value});
		await jsonPost('../php/upload.php',album,null,'\t');
		metadata.push(album);
		metadata.sort(function(a,b){
			if(a.title < b.title) return -1;
			if(a.title > b.title) return 1;
			if(a.title === b.title) return 0;
		});
		let album_container = document.getElementById('album-container');
		while(album_container.firstChild) album_container.lastChild.remove();
		metadata.forEach(function(album){
			album_container.appendChild(album.toNode());
		});
	}
	if(!album) throw new Error("No album found with specified title");
	
	let obj = await jsonPost('../php/download.php',album);
	obj.tracks.push(track);
	await jsonPost('../php/upload.php',obj,null,'\t');
	
	track = new Player.Track(track);
	album.push(track);
}
async function jsonPost(url,obj,replacer,space){
	let result = await fetch(url,{
		method: 'POST',
		body: JSON.stringify(obj,replacer,space)
	});
	if(!result.ok) throw new Error(result);
	return await result.json();
}
async function asyncFilter(arr,f){
	let copy = Array.from(arr);
	let parr = arr.map(async function(item,i,arr){
		return f(item,i,arr);
	});
	return (await Promise.allSettled(parr)).reduce(function(arr,p,i){
		if(p.status !== "rejected" && p.value) arr.push(copy[i]);
		return arr;
	},[]);
}

export default Track;