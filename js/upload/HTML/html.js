import _HTML from '../../../MetaMusic/src/plugins/HTML/html.js';
export default class HTML{
	static Track = _HTML.Track;
	static async isValidTrack(track){
		let tmp = new _HTML.Track(track);
		if(!_HTML.isValidTrack(tmp)) return false;
		let html = new _HTML();
		try{
			await html.waitForEvent('ready');
			await html.load(tmp);
			return true;
		}catch(e){}finally{
			await html.destroy();
		}
		return false;
    }
}
