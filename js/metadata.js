import Album from './custom-album.js';
let metadata = (await (await fetch("../php/metadata.php")).json()).reduce(function(arr,obj){
	try{
		arr.push(new Album(obj));
	}catch(e){
		console.error("Failed to initialize album: ",obj);
	}
	return arr;
},[]).filter(function(album){
	return album.tracks.length > 0;
}).sort(function(a,b){
	if(a.title < b.title) return -1;
	if(a.title > b.title) return 1;
	if(a.title === b.title) return 0;
});
window.metadata = metadata;
export default metadata;