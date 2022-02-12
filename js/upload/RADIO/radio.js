import _RADIO from '../../../MetaMusic/src/plugins/RADIO/radio.js';
export default class RADIO{
	static Track = _RADIO.Track;
	static async isValidTrack(track){
		let tmp = new _RADIO.Track(track);
		if(!_RADIO.isValidTrack(tmp)) return false;
		let radio = new _RADIO();
		try{
			await radio.waitForEvent('ready');
			await radio.load(tmp);
			return true;
		}catch(e){}finally{
			await radio.destroy();
		}
		return false;
    }
}
