import A from './custom-album.js';
export default class MetaAlbum extends A{
	toHeader(){
		let container = createNode("div",{title:"Next up:"},['track','album-header']);
			let icon_container = createNode("div",{},['track-img-container']);
				let track_img = createNode("img",{src:"./images/back.png"},['track-img']);
			icon_container.appendChild(track_img);
			icon_container.addEventListener('click',this.parent('onClose'));
			
			let text_container = createNode('div',{},['track-text-container']);
				let track_title = createNode('div',{innerText:"Next up:"},['queue-title']);
			text_container.appendChild(track_title);
			
			let options_container = createNode("div",{},['track-img-container']);
				let options_img = createNode("img",{src:"./images/options.png"},['track-img']);
			options_container.appendChild(options_img);
			options_container.addEventListener('click',function(){
				hidden_container.classList.toggle('hidden');
				options_img.src = hidden_container.classList.contains('hidden')? "./images/options.png": "./images/close.png";
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
				
				let edit_container = createNode("div",{},['track-img-container']);
					let edit_img = createNode("img",{src:"./images/edit.png"},['track-img']);
				edit_container.addEventListener('click',this.parent('onEdit'));
				edit_container.addEventListener('click',options_container.click.bind(options_container));
				edit_container.appendChild(edit_img);
			hidden_container.appendChild(delete_container);
			hidden_container.appendChild(edit_container);
			hidden_container.appendChild(append_container);
			hidden_container.appendChild(insert_container);
			
			let bg_container = createNode("div",{},['bg-img-container']);
				let bg_img = createNode("div",{},['bg-img']);
				bg_img.style.background = '#303030';
			bg_container.appendChild(bg_img);
			
		container.appendChild(icon_container);
		container.appendChild(text_container);
		container.appendChild(hidden_container);
		container.appendChild(options_container);
		container.appendChild(bg_container);
		return container;
	}
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
