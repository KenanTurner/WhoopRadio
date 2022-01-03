import A from '../MetaMusic/src/album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.artwork_url = obj.artwork_url;
		this.src = obj.src;
		this.elements = [];
	}
	clone(){
		let tmp = this.constructor.fromJSON(JSON.stringify(this));
		tmp.element = this.element;
		return tmp;
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
		obj.artwork_url = this.artwork_url;
		obj.src = this.src;
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
		//this.element = album_div;
		return album_div;
	}
	toAlbumHeader(){
		let track_div = document.createElement('div');
		track_div.classList.add('track');
		track_div.classList.add('album-header');
		track_div.title = this.title;
			let track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				let track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = "./images/back-white-drop.png";
				track_img.addEventListener('click',function(e){
					this.constructor.onBack(this);
				}.bind(this));
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
			let play_img_div = document.createElement('div');
			play_img_div.classList.add('track-img-container');
				let play_img = document.createElement('img');
				play_img.classList.add('track-img');
				play_img.src = "./images/play-white.png";
				play_img.addEventListener('click',function(e){
					this.constructor.onLoad(this);
				}.bind(this));
				play_img_div.appendChild(play_img);
			track_div.appendChild(play_img_div);
			let bg_img_div = document.createElement('div');
			bg_img_div.classList.add('bg-img-container');
				let bg_img = document.createElement('div');
				bg_img.classList.add('bg-img');
				bg_img.style.backgroundImage = 'url(' + this.artwork_url + ')';
				if(!this.artwork_url) bg_img.style.background = '#303030';
				bg_img_div.appendChild(bg_img);
			track_div.appendChild(bg_img_div);
		//this.elements.push(track_div);
		return track_div;
	}
	toTrackContainer(){
		let track_div = document.createElement('div');
		track_div.classList.add('track-container');
		track_div.id = this.title;
		track_div.appendChild(this.toAlbumHeader());
		this.tracks.forEach(function(t){
			track_div.appendChild(t.toHTML());
		});
		this.elements.push(track_div);
		return track_div;
	}
	static onClick(){}
	static onBack(){}
	
	//Called to show or hide tracks
	static onOpen(){}
	static onClose(){}
	
	//Called to populate the queue
	static onLoad(){}
	
	//handle upload stuff
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
		let player = Album._validAlbumURL(url);
		if(!player) throw new Error("Invalid URL");
		return player.fetchAlbum(url);
	}
	static _validAlbumURL(url){
		let arr = Object.values(Album.players).filter(function(p){return p._validAlbumURL(url)});
		if(arr.length == 0) return false;
		if(arr.length > 1) return false;
		return arr[0];
	}
	static fetchTrack(url){
		let player = Album._validURL(url);
		if(!player) throw new Error("Invalid URL");
		return player.fetchTrack(url);
	}
	static _validURL(url){
		let arr = Object.values(Album.players).filter(function(p){return p._validURL(url)});
		if(arr.length == 0) return false;
		if(arr.length > 1) return false;
		return arr[0];
	}
}
