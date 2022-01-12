import _BC from '../../../MetaMusic/src/plugins/BC/bandcamp.js';
export default class BC{
	static Track = _BC.Track;
	static async isValidTrack(track){
		let tmp = new _BC.Track(track);
		if(!_BC.isValidTrack(tmp)) return false;
		let player = new _BC();
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
		let response = await fetch('./js/upload/BC/fetch-track.php',{
			method: 'POST',
			body: JSON.stringify(track)
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		return await response.json();
    }
	static async fetchAlbum(album){
		let response = await fetch('./js/upload/BC/fetch-album.php',{
			method: 'POST',
			body: JSON.stringify(album)
		});
		if(!response.ok) throw new Error("Fetch Failed!");
		return await response.json();
    }
}
