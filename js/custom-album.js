import A from '../MetaMusic/src/album.js';
export default class Album extends A{
	constructor(obj){
		super(obj);
		this.artwork_url = obj.artwork_url;
		this.src = obj.src;
		this.icons = [];
		this.containers = [];
		let f = function(key){
			return function(){
				this[key].forEach(function(node){
					node.remove();
				});
				this[key].length = 0;
			}.bind(this);
		}.bind(this);
		this.icons.remove = f('icons');
		this.containers.remove = f('containers');
	}
	clone(){
		let tmp = this.constructor.fromJSON(JSON.stringify(this));
		tmp.icons = this.icons;
		tmp.containers = this.containers;
		return tmp;
	}
	toJSON(){ //serialization
		let obj = super.toJSON();
		obj.artwork_url = this.artwork_url;
		obj.src = this.src;
		return obj;
	}
	static fromJSON(json){ //deserialization
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Album(obj);
	}
	css(f='toggle',css_class){
		this.containers.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	parent(f){
		return function(e){
			this.constructor[f](this);
		}.bind(this)
	}
	toNode(){
		let container = createNode("div",{title:this.title},['album']);
			let icon_container = createNode("div",{},['album-img-container']);
				let icon_img = createNode("img",{src:this.artwork_url || "./images/default.png"},['album-img']);
				icon_img.addEventListener('error',function(){ this.src='./images/error.png'; });
			icon_container.appendChild(icon_img);
			let text_container = createNode("div",{},['album-text-container']);
				let icon_text = createNode("div",{innerText:this.title},['album-title']);
			text_container.appendChild(icon_text);
		container.appendChild(icon_container);
		container.appendChild(text_container);
		container.addEventListener('click',this.parent('onOpen'));
		this.icons.push(container);
		return container;
	}
	toHeader(){
		let container = createNode("div",{title:this.title},['track','album-header']);
			let icon_container = createNode("div",{},['track-img-container']);
				let track_img = createNode("img",{src:"./images/back.png"},['track-img']);
			icon_container.appendChild(track_img);
			icon_container.addEventListener('click',this.parent('onClose'));
			
			let text_container = createNode('div',{},['track-text-container']);
				let track_title = createNode('div',{innerText:this.title},['track-title']);
				let track_subtitle = createNode('div',{innerText:(this.src||"~ unspecified ~")},['track-subtitle']);
			text_container.appendChild(track_title);
			text_container.appendChild(track_subtitle);
			
			let options_container = createNode("div",{},['track-img-container']);
				let options_img = createNode("img",{src:"./images/options.png"},['track-img']);
			options_container.appendChild(options_img);
			options_container.addEventListener('click',function(){
				if(hidden_container.classList.contains('hidden')){
					options_img.src = "./images/close.png";
					hidden_container.classList.remove('hidden');
					setTimeout(window.addEventListener.bind(window),0,'click',function(e){
						hidden_container.classList.add('hidden');
						options_img.src = "./images/options.png";
					},{once:true});
				}
			});
			
			let hidden_container = createNode("div",{},['hidden','track-options']);
				let delete_container = createNode("div",{},['track-img-container']);
					let delete_img = createNode("img",{src:"./images/delete.png"},['track-img']);
				delete_container.addEventListener('click',this.parent('onDelete'));
				delete_container.addEventListener('click',options_container.click.bind(options_container));
				delete_container.appendChild(delete_img);
				
				let append_container = createNode("div",{},['track-img-container']);
					let append_img = createNode("img",{src:"./images/append.png"},['track-img']);
				append_container.addEventListener('click',this.parent('onAppend'));
				append_container.addEventListener('click',options_container.click.bind(options_container));
				append_container.appendChild(append_img);
				
				let insert_container = createNode("div",{},['track-img-container']);
					let insert_img = createNode("img",{src:"./images/insert.png"},['track-img']);
				insert_container.addEventListener('click',this.parent('onInsert'));
				insert_container.addEventListener('click',options_container.click.bind(options_container));
				insert_container.appendChild(insert_img);
				
				/*let edit_container = createNode("div",{},['track-img-container']);
					let edit_img = createNode("img",{src:"./images/edit.png"},['track-img']);
				edit_container.addEventListener('click',this.parent('onEdit'));
				edit_container.addEventListener('click',options_container.click.bind(options_container));
				edit_container.appendChild(edit_img);*/
			hidden_container.appendChild(delete_container);
			//hidden_container.appendChild(edit_container);
			hidden_container.appendChild(append_container);
			hidden_container.appendChild(insert_container);
			
			let load_container = createNode("div",{},['track-img-container']);
				let load_img = createNode("img",{src:"./images/load.png"},['track-img']);
			load_container.appendChild(load_img);
			load_container.addEventListener('click',this.parent('onLoad'));
			
			let bg_container = createNode("div",{},['bg-img-container']);
				let bg_img = createNode("div",{},['bg-img']);
				if(this.artwork_url){
					bg_img.style.backgroundImage = 'url("' + this.artwork_url + '")';
				}else{
					bg_img.style.background = '#303030';
				}
			bg_container.appendChild(bg_img);
			
		container.appendChild(icon_container);
		container.appendChild(text_container);
		container.appendChild(load_container);
		container.appendChild(hidden_container);
		container.appendChild(options_container);
		container.appendChild(bg_container);
		return container;
	}
	toTrackContainer(){
		let container = createNode("div",{id:this.title},["track-container"]);
		container.appendChild(this.toHeader());
		this.tracks.forEach(function(t){
			container.appendChild(t.toNode());
		});
		this.containers.push(container);
		return container;
	}
	update(){
		if(!this.containers) return;
		this.containers.forEach(function(div){
			while(div.childNodes.length > 1) div.removeChild(div.lastChild);
			this.tracks.forEach(function(t){
				div.appendChild(t.toNode());
			});
		}.bind(this));
	}
	push(...items){
		super.push(...items);
		this.update();
	}
	insert(index,...items){
		super.insert(index,...items);
		this.update();
	}
	remove(...items){
		super.remove(...items);
		this.update();
	}
	clear(){
		super.clear();
		this.update();
	}
	shuffle(){
		super.shuffle();
		this.update();
	}
	sort(key="track_num",reversed=false){
		super.sort(key,reversed);
		this.update();
	}
	static onOpen(){}
	static onClose(){}
	static onLoad(){}
}
function createNode(tag_name,options = {},class_list = [],child_nodes = []){
	let el = document.createElement(tag_name);
	for(let key in options){
		el[key] = options[key];
	}
	class_list.forEach(function(cl){
		el.classList.add(cl);
	});
	child_nodes.forEach(function(node){
		el.appendChild(node);
	});
	return el;
}
