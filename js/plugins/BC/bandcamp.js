import _BC from '../../../MetaMusic/src/plugins/BC/bandcamp.js';
export default class BC extends _BC{
    static fetchAlbum(url){
	return fetch('./js/plugins/BC/fetch-album.php',{
	    method: 'POST',
	    body: JSON.stringify({url:url}),
	}).then(function(r){
	    if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
	    return r.json()
	})
    }
    static _validAlbumURL(url){
	if(!_BC._validURL(url)) return false;
	let tmp = new URL(url);
	if(tmp.pathname.includes('/album/')) return true;
	return false;
    }
}
