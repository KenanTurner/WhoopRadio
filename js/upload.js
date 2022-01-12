import Track from './upload/track.js';
import Album from './upload/album.js';
import JSON from './upload/json.js';
let upload = {Track,Album,JSON};

let upload_btn = document.getElementById("upload");
let upload_div = document.getElementById("upload-container");
let upload_type = document.getElementById("upload-type");
let reset_btn = document.getElementById("reset");
let submit_btn = document.getElementById("submit");


//################ Upload EventListeners ################
Object.values(upload).forEach(function({arr}){
	arr.forEach(function(div){
		div.addEventListener('input',function(){
			submit_btn.disabled = !isValid(arr);
		});
	});
});


//################ Modal EventListeners ################
upload_btn.addEventListener('click',function(){
	upload_div.classList.remove('hidden');
});
window.addEventListener('click',function(event){
	if(event.target === upload_div){
		upload_div.classList.add('hidden');
	}
});


//################ Upload Type Changed ################
upload_type.addEventListener('change',function(e){
	reset_btn.disabled = true;
	Object.values(upload).forEach(function({div}){
		div.classList.add('hidden');
	});
	if(!upload[upload_type.value]) return; //if unselected
	reset_btn.disabled = false;
	upload[upload_type.value]['div'].classList.remove('hidden');
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
	if(!upload[upload_type.value]) return;
	Object.values(upload).forEach(function({arr}){
		reset(arr);
	});
	upload_type.value = "";
	let evt = new Event('change');
	upload_type.dispatchEvent(evt);
});


//################ Submit and Upload ################
submit_btn.addEventListener('click',async function(){
	if(!upload[upload_type.value]) return;
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

console.log("Upload is ready");