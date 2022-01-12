import _SC from '../../../MetaMusic/src/plugins/SC/soundcloud.js';
export default class SC{
	static Track = _SC.Track;
	static async isValidTrack(track){
		let tmp = new _SC.Track(track);
		if(!_SC.isValidTrack(tmp)) return false;
		let player = new _SC();
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
		let sc = new _SC();
		let tmp = new _SC.Track({title:"SC",src:track.src});
		let obj = {};
		try{
			await sc.waitForEvent('ready');
			await sc.load(tmp);
			let sound = await new Promise(function(res,rej){
				sc._player.getCurrentSound(res);
			});
			obj.src = sound.permalink_url;
			obj.title = sound.title;
			obj.artwork_url = sound.artwork_url || sound.user.avatar_url;
			obj.duration = sound.full_duration/1000;
			obj.artist = sound.user.username;
			obj.filetype = "SC";
		}finally{
			await sc.destroy();
		}
		return obj;
    }
	static async fetchAlbum(album){
		let sc = new _SC();
		let track = new _SC.Track({title:"SC",src:album.src});
		let obj = {};
		try{
			await sc.waitForEvent('ready');
			await sc.load(track);
			let recursion = function(arr){
				if(arr.every(function(sound){return sound['permalink_url'] !== undefined})) return this(arr);
				setTimeout(function(){
					sc._player.getSounds(recursion.bind(this));
				}.bind(this),500);
			}
			let arr = await new Promise(function(res,rej){
				sc._player.getSounds(recursion.bind(res));
			});
			obj.src = album.src;
			obj.tracks = arr.map(function(sound){
				let t = {};
				t.src = sound.permalink_url;
				t.title = sound.title;
				t.artwork_url = sound.artwork_url || sound.user.avatar_url;
				t.duration = sound.full_duration/1000;
				t.artist = sound.user.username;
				t.filetype = "SC";
				return t;
			});
		}finally{
			await sc.destroy();
		}
		return obj;
    }
}
