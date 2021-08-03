fetch('./php/get-BC-album.php',{
    method: 'POST',
    body: JSON.stringify({url:"https://the8bitbigband.bandcamp.com/album/the-k-k-sessions-animal-crossing-ep"}),
}).then(function(r){
    console.log(r);
    if(r.status != 200) return r.text().then(function(e){return Promise.reject(e)})
    return r.json()
})
.then(function(o){
    let a = new Album(o);
    if(a.length == 0) throw new Error("Empty album!");
    //upload here
    console.log(o);
    return fetch('./php/set-album.php',{
        method: 'POST',
        body: JSON.stringify(a),
    })
})
.then(function(r){return r.text()})
.then(function(o){console.log(o)})
.catch(function(e){console.error(e)})
