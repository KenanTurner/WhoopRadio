import CustomAlbum from '../custom-album.js';
import metadata from '../metadata.js';

let JSON = {};
let json_div = document.getElementById("upload-json");
let json_input = document.getElementById("upload-file");
JSON['div'] = json_div;
JSON['arr'] = [json_input];
JSON['submit'] = async function(){
	let files = json_input.files;
	let errors = [];
	for (let i = 0; i < files.length; i++){
		const file = files[i];
		try{
			let text = await file.text();
			let obj = window.JSON.parse(text);
			let tmp = new CustomAlbum(obj);
			await jsonPost('../php/upload.php',obj,null,'\t');
			let album = metadata.find(function(a){
				return a.title === tmp.title;
			});
			if(album){
				album.clear();
				album.push(tmp);
			}else{
				metadata.push(tmp);
				metadata.sort(function(a,b){
					if(a.title < b.title) return -1;
					if(a.title > b.title) return 1;
					if(a.title === b.title) return 0;
				});
				let album_container = document.getElementById('album-container');
				while(album_container.firstChild) album_container.lastChild.remove();
				metadata.forEach(function(album){
					album_container.appendChild(album.toNode());
				});
			}
		}catch(e){
			console.error(e);
			errors.push(e);
		}
	}
	if(errors.length > 0) throw new Error("JSON upload failed!");
}
async function jsonPost(url,obj,replacer,space){
	let result = await fetch(url,{
		method: 'POST',
		body: window.JSON.stringify(obj,replacer,space)
	});
	if(!result.ok) throw new Error(result);
	return await result.json();
}

export default JSON;