import _SC from '../../../MetaMusic/src/plugins/SC/soundcloud.js';
export default class SC extends _SC{
	static fetchAlbum(url){
		window.sc = new SC();
		let track = new SC.Track({title:"SC",src:url})
		return sc.waitForEvent('ready')
		.then(sc.chain('load',track))
		.then(function(){
			//Soundcloud is so awful
			let recursion = function(arr){
				//console.log("One more time");
				let done = arr.every(function(sound){return sound['permalink_url'] !== undefined})
				if(done) return this(arr);
				setTimeout(function(){
					sc._player.getSounds(recursion.bind(this));
				}.bind(this),500);
			}
			return new Promise(function(res,rej){
				sc._player.getSounds(recursion.bind(res));
			});
		})
		.then(function(arr){
			let a = {};
			a.title = window.prompt("Please enter the album title:",url.split("/").pop()); //maybe prompt user?
			a.tracks = [];
			a.src = url;
			arr.forEach(function(obj){
				let t = {};
				t.src = obj.permalink_url;
				t.title = obj.title;
				t.artwork_url = obj.artwork_url || obj.user.avatar_url;
				t.duration = obj.full_duration/1000;
				t.artist = obj.user.username;
				t.filetype = "SC";
				a.tracks.push(t);
			});
			return a;
		})
		.finally(sc.chain('destroy'));
		//Don't forget to remove the iframe
    }
    static _validAlbumURL(url){
		if(!_SC._validURL(url)) return false;
		let tmp = new URL(url);
		if(tmp.pathname.includes('/sets/')) return true;
		return false;
    }
    static fetchTrack(url){
		window.sc = new SC();
		let track = new SC.Track({title:"SC",src:url})
		return sc.waitForEvent('ready')
		.then(sc.chain('load',track))
		.then(function(){
			return new Promise(function(res,rej){
				sc._player.getCurrentSound(res);
			});
		})
		.then(function(obj){
			let track = {};
			track.src = obj.permalink_url;
			track.title = obj.title;
			track.artwork_url = obj.artwork_url || obj.user.avatar_url;
			track.duration = obj.full_duration/1000;
			track.artist = obj.user.username;
			track.filetype = "SC";
			return track;
		})
		.finally(sc.chain('destroy'));
		//Don't forget to remove the iframe
    }
}
