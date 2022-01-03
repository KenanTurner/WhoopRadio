import _HTML from '../../../MetaMusic/src/plugins/HTML/html.js';
export default class HTML extends _HTML{
    static _validAlbumURL(url){
	return false;
    }
    static fetchTrack(url){
	let obj = {};
	obj.src = url;
	obj.title = window.prompt("Please enter the track title:",url.split("/").pop());
	obj.filetype = "HTML";
	return Promise.resolve(obj);
    }
}
