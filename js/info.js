let modal = document.getElementById('info-container');
let info_btn = document.getElementById('info');

//################ Modal EventListeners ################
info_btn.addEventListener('click',function(){
	modal.classList.remove('hidden');
});
window.addEventListener('click',function(event){
	if(event.target === modal){
		modal.classList.add('hidden');
	}
});

console.log("Info is ready");