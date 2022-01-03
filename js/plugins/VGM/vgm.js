import HTML from '../../../MetaMusic/src/plugins/HTML/html.js';
export default class VGM extends HTML{
    static Track = class Track extends HTML.Track{
	constructor(obj){
	    super(obj);
	    this.filetype = "VGM";
	}
	static fromJSON(json){
	    return new VGM.Track(JSON.parse(json));
	}
    }
    static fetchAlbum(url){
	let tmp = new URL(url);
	if(tmp.hostname != "downloads.khinsider.com") throw new Error("Invalid URL!");
	return fetch('./js/plugins/VGM/fetch-album.php',{
	    method: 'POST',
	    body: JSON.stringify({url:url}),
	}).then(function(r){
	    if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
	    return r.json();
	}).then(function(o){
	    o.tracks.forEach(function(url,i,arr){
		arr[i] = VGM.fetchTrack("https://downloads.khinsider.com"+url)
		/*.then(function(o){
		    console.log(o);
		});*/
	    })
	    return Promise.all(o.tracks).then(function(arr){
		arr.forEach(function(p,i,arr){
		    o.tracks[i] = p;
		})
		return Promise.resolve(o);
	    });
	});
    }
    static fetchTrack(url){
	let tmp = new URL(url);
	if(tmp.hostname != "downloads.khinsider.com") throw new Error("Invalid URL!");
	return fetch('./js/plugins/VGM/fetch-track.php',{
	    method: 'POST',
	    body: JSON.stringify({url:url}),
	}).then(function(r){
	    if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
	    return r.json();
	})
    }
    //TODO allow downloads.khinsider.com
    static _validURL(url){
	if(!HTML._validURL(url)) return false;
	let tmp = new URL(url);
	if(tmp.hostname == "vgmsite.com") return true;
	return false;
    }
    static _validAlbumURL(url){
	if(HTML._validURL(url)) return false;
	let tmp = new URL(url);
	if(tmp.hostname == "downloads.khinsider.com" && tmp.pathname.includes('/game-soundtracks/album/')) return true;
	return false;
    }
    //https://downloads.khinsider.com/game-soundtracks/album/nausicaa-of-the-valley-of-the-wind-original-soundtrack
}
