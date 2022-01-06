import T from '../MetaMusic/src/track.js';
export default class Track extends T{
	constructor(obj){
		super(obj);
		//TODO add cool things like artwork_url
		this.elements = [];
	}
	clone(){
		let track = super.clone();
		track.elements = this.elements;
		return track;
	}
	static fromJSON(json){ //deserialization
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Track(obj);
	}
	css(f='toggle',css_class){
		this.elements.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	parent(f){
		return function(e){
			this.constructor[f](this);
		}.bind(this)
	}
	toNode(){
		let track_div = document.createElement('div');
		track_div.classList.add('track');
		track_div.title = this.title;
			let track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				let track_img = document.createElement('img');
				track_img.classList.add('track-img');
				//track_img.src = this.artwork_url || "./images/default-white.png";
				track_img.src = "./images/default-white.png";
				track_img.addEventListener('error',function(){
					this.src='./images/error.png';
				});
				track_img_div.appendChild(track_img);
				track_img_div.addEventListener('click',this.parent('onLoad'));
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
				track_text_div.addEventListener('click',this.parent('onLoad'));
			track_div.appendChild(track_text_div);
			track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = "./images/options-white.png";
				track_img_div.addEventListener('click',this.parent('onOptions'));
				track_img_div.appendChild(track_img);
			track_div.appendChild(track_img_div);
		if(this.elements.length > 0) track_div.classList = this.elements[0].classList;
		this.elements.push(track_div);
		return track_div;
	}
	toOptions(){
		let track_div = [];
			let track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				let track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = "./images/append-white.png";
			track_img_div.appendChild(track_img);
			track_img_div.addEventListener('click',function(e){
				this.constructor.onAppend(this);
				this.constructor.onClose(this);
			}.bind(this));
		track_div.push(track_img_div);
			track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = "./images/play-next-white.png";
			track_img_div.appendChild(track_img);
			track_img_div.addEventListener('click',function(e){
				this.constructor.onInsert(this);
				this.constructor.onClose(this);
			}.bind(this));
		track_div.push(track_img_div);
			track_img_div = document.createElement('div');
			track_img_div.classList.add('track-img-container');
				track_img = document.createElement('img');
				track_img.classList.add('track-img');
				track_img.src = "./images/close-white.png";
			track_img_div.appendChild(track_img);
			track_img_div.addEventListener('click',function(e){
				this.constructor.onClose(this);
			}.bind(this));
		track_div.push(track_img_div);
		return track_div;
	}
	//to be overloaded later
	static onLoad(){}
	static onOptions(){}
	/*static onClick(){}
	static onLoad(){}
	static onUnload(){}
	static onOpen(){}
	static onClose(){}
	static onAppend(){}
	static onInsert(){}*/
}
