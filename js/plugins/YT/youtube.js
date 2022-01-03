import _YT from '../../../MetaMusic/src/plugins/YT/youtube.js';
export default class YT extends _YT{
	static fetchAlbum(url){
		return fetch('./js/plugins/YT/fetch-album.php',{
			method: 'POST',
			body: JSON.stringify({id:YT.getPlaylistId(url),url:url}),
		}).then(function(r){
			if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
			return r.json()
		}).then(function(o){
			o.title = window.prompt("Please enter the album title:");
			return o;
		})
    }
    static getPlaylistId(url){
		try{
			let tmp = new URL(url);
			if(tmp.hostname == "www.youtube.com" || tmp.hostname == "youtu.be" || tmp.hostname == "youtube.com"){
				let id = tmp.searchParams.get('list');
				if(!id) throw new Error("Invalid url");
				return id;
			}
			throw new Error("Invalid url");
		}catch(e){
			throw e;
		}
	}
	static _validAlbumURL(url){
		try{
			let id = YT.getPlaylistId(url);
			return true;
		}catch(e){
			return false;
		}
    }
    static fetchTrack(url){
		return fetch('./js/plugins/YT/fetch-track.php',{
			method: 'POST',
			body: JSON.stringify({id:YT.getYoutubeId(url),url:url}),
		}).then(function(r){
			if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
			return r.json()
		});
    }
}

