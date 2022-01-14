/*import Track from './upload/track.js';
import Album from './upload/album.js';
import JSON from './upload/json.js';*/
import CustomTrack from './custom-track.js';

let edit_container = document.getElementById("edit-container");
let track_container = document.getElementById("edit-track");
let reset_btn = document.getElementById("edit-reset");
let submit_btn = document.getElementById("edit-submit");


//################ Upload EventListeners ################
/*Object.values(edit).forEach(function({arr}){
	arr.forEach(function(div){
		div.addEventListener('input',function(){
			submit_btn.disabled = !isValid(arr);
		});
	});
});*/


//################ Modal EventListeners ################
window.addEventListener('click',function(event){
	if(event.target === edit_container){
		edit_container.classList.add('hidden');
	}
});


//################ Check for invalid fields ################
function isValid(arr){
	return arr.every(function(div){
		//Ignore hidden fields
		if(div.parentElement.classList.contains("hidden")) return true;
		switch(div.tagName){
			case "SELECT":
			case "INPUT":
				return div.value !== "";
			default:
				return true;
				break;
		}
		return true;
	});
}


//################ Reset all fields ################
function reset(arr){
	arr.forEach(function(div){
		switch(div.tagName){
			case "SELECT":
			case "INPUT":
			default:
				div.value = "";
				break;
		}
		div.dispatchEvent(new Event('input'));
		div.dispatchEvent(new Event('change'));
	});
}
reset_btn.addEventListener('click',function(){
	Object.values(edit).forEach(function({arr}){
		reset(arr);
	});
});


//################ Submit and Upload ################
submit_btn.addEventListener('click',async function(){
	if(!isValid(upload[upload_type.value]['arr'])){
		return window.alert("Please fill out all fields");
	}
	upload_div.classList.add('hidden');
	try{
		//await upload[upload_type.value]['submit'](...upload[upload_type.value]['args']);
		await upload[upload_type.value]['submit']();
		window.alert("Upload Completed!");
	}catch(e){
		console.error(e);
		window.alert("Upload Failed!");
	}finally{
		reset_btn.click();
	}
});


CustomTrack.onEdit = function(track){
	for(let key in track){
		switch(key){
			case "title":
			case "src":
				console.log("text");
				break;
			case "filetype":
				console.log("select");
				break;
			default:
				break;
		}
	}
	edit_container.classList.remove('hidden');
	track_container.classList.remove('hidden');
	//track_container.classList.remove('hidden');
}

console.log("Edit is ready");

/*//################ Handle track editing ################
let edit_container = document.getElementById('edit-container');
window.addEventListener('click',function(event){
	if(event.target === edit_container){
		edit_container.classList.add('hidden');
	}
});
*/