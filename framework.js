class Album{
	constructor(title,track_list,description="",genre="",artwork_url="",sort_by="track_num",_upload_date=(new Date()).toJSON(),_user_id=getCookie("userId")){
		if(title === undefined || title=="" || track_list === undefined || !Array.isArray(track_list)) {
			throw new Error('Invalid Constructor');
		}
		this.title = title;
		this.track_list = [];
		for (const element of track_list) {
		  this.addTrack(element);
		}
		this.description = description;
		this.genre = genre;
		this.artwork_url = artwork_url;
		this.sort_by = sort_by;
		this._upload_date = _upload_date;
		this._user_id = _user_id;
		this.sort(this.sort_by);
	}
	toJSON(){
		return [this.title,JSON.parse(JSON.stringify(this.track_list)),this.description,this.genre,this.artwork_url,this.sort_by,this._upload_date,this._user_id];
	}
	toHTML(){
		let album = document.createElement("div");
		let att = document.createAttribute("class");
		att.value = "album";
		album.setAttributeNode(att);
		att = document.createAttribute("data-title");
		att.value = this.title;
		album.setAttributeNode(att);
			//sq-album
			let sq = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "sq-album";
			sq.setAttributeNode(att);
				//img
				let img = document.createElement("img");
				att = document.createAttribute("class");
				att.value = "sq-img";
				img.setAttributeNode(att);
				att = document.createAttribute("src");
				//TODO find parent album
				att.value = this.artwork_url;
				if(!this.artwork_url){
					att.value = "images/default-white.png";
				}
				img.setAttributeNode(att);
				att = document.createAttribute("onerror");
				att.value = "this.onerror=null;this.src='images/error.png';";
				img.setAttributeNode(att);
				sq.appendChild(img);
			album.appendChild(sq);
			//txt-box
			let txt_box = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "txt-box album-title";
			txt_box.setAttributeNode(att);
				//title
				let txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line";
				txt_line.setAttributeNode(att);
				txt_line.innerText = this.title;
				txt_box.appendChild(txt_line);
				txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line subtitle";
				txt_line.setAttributeNode(att);
				//txt_line.innerText = this.title;
				txt_box.appendChild(txt_line);
			album.appendChild(txt_box);
			//track-container
			let track_container = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "track-container";
			track_container.setAttributeNode(att);
				let self = this;
				this.track_list.forEach(function(track){
					track_container.appendChild(track.toHTML(self.title,self.artwork_url));
				});
			album.appendChild(track_container);
		return album;
	}
	static fromJson(json){
		var obj = JSON.parse(json);
		obj[1].forEach(function(entry, index, theArray){
			theArray[index] = Track.fromJson(JSON.stringify(entry))
		});
		return new Album(...obj);
	}
	sort(key="track_num",reversed=false){
		if(!this.track_list.length){return true};
		switch(typeof(this.track_list[0][key])){
			case "number":
				this.track_list.sort(function(a,b){
					let tmp = a[key]-b[key];
					if(tmp!=0){return tmp;}
					if (a["track_num"] < b["track_num"]) {
						return -1;
					}
					if (a["track_num"] > b["track_num"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "object": //TODO
				this.track_list.sort(function(a,b){
					var nameA = new Date(a[key]);
					var nameB = new Date(b[key]);
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					// names must be equal
					if (a["track_num"] < b["track_num"]) {
						return -1;
					}
					if (a["track_num"] > b["track_num"]) {
						return 1;
					}
					return 0;
				});
				break;
			case "string":
				this.track_list.sort(function(a,b){
					var nameA = a[key].toUpperCase(); // ignore upper and lowercase
					var nameB = b[key].toUpperCase(); // ignore upper and lowercase
					if(nameA.length==0 || nameB.length==0){
						if (nameA < nameB) {
							return 1;
						}
						if (nameA > nameB) {
							return -1;
						}
					}
					if (nameA < nameB) {
						return -1;
					}
					if (nameA > nameB) {
						return 1;
					}
					// names must be equal
					if (a["track_num"] < b["track_num"]) {
						return -1;
					}
					if (a["track_num"] > b["track_num"]) {
						return 1;
					}
					return 0;
				});
				break;
			default:
				console.log("Error sorting");
				return this.sort("track_num",reversed);
		}
		if(reversed){
			this.track_list.reverse();
		}
		//TODO: is this good practice?
		this.sort_by = key;
	}
	addTrack(track){ //track_num cannot conflict as it enables deterministic sorting.
		if(!(track instanceof Track)){return false;}
		//deep copy
		track = Track.fromJson(JSON.stringify(track));
		
		//empty track_list
		if(this.track_list.length==0){
			track["track_num"] = 0;
			this.track_list.push(track);
			return true;
		}
		//adding -1
		if(track["track_num"] <= -1){
			track["track_num"] = this.track_list[this.track_list.length-1]["track_num"]+1;
			this.track_list.push(track);
			return true;
		}
		//adding an existing value
		if(this.track_list.find(function(entry){return entry["track_num"] === track["track_num"]}) !== undefined){
			track["track_num"] = -1;
			this.addTrack(track);
			console.log("conflict detected for ",track);
			return false;
		}
		this.track_list.push(track);
		this.sort(this.sort_by);
		return true;
	}
	removeTrack(key="track_num",value=this.track_list.length-1){
		if(key instanceof Track){
			value = containsObject(key,this.track_list);
			if(value!=-1){
				this.track_list.splice(value,1);
				return true;
			}
			return false;
		}
		let tmp = this.track_list.find(function(entry){return entry[key] === value});
		if(tmp === undefined){return false;}
		return this.removeTrack(tmp);
	}
	getTotalDuration(){
		let total = 0;
		this.track_list.forEach(function(track){
			if(track['duration'] != -1){
				total += track['duration'];
			}
		});
		return total;
	}
	getArtists(){
		let artist = "";
		this.track_list.forEach(function(track){
			if(track["artist"]){
				if(!artist){
					artist = track["artist"];
				}else if(track["artist"] != artist){
					artist = "Various Artists";
				}
			}
		});
		return artist;
	}
	setArtists(artist){
		this.track_list.forEach(function(track){
			track.artist = artist;
		});
	}
	hasTrack(track){
		let index = containsObject(track,this.track_list);
		if(index != -1){
			return true;
		}else{
			return false;
		}
	}
	findTrack(track){
		let index = containsObject(track,this.track_list);
		if(index != -1){
			return index;
		}else{
			return false;
		}
	}
}
class Track{
	constructor(src,title,artist="",duration=-1,filetype="HTML",track_num=-1,artwork_url="",_upload_date=(new Date()).toJSON(),_user_id=getCookie("userId")){
		if(src === undefined || src=="" || title === undefined || title=="") {
			throw new Error('Invalid Constructor');
		}
		this.src = src;
		this.title = title;
		this.artist = artist;
		this.duration = duration;
		this.filetype = filetype;
		this.track_num = track_num;
		this.artwork_url = artwork_url;
		this._upload_date = _upload_date;
		this._user_id = _user_id;
	}
	toJSON(){
		//TODO non destructive json
		let src = this.src;
		if(this.oldsrc){src = this.oldsrc;}
		return [src,this.title,this.artist,this.duration,this.filetype,this.track_num,this.artwork_url,this._upload_date,this._user_id];
	}
	
	static fromJson(json){
		var obj = JSON.parse (json);
		return new Track(...obj);
	}
	toHTML(album_title,album_artwork="images/default.png"){
		let track = document.createElement("div");
		let att = document.createAttribute("class");
		att.value = "track";
		track.setAttributeNode(att);
		att = document.createAttribute("data-title");
		att.value = this.title;
		track.setAttributeNode(att);
			//sq
			let sq = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "sq";
			sq.setAttributeNode(att);
				//img
				let img = document.createElement("img");
				att = document.createAttribute("class");
				att.value = "sq-img";
				img.setAttributeNode(att);
				att = document.createAttribute("data-lazysrc");
				//TODO find parent album
				att.value = album_artwork;
				if(!album_artwork){
					att.value = "images/default-white.png";
				}
				if(this.artwork_url){
					att.value = this.artwork_url;
				}
				img.setAttributeNode(att);
				att = document.createAttribute("onerror");
				att.value = "this.onerror=null;this.src='images/error.png';";
				img.setAttributeNode(att);
				sq.appendChild(img);
			track.appendChild(sq);
			//txt-box
			let txt_box = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "txt-box";
			txt_box.setAttributeNode(att);
				//title
				let txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line title";
				txt_line.setAttributeNode(att);
				txt_line.innerText = this.title;
					//extra data
					att = document.createAttribute("data-album");
					att.value = album_title;
					txt_line.setAttributeNode(att);
				txt_box.appendChild(txt_line);
				//album or artist
				txt_line = document.createElement("div");
				att = document.createAttribute("class");
				att.value = "txt-line subtitle";
				txt_line.setAttributeNode(att);
				txt_line.innerText = album_title;
				if(this.artist){
					txt_line.innerText = this.artist;
				}
				txt_box.appendChild(txt_line);
			track.appendChild(txt_box);
			//sq
			sq = document.createElement("div");
			att = document.createAttribute("class");
			att.value = "sq";
			sq.setAttributeNode(att);
				//img
				img = document.createElement("img");
				att = document.createAttribute("class");
				att.value = "sq-img";
				img.setAttributeNode(att);
				att = document.createAttribute("data-lazysrc");
				att.value = "heart-white.png";
				img.setAttributeNode(att);
				sq.appendChild(img);
			track.appendChild(sq);
		return track;
	}
}
class UserPreferences{
	constructor(liked_tracks,blocked_tracks,customSettings = new CustomSettings){
		if(!Array.isArray(liked_tracks) || !Array.isArray(blocked_tracks)){
			throw new Error('Invalid Constructor');
		}
		this.liked_tracks = new Album("Liked Tracks",[]);
		for (const element of liked_tracks) {
		  this.liked_tracks.addTrack(element);
		}
		this.blocked_tracks = new Album("Blocked Tracks",[]);
		for (const element of blocked_tracks) {
		  this.blocked_tracks.addTrack(element);
		}
		this.customSettings = CustomSettings.fromJson(JSON.stringify(customSettings));
	}
	//TODO update methods?
	addLikedTrack(track){
		if(!(track instanceof Track)){return false;}
		//deep copy
		track = Track.fromJson(JSON.stringify(track));
		if(containsObject(track,this.liked_tracks) != -1){return false;}
		this.liked_tracks.push(track);
		this.removeBlockedTrack(track);
		return true;
	}
	addBlockedTrack(track){
		if(!(track instanceof Track)){return false;}
		//deep copy
		track = Track.fromJson(JSON.stringify(track));
		if(containsObject(track,this.blocked_tracks) != -1){return false;}
		this.blocked_tracks.push(track);
		this.removeLikedTrack(track);
		return true;
	}
	removeLikedTrack(key,value=this.liked_tracks.length-1){
		if(key instanceof Track){
			value = containsObject(key,this.liked_tracks);
			if(value!=-1){
				this.liked_tracks.splice(value,1);
				return true;
			}
			return false;
		}
		let tmp = this.liked_tracks.find(function(entry){return entry[key] === value});
		if(tmp === undefined){return false;}
		return this.removeLikedTrack(tmp);
	}
	removeBlockedTrack(key,value=this.blocked_tracks.length-1){
		if(key instanceof Track){
			value = containsObject(key,this.blocked_tracks);
			if(value!=-1){
				this.blocked_tracks.splice(value,1);
				return true;
			}
			return false;
		}
		let tmp = this.blocked_tracks.find(function(entry){return entry[key] === value});
		if(tmp === undefined){return false;}
		return this.removeBlockedTrack(tmp);
	}
	hasLikedTrack(track){
		return (containsObject(track,this.liked_tracks.track_list) != -1);
	}
	hasBlockedTrack(track){
		return (containsObject(track,this.blocked_tracks.track_list) != -1);
	}
	toJSON(){
		return [JSON.parse(JSON.stringify(this.liked_tracks)),JSON.parse(JSON.stringify(this.blocked_tracks)),this.customSettings];
	}
	static fromJson(json){
		var obj = JSON.parse(json);
		return new UserPreferences(obj[0],obj[1],obj[2]);
	}
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (JSON.stringify(list[i]) === JSON.stringify(obj)) {
            return i;
        }
    }

    return -1;
}
function convertToFramework(data){
	data.forEach(function(part, index, theArray) {
		theArray[index] = Album.fromJson(JSON.stringify(theArray[index]));
	});
	return data;
}
function convertToNewFramework(data){
	let final = [];
	Object.keys(oldData).forEach(function(part,index,theArray){
		let arr = new Album(part,[]);
		Object.keys(oldData[part]).forEach(function(part2,index2,theArray2){
			//let tmp = 
			arr.addTrack(new Track(oldData[part][part2],part2,"",-1,musicManager.getFiletype(oldData[part][part2])));
		});
		//console.log(arr);
		final.push(arr);

	});
	return final;
}
