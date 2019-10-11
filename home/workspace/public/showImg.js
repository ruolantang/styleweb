var data = [];
var length = 332;
    
for(var i = 0; i < length; i++) {
    data.push(i);
}
    

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
    
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
}
    
    return array;
}

document.getElementById('img2').src = "imgList/3D Low Poly Car For Games Tocus_0_0_0_Original.png";