import _YT from '../../../MetaMusic/src/plugins/YT/youtube.js';
export default class YT{
	static Track = _YT.Track;
	static async isValidTrack(track){
		let tmp = new _YT.Track(track);
		if(!_YT.isValidTrack(tmp)) return false;
		let player = new _YT();
		try{
			await player.waitForEvent('ready');
			await player.load(tmp);
			return true;
		}catch(e){}finally{
			await player.destroy();
		}
		return false;
    }
	static async fetchTrack(track){
		let response = await fetch('./js/upload/YT/fetch-track.php',{
			method: 'POST',
			body: JSON.stringify({...track,id:_YT.getYoutubeId(track.src)})
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		return await response.json();
    }
	static async fetchAlbum(album){
		let response = await fetch('./js/upload/YT/fetch-album.php',{
			method: 'POST',
			body: JSON.stringify({...album,id:YT.getPlaylistId(album.src)})
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		return await response.json();
    }
    static getPlaylistId(url){
		let tmp = new URL(url);
		if(tmp.hostname !== "www.youtube.com" && tmp.hostname !== "youtu.be" && tmp.hostname !== "youtube.com") throw new Error("Invalid url");
		let id = tmp.searchParams.get('list');
		if(!id) throw new Error("Invalid url");
		return id;
	}
}

