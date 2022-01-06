import mm from './main.js';

let upload_btn = document.getElementById("upload");
upload_btn.addEventListener('click',function(){
	window.alert("Upload is not supported at this time");
});

console.log("Upload is ready");

/*
upload_btn.addEventListener('click',function(){
	let url = window.prompt("Please enter the url:");
	try{
		let tmp = new URL(url);
		//we need to determine if it is a track for album
		//let p = [Album._validURL(url),Album._validAlbumURL(url)].filter(Boolean);
		let isTrack = Album._validURL(url);
		let isAlbum = Album._validAlbumURL(url);
		if(isTrack && isAlbum){
			if(window.confirm('Is this url for a track?')){
				isAlbum = false;
			}else if(window.confirm('Is this url for an album?')){
				isTrack = false;
			}else{
				throw new Error("Cancelled");
			}
		}
		if(isTrack){
			return Album.fetchTrack(url)
			.then(function(o){
				if(!current_album || mm.equals(current_album)) return new Promise(function(res,rej){
					window.alert("Click on any album to add the track");
					waitForOpen = res
				}).then(function(){return o});
				return o;
			})
			.then(function(o){
				let album = albums.find(function(a){
					return a.equals(current_album);
				});
				let obj = album.toJSON();
				obj.tracks.push(o);
				return Album.uploadAlbum(obj)
				.then(function(obj){
					let pred = album.equals(current_album);
					album.push(o);
					if(pred){
						Album.onClose(current_album);
						current_album = album;
						Album.onOpen(current_album);
					}
					return obj;
				});
			}).then(function(o){
				console.log("Uploaded:",o);
				window.alert("Upload Completed!");
			});
		}
		if(isAlbum){
			return Album.fetchAlbum(url)
			.then(function(o){
				return Album.uploadAlbum(o)
				.then(function(obj){
					let album = new Album(obj);
					
					let index = albums.findIndex(function(a){
						return a.title === obj.title && a.src === obj.src;
					});
					if(index === -1){
						albums.push(album);
					}else{
						console.log(albums[index],current_album);
						let pred = albums[index].equals(current_album);
						albums[index] = album;
						if(pred){
							Album.onClose(current_album);
							current_album = album;
							Album.onOpen(current_album);
						}
					}
					updateAlbums();					
					return obj;
				});
			}).then(function(o){
				console.log("Uploaded:",o);
				window.alert("Upload Completed!");
			});
		}
		throw new Error("Invalid url");
	}catch(e){
		console.error(e);
		window.alert("Upload Failed!");
	}
});*/