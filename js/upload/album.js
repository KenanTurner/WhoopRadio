import YT from './YT/youtube.js';
import BC from './BC/bandcamp.js';
import SC from './SC/soundcloud.js';
import VGM from './VGM/vgm.js';
import CustomAlbum from '../custom-album.js';
import metadata from '../metadata.js';
import mm from '../main.js';
let imports = {"Youtube":YT,"Bandcamp":BC,"Soundcloud":SC,"VGM link":VGM};

let Album = {};
let album_div = document.getElementById("upload-album");
let album_type = document.getElementById("album-type");
for(let key in imports){
	let opt = document.createElement('option');
    opt.value = key;
    opt.innerText = key;
    album_type.appendChild(opt);
}
let album_dest = document.getElementById("album-dest");
metadata.forEach(function(album){
	let opt = document.createElement('option');
    opt.value = album.title;
    opt.innerText = album.title;
    album_dest.appendChild(opt);
});
album_dest.addEventListener('change',function(e){
	if(album_dest.selectedIndex === 1){
		album_title.parentElement.classList.remove('hidden');
	}else{
		album_title.parentElement.classList.add('hidden');
	}
});
let album_src = document.getElementById("album-src");
let album_title = document.getElementById("album-title");
Album['div'] = album_div;
Album['arr'] = [album_type,album_dest,album_src,album_title];
Album['submit'] = async function(){
	let Player = imports[album_type.value];
	let album = {src:album_src.value};
	let obj = await Player.fetchAlbum(album);
	album = {...album,...obj,title:album_title.value};
	
	if(album_dest.selectedIndex === 1){ //New album
		await jsonPost('../php/upload.php',album,null,'\t');
		album = new CustomAlbum(album);
		metadata.push(album);
	}else{
		let tmp = metadata.find(function(a){
			return a.title === album_dest.value;
		});
		let obj = await jsonPost('../php/download.php',tmp);
		obj.tracks.push(...album.tracks);
		await jsonPost('../php/upload.php',obj,null,'\t');
		album = new CustomAlbum(album);
		tmp.push(album);
	}
}
CustomAlbum.onDelete = async function(album){
	if(album === mm.queue){
		mm.enqueue(mm.queue.clear.bind(mm.queue));
		mm.enqueue('stop');
		return;
	}
	if(!window.confirm("Delete "+album.title+"?")) return;
	CustomAlbum.onClose(album);
	let index = metadata.findIndex(function(a){
		return a.equals(album);
	});
	if(index < 0) throw new Error("Unable to find Album!",album);
	metadata.splice(index,1);
	await jsonPost('../php/delete.php',album);
}
async function jsonPost(url,obj,replacer,space){
	let result = await fetch(url,{
		method: 'POST',
		body: JSON.stringify(obj,replacer,space)
	});
	if(!result.ok) throw new Error(result);
	return await result.json();
}

export default Album;