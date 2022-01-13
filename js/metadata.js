import Album from './custom-album.js';
let arr = (await (await fetch("../php/metadata.php")).json()).reduce(function(arr,obj){
	try{
		arr.push(new Album(obj));
	}catch(e){
		console.error(e,obj);
	}
	return arr;
},[]).filter(function(album){
	return album.tracks.length > 0;
}).sort(function(a,b){
	if(a.title < b.title) return -1;
	if(a.title > b.title) return 1;
	if(a.title === b.title) return 0;
});
let metadata = new Proxy(arr,{
	set: function(target, property, value, receiver){
		let res = target[property] = value;
		//localStorage.setItem(name,JSON.stringify(target));
		target.sort(function(a,b){
			if(a.title < b.title) return -1;
			if(a.title > b.title) return 1;
			if(a.title === b.title) return 0;
		});
		let album_container = document.getElementById('album-container');
		while(album_container.firstChild) album_container.lastChild.remove();
		target.forEach(function(album){
			album_container.appendChild(album.toNode());
		});
		return res;
	}
});
window.metadata = metadata;

console.log("Metadata Loaded");
export default metadata;