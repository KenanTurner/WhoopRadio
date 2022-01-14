import T from '../MetaMusic/src/track.js';
export default class Track extends T{
	constructor(obj){
		super(obj);
		//TODO add cool things like artwork_url
		this.nodes = [];
	}
	clone(){
		let track = super.clone();
		track.nodes = this.nodes;
		return track;
	}
	remove(){
		this.nodes.forEach(function(node){
			node.remove();
		});
		this.nodes.length = 0;
	}
	static fromJSON(json){ //deserialization
		let obj = {...super.fromJSON(json),...JSON.parse(json)}; //merge the two objects
		return new Track(obj);
	}
	css(f='toggle',css_class){
		this.nodes.forEach(function(e){
			e.classList[f](css_class);
		});
	}
	parent(f){
		return function(e){
			this.constructor[f](this);
		}.bind(this)
	}
	toNode(){
		let container = createNode("div",{title:this.title},['track']);
			let icon_container = createNode("div",{},['track-img-container']);
				let track_img = createNode("img",{src:"./images/default.png"},['track-img']);
				track_img.addEventListener('error',function(){ this.src='./images/error.png'; });
			icon_container.appendChild(track_img);
			icon_container.addEventListener('click',this.parent('onLoad'));
			
			let text_container = createNode('div',{},['track-text-container']);
				let track_title = createNode('div',{innerText:this.title},['track-title']);
				let track_subtitle = createNode('div',{innerText:this.src},['track-subtitle']);
			text_container.appendChild(track_title);
			text_container.appendChild(track_subtitle);
			text_container.addEventListener('click',this.parent('onLoad'));
			
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
			
		container.appendChild(icon_container);
		container.appendChild(text_container);
		container.appendChild(hidden_container);
		container.appendChild(options_container);
		
		if(this.nodes.length > 0) container.classList = this.nodes[0].classList;
		this.nodes.push(container);
		return container;
	}
	//to be overloaded later
	static onLoad(){}
	static onDelete(){}
	static onAppend(){}
	static onInsert(){}
	static onEdit(){}
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
