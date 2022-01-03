import A from './custom-album.js';
export default class MetaAlbum extends A{
	toAlbumHeader(){
		let div = super.toAlbumHeader();
		div.childNodes[2].remove();
		div.childNodes[1].childNodes[0].remove();
		div.childNodes[1].childNodes[0].remove();
		
		let title_div = document.createElement('div');
		title_div.classList.add('queue-title');
		div.title = "Next up:";
		title_div.innerText = "Next up:";
		
		div.childNodes[1].appendChild(title_div);
		//custom background img?
		return div;
	}
}
