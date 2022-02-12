import _HTML from '../HTML/html.js';
import AsyncQueue from '../../async-queue.js';
export default class VGM extends _HTML{
	static MAX_CONCURRENT_REQUESTS = 6;
	static async fetchTrack(track){
		let response = await fetch('./js/upload/VGM/fetch-track.php',{
			method: 'POST',
			body: JSON.stringify(track)
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		return await response.json();
    }
	static async fetchAlbum(album){
		let response = await fetch('./js/upload/VGM/fetch-album.php',{
			method: 'POST',
			body: JSON.stringify(album)
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		let obj = await response.json();
		let queue = new AsyncQueue(VGM.MAX_CONCURRENT_REQUESTS);
		let parr = obj.tracks.map(function(track){
			return queue.enqueue(VGM.fetchTrack,track);
		});
		obj.tracks = (await Promise.allSettled(parr)).reduce(function(arr,p,i){
			if(p.status !== "rejected" && p.value) arr.push(p.value);
			return arr;
		},[]);
		return obj;
    }
}