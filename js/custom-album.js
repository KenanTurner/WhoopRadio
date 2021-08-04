import A from '../MetaMusic/src/album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.artwork_url = obj.artwork_url;
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
		obj.artwork_url = this.artwork_url;
		return obj;
	}
	static fromJSON(json){ //deserialization
		let obj = {...JSON.parse(json),...super.fromJSON(json)}; //merge the two objects
		return new Album(obj);
	}
	toHTML(){
		let album_div = document.createElement('div');
		album_div.classList.add('album');
		album_div.title = this.title;
			let album_img_div = document.createElement('div');
			album_img_div.classList.add('album-img-container');
				let album_img = document.createElement('img');
				album_img.classList.add('album-img');
				album_img.src = this.artwork_url || "./images/default-white.png";
				album_img_div.appendChild(album_img);
			album_div.appendChild(album_img_div);
			let album_text_div = document.createElement('div');
			album_text_div.classList.add('album-text-container');
				let album_title = document.createElement('div');
				album_title.classList.add('album-title');
				album_title.innerText = this.title;
				album_text_div.appendChild(album_title);
			album_div.appendChild(album_text_div);
		album_div.addEventListener('click',function(e){
			this.constructor.onClick(this);
		}.bind(this));
		return album_div;
	}
	toAlbumHeader(){
		let track_div = document.createElement('div');
		track_div.classList.add('track');
		track_div.classList.add('album-header');
		track_div.title = this.title;
			let bg_img_div = document.createElement('div');
			bg_img_div.classList.add('bg-img-container');
				let bg_img = document.createElement('div');
				bg_img.classList.add('bg-img');
				bg_img.style.backgroundImage = 'url('+ this.artwork_url || "./images/default-white.png" +');';
				bg_img_div.appendChild(bg_img);
			//track_div.appendChild(bg_img_div);
			let track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				let track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = this.artwork_url || "./images/default-white.png";
				track_img_div.appendChild(track_img);
			track_div.appendChild(track_img_div);
			let track_text_div = document.createElement('div');
			track_text_div.classList.add('track-text-container');
				let track_title = document.createElement('div');
				track_title.classList.add('track-title');
				track_title.innerText = this.title;
				track_text_div.appendChild(track_title);
				let track_subtitle = document.createElement('div');
				track_subtitle.classList.add('track-subtitle');
				track_subtitle.innerText = this.src;
				track_text_div.appendChild(track_subtitle);
			track_div.appendChild(track_text_div);
		track_div.addEventListener('click',function(e){
			this.constructor.onUnload(this);
		}.bind(this));
		//this.elements.push(track_div);
		return track_div;
	}
	//to be overloaded later
	static onClick(){}
	static onLoad(){}
	static onUnload(){}
	static uploadAlbum(o){
		let a = new Album(o);
		if(o.clone) a = o.clone();
		if(a.length == 0) throw new Error("Empty album!");
		//upload here
		return fetch('./php/set-album.php',{
			method: 'POST',
			body: JSON.stringify(o,null,'\t'),
		}).then(function(r){return r.json()})
	}
	static fetchAlbum(url){
		let arr = Object.values(Album.players).filter(function(p){return p._validAlbumURL(url)});
		if(arr.length == 0) throw new Error("Invalid URL");
		if(arr.length > 1) throw new Error("Ambiguous URL");
		let player = arr[0];
		return player.fetchAlbum(url);
	}
}
