var express = require("express");
var app = express();
var fs  = require("fs");
const sqlite3 = require('sqlite3').verbose();
const store   = require('./store');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

var As = [];
var Aps = [];
var Ans = [];

// open database in disk
// userResult3.db is the one we use in Oct 2018. tripletIdxTable. tripletNameTable
let db = new sqlite3.Database('userResult3.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});


//Start reading gif paths
console.log("Start reading gif paths");
var fs = require("fs");

//Furniture
var furnitureText = fs.readFileSync("FurnitureGif.txt").toString('utf-8');
var furniturePath = furnitureText.split("\n")
var furniturePathToIdx = {}
for(var pathIdx = 0; pathIdx < furniturePath.length; pathIdx++){
    var path = furniturePath[pathIdx];
    furniturePathToIdx[path] = pathIdx;
}

//Interior
var interiorText = fs.readFileSync("InteriorGif.txt").toString('utf-8');
var interiorPath = interiorText.split("\n")
var interiorPathToIdx = {}
for(var pathIdx = 0; pathIdx < interiorPath.length; pathIdx++){
    var path = interiorPath[pathIdx];
    interiorPathToIdx[path] = pathIdx;
}

//Tree
var treeText = fs.readFileSync("2019_gif_tree.txt").toString('utf-8');
var treePath = treeText.split("\n")
var treePathToIdx = {}
for(var pathIdx = 0; pathIdx < treePath.length; pathIdx++){
    var path = treePath[pathIdx];
    treePathToIdx[path] = pathIdx;
}

//Vegetation
var vegetationText = fs.readFileSync("VegetationGif.txt").toString('utf-8');
var vegetationPath = vegetationText.split("\n")
var vegetationPathToIdx = {}
for(var pathIdx = 0; pathIdx < vegetationPath.length; pathIdx++){
    var path = vegetationPath[pathIdx];
    vegetationPathToIdx[path] = pathIdx;
}

//vehicle
var vehicleText = fs.readFileSync("VehiclesGif.txt").toString('utf-8');
var vehiclePath = vehicleText.split("\n")
var vehiclePathToIdx = {}
for(var pathIdx = 0; pathIdx < vehiclePath.length; pathIdx++){
    var path = vehiclePath[pathIdx];
    vehiclePathToIdx[path] = pathIdx;
}


var allPath = new Array();
allPath[0] = furniturePath;
allPath[1] = interiorPath;
allPath[2] = treePath;
allPath[3] = vegetationPath;
allPath[4] = vehiclePath;

var allPathToIdx = new Array();
allPathToIdx[0] = furniturePathToIdx;
allPathToIdx[1] = interiorPathToIdx;
allPathToIdx[2] = treePathToIdx;
allPathToIdx[3] = vegetationPathToIdx;
allPathToIdx[4] = vehiclePathToIdx;


var categoryArr = [0,0,0,1,2,2,3,3,4,4];  //0,0,0,1,1,2,2,3,4,4


///////////////for showing differences
var treeSeperateChoiceText = fs.readFileSync("tree_diff_all.txt").toString('utf-8');
var treeSeperateChoicePath = treeSeperateChoiceText.split("\n")
var processeTreeSeperateChoicePaths = new Array();
for(var idx = 0; idx < treeSeperateChoicePath.length; idx++){ //selfTestTreePath.length
    var paths = treeSeperateChoicePath[idx].split(",");
    var path1 = paths[0];
    var path2 = paths[1];
    var path3 = paths[2];
    processeTreeSeperateChoicePaths[idx] = new Array(path1, path2, path3);
}

///////////////------------------------------------------------------------///////////////
//2019 human labeling
//self test tree. preprocess
var selfTestTreeText = fs.readFileSync("19_tree_test_triplets.txt").toString('utf-8');
var selfTestTreePath = selfTestTreeText.split("\n")
var processedTreeTestPaths = new Array();
for(var idx = 0; idx < selfTestTreePath.length; idx++){ //selfTestTreePath.length
    var paths = selfTestTreePath[idx].split(",");
    // ../../SingleDNOriginalMtl/tree_test/Low Poly Style Tree Pack/Low Poly Style Tree Pack_15_0_0_Original_0##Tree_02a_Green.png
    // Autumn Horror TreesMobile low-poly pack_0_0.gif
    // var path1 = "2019/2019_TreeGif/" + paths[0].split('##')[0].split('/')[6] + '@@@' + paths[0].split('##')[1] + '.gif';
    // var path2 = "2019/2019_TreeGif/" + paths[1].split('##')[0].split('/')[6] + '@@@' + paths[1].split('##')[1] + '.gif';
    // var path3 = "2019/2019_TreeGif/" + paths[2].split('##')[0].split('/')[6] + '@@@' + paths[2].split('##')[1] + '.gif';
    
    var path1 = "2019/2019_TreeGif_woName/" + paths[0].split('/')[6] + '.gif';
    var path2 = "2019/2019_TreeGif_woName/" + paths[1].split('/')[6] + '.gif';
    var path3 = "2019/2019_TreeGif_woName/" + paths[2].split('/')[6] + '.gif';
    
    processedTreeTestPaths[idx] = new Array(path1, path2, path3);
}
// console.log(processedTreeTestPaths.length);

//vehicle
var selfTestVehiclesText = fs.readFileSync("19_vehicles_test_triplets.txt").toString('utf-8');
var selfTestVehiclesPath = selfTestVehiclesText.split("\n")
var processedVehiclesTestPaths = new Array();
for(var idx = 0; idx < selfTestVehiclesPath.length; idx++){ //selfTestTreePath.length
    var paths = selfTestVehiclesPath[idx].split(",");
    // ../../SingleDNOriginalMtl/tree_test/Low Poly Style Tree Pack/Low Poly Style Tree Pack_15_0_0_Original_0##Tree_02a_Green.png
    // Autumn Horror TreesMobile low-poly pack_0_0.gif
    var path1 = "2019/2019_VehiclesGif_woName/" + paths[0].split('/')[6] + '.gif';
    var path2 = "2019/2019_VehiclesGif_woName/" + paths[1].split('/')[6] + '.gif';
    var path3 = "2019/2019_VehiclesGif_woName/" + paths[2].split('/')[6] + '.gif';
    
    processedVehiclesTestPaths[idx] = new Array(path1, path2, path3);
}

//vegetation
var selfTestVegetationText = fs.readFileSync("19_vegetation_test_triplets.txt").toString('utf-8');
var selfTestVegetationPath = selfTestVegetationText.split("\n")
var processedVegetationTestPaths = new Array();
for(var idx = 0; idx < selfTestVegetationPath.length; idx++){ //selfTestTreePath.length
// ../../SingleDNOriginalMtl/Vegetation/vegetation_test/Detail Bushes/Detail Bushes_7_0_0_Original_0##Prefab_Bush_06_low.png
    var paths = selfTestVegetationPath[idx].split(",");
    var path1 = "2019/2019_VegetationGif_woName/" + paths[0].split('/')[6] + '.gif';
    var path2 = "2019/2019_VegetationGif_woName/" + paths[1].split('/')[6] + '.gif';
    var path3 = "2019/2019_VegetationGif_woName/" + paths[2].split('/')[6] + '.gif';
    processedVegetationTestPaths[idx] = new Array(path1, path2, path3);
}

//Furniture
var selfTestFurnitureText = fs.readFileSync("19_furniture_test_triplets.txt").toString('utf-8');
var selfTestFurniturePath = selfTestFurnitureText.split("\n")
var processedFurnitureTestPaths = new Array();
for(var idx = 0; idx < selfTestFurniturePath.length; idx++){ //selfTestTreePath.length
//../../SingleDNOriginalMtl/furniture_test/Living Room Package/Living Room Package_5_0_0_Original_0.png
    var paths = selfTestFurniturePath[idx].split(",");
    var path1 = "2019/2019_FurnitureGif_woName/" + paths[0].split('/')[6] + '.gif';
    var path2 = "2019/2019_FurnitureGif_woName/" + paths[1].split('/')[6] + '.gif';
    var path3 = "2019/2019_FurnitureGif_woName/" + paths[2].split('/')[6] + '.gif';
    processedFurnitureTestPaths[idx] = new Array(path1, path2, path3);
}


//Interior
// var selfTestInteriorText = fs.readFileSync("19_vegetation_test_triplets.txt").toString('utf-8');
// var selfTestInteriorPath = selfTestInteriorText.split("\n")
// var processedInteriorTestPaths = new Array();
// for(var idx = 0; idx < selfTestInteriorPath.length; idx++){ //selfTestTreePath.length
//     var paths = selfTestInteriorPath[idx].split(",");
//     var path1 = "2019/2019_InteriorGif/" + paths[0].split('##')[0].split('/')[5] + '@@@' + paths[0].split('##')[1] + '.gif';
//     var path2 = "2019/2019_InteriorGif/" + paths[1].split('##')[0].split('/')[5] + '@@@' + paths[1].split('##')[1] + '.gif';
//     var path3 = "2019/2019_InteriorGif/" + paths[2].split('##')[0].split('/')[5] + '@@@' + paths[2].split('##')[1] + '.gif';
//     processedInteriorTestPaths[idx] = new Array(path1, path2, path3);
// }

//turk
//Tree
var turkTreeTrainText = fs.readFileSync("turk_tree_train2.txt").toString('utf-8');
var turkTreeTrainPath = turkTreeTrainText.split("\n")
console.log(turkTreeTrainPath.length);
var processedTurkTreeTrainPaths = new Array();
var pathCnt = turkTreeTrainPath.length / 100;
console.log(pathCnt);
for(var ii = 0; ii < pathCnt; ii++){
    var tmpPaths = new Array();
    for(var idx = 0; idx < 100; idx++){ //selfTestTreePath.length
    //../../SingleDNOriginalMtl/furniture_test/Living Room Package/Living Room Package_5_0_0_Original_0.png
        var paths = turkTreeTrainPath[ii*100 + idx].split(",");
        var path1 = "2019/2019_TreeGif_woName/" + paths[0].split('/')[6] + '.gif';
        var path2 = "2019/2019_TreeGif_woName/" + paths[1].split('/')[6] + '.gif';
        var path3 = "2019/2019_TreeGif_woName/" + paths[2].split('/')[6] + '.gif';
        tmpPaths[idx] = new Array(path1, path2, path3);
    }
    processedTurkTreeTrainPaths[ii] = tmpPaths;
}

class soloPathIdxClass {
  constructor(idx) {
    this.idx = idx;
    this.used = false;
  }
}

var ids = fs.readFileSync("uuid2.txt").toString().split('\n');
var idSet = new Set();
var soloPathIdx = 0;
var soloPathIdxArr = new Array();
for(var ii = 0; ii < pathCnt; ii++){
    var o = new soloPathIdxClass(ii);
    soloPathIdxArr[ii] = o;
}

function getUuid()
{
    var rndm = Math.floor(Math.random() * ids.length);
    while(idSet.has(ids[rndm])){
        rndm = Math.floor(Math.random() * ids.length);
    }
    return ids[rndm];
}

function getRndmFromArr()
{
    if(isAllUsed()){
        console.log("all used!");
        return 0;
    }
    var rndm = Math.floor(Math.random() * soloPathIdxArr.length);
    while(soloPathIdxArr[rndm].used){
        rndm = Math.floor(Math.random() * soloPathIdxArr.length);
    }
    return rndm;
}

function isAllUsed(){
    for(var i3 = 0; i3 < pathCnt; i3++){
        if(!soloPathIdxArr[i3].used){
            return false;
        }
    }
    return true;
}

///////////////------------------------------------------------------------///////////////

app.get('/', (req,res) => {
    // var selectedTestPaths;
    var turkSoloTrainPaths;
    soloPathIdx = getRndmFromArr();
    console.log("soloPathIdx: " + soloPathIdx);
    turkSoloTrainPaths = processedTurkTreeTrainPaths[soloPathIdx];
    console.log(turkSoloTrainPaths.length);
    // var category;
    var uuid = getUuid();
    console.log("uuid: " + uuid);
    // let sql1 = `SELECT category FROM categoryCount ORDER BY count ASC`;
    // db.all(sql1, [], (err, rows) => {
    //     if (err) {
    //         throw err;
    //     }
    //     category = rows[0].category;
    //     console.log("smallest count: " + category);
    // // });
    
    // switch (category) {
    //     case "Tree":
    //         selectedTestPaths= processedTreeTestPaths;
    //         break;
    //     case 'Furniture':
    //         selectedTestPaths= processedFurnitureTestPaths;
    //         break;
    //     // case 'Interior':
    //     //     selectedTestPaths= processedInteriorTestPaths;
    //     //     break;
    //     case 'Vegetation':
    //         selectedTestPaths= processedVegetationTestPaths;
    //         break;
    //     case 'Vehicles':
    //         selectedTestPaths= processedVehiclesTestPaths;
    //         break;
        
    //     default:
    //         break;
    // }
    // var category = categoryArr[Math.floor(Math.random() * categoryArr.length)];
	res.render('index', {
        // allPath : allPath[category],
// 		category : category,
        allPath : turkSoloTrainPaths,
        uuid : uuid,
        soloPathIdx : soloPathIdx
	    })
    // });
});

// app.get('/diff', (req,res) => {
// 	res.render('diff', {
//         allPath : processeTreeSeperateChoicePaths
// 	})
// });

// app.post('/recordUser', (req, res) => {
//     console.log("recording user info.");
//     var user_name = req.body.user_name;
//     var user_login = req.body.user_login;
//     var user_email = req.body.user_email;
//     db.run(`INSERT INTO selfTestUserInfo(user_name, user_login, user_email) VALUES(?, ?, ?)`, 
//                     [user_name, user_login, user_email], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }});
// });


app.post('/recordData', (req, res) => { 
    console.log("recording!");
    var allRecord = req.body.allRecord;
    var isGood = req.body.isGood;
    var returnedSoloPathIdx = req.body.soloPathIdx;
    var returnedUuid = req.body.uuid;
    console.log("returnedSoloPathIdx: " + returnedSoloPathIdx);
    console.log("returnedUuid: " + returnedUuid);
    soloPathIdxArr[returnedSoloPathIdx].used = true;
    console.log(soloPathIdxArr[returnedSoloPathIdx].used);
    idSet.add(returnedUuid);
    // console.log(idSet);
    // var record_category = req.body.category;
    // console.log("recording " + record_category);
    if(isGood==="1"){
        console.log("good");
    }else{
        console.log("bad");
    }
    
    if(isGood==="1"){
                for(var i2=0; i2<5; i2++){
                db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                        ['_____','_____','_____'], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }});
                }
            }else{
                for(var i2=0; i2<5; i2++){
                db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                        ['_____','_____','_____'], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }});
                }
            }
            
            for(var i=0; i<allRecord.length; i++){
                var prefabAName = allRecord[i][0];
                var prefabBName = allRecord[i][1];
                var prefabCName = allRecord[i][2];
                // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
                if(isGood==="1"){
                    // console.log("good");
                    db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                    [prefabAName, prefabBName, prefabCName], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }});
                }
                else{
                    // console.log("bad");
                    db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                    [prefabAName, prefabBName, prefabCName], function(err) {
                    if (err) {
                        return console.log(err.message);
                    }});
                }
            }
            
            if(isGood==="1"){
                for(var i2=0; i2<5; i2++){
                db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                        ['_____','_____','_____'], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }});
                }
            }else{
                for(var i2=0; i2<5; i2++){
                db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
                        ['_____','_____','_____'], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }});
                }
            }
            
            // db.run(`update categoryCount set count = count + 1 where category="Tree"`, 
            //   function(err) {
            //         if (err) {
            //             return console.log(err.message);
            //         }
            //     });

            
    // switch (record_category) {
    //     case 'Tree':
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         for(var i=0; i<allRecord.length; i++){
    //             var prefabAName = allRecord[i][0];
    //             var prefabBName = allRecord[i][1];
    //             var prefabCName = allRecord[i][2];
    //             // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
    //             if(isGood==="1"){
    //                 // console.log("good");
    //                 db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //             else{
    //                 // console.log("bad");
    //                 db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //         }
            
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestTreeGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestTreeBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         db.run(`update categoryCount set count = count + 1 where category="Tree"`, 
    //           function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }
    //             });
    //         break;
        
    //     case 'Furniture':
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestFurnitureGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestFurnitureBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         for(var i=0; i<allRecord.length; i++){
    //             var prefabAName = allRecord[i][0];
    //             var prefabBName = allRecord[i][1];
    //             var prefabCName = allRecord[i][2];
    //             // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
    //             if(isGood==="1"){
    //                 // console.log("good");
    //                 db.run(`INSERT INTO selfTestFurnitureGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //             else{
    //                 // console.log("bad");
    //                 db.run(`INSERT INTO selfTestFurnitureBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //         }
            
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestFurnitureGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestFurnitureBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         db.run(`update categoryCount set count = count + 1 where category="Furniture"`, 
    //           function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }
    //             });
    //         break;
            
    //     // case 'Interior':
    //     //     for(var i=0; i<allRecord.length; i++){
    //     //         var prefabAName = allRecord[i][0];
    //     //         var prefabBName = allRecord[i][1];
    //     //         var prefabCName = allRecord[i][2];
    //     //         // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
    //     //         if(isGood==="1"){
    //     //             console.log("good");
    //     //             db.run(`INSERT INTO selfTestInteriorGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //     //             [prefabAName, prefabBName, prefabCName], function(err) {
    //     //             if (err) {
    //     //                 return console.log(err.message);
    //     //             }});
    //     //         }
    //     //         else{
    //     //             console.log("bad");
    //     //             db.run(`INSERT INTO selfTestInteriorBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //     //             [prefabAName, prefabBName, prefabCName], function(err) {
    //     //             if (err) {
    //     //                 return console.log(err.message);
    //     //             }});
    //     //         }
    //     //     }
    //     //     db.run(`update categoryCount set count = count + 1 where category="Interior"`, 
    //     //       function(err) {
    //     //             if (err) {
    //     //                 return console.log(err.message);
    //     //             }
    //     //         });
    //     //     break;
        
    //     case 'Vegetation':
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVegetationGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVegetationBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         for(var i=0; i<allRecord.length; i++){
    //             var prefabAName = allRecord[i][0];
    //             var prefabBName = allRecord[i][1];
    //             var prefabCName = allRecord[i][2];
    //             // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
    //             if(isGood==="1"){
    //                 // console.log("good");
    //                 db.run(`INSERT INTO selfTestVegetationGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //             else{
    //                 // console.log("bad");
    //                 db.run(`INSERT INTO selfTestVegetationBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //         }
            
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVegetationGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVegetationBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         db.run(`update categoryCount set count = count + 1 where category="Vegetation"`, 
    //           function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }
    //             });
    //         break;
        
    //     case 'Vehicles':
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVehiclesGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVehiclesBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }
            
    //         for(var i=0; i<allRecord.length; i++){
    //             var prefabAName = allRecord[i][0];
    //             var prefabBName = allRecord[i][1];
    //             var prefabCName = allRecord[i][2];
    //             // console.log(prefabAName + " " + prefabBName + " " + prefabCName);
                
    //             if(isGood==="1"){
    //                 // console.log("good");
    //                 db.run(`INSERT INTO selfTestVehiclesGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //             else{
    //                 // console.log("bad");
    //                 db.run(`INSERT INTO selfTestVehiclesBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                 [prefabAName, prefabBName, prefabCName], function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }});
    //             }
    //         }
            
    //         if(isGood==="1"){
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVehiclesGood(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }else{
    //             for(var i2=0; i2<5; i2++){
    //             db.run(`INSERT INTO selfTestVehiclesBad(prefabAName, prefabBName, prefabCName) VALUES(?, ?, ?)`, 
    //                     ['_____','_____','_____'], function(err) {
    //                     if (err) {
    //                         return console.log(err.message);
    //                     }});
    //             }
    //         }

    //         db.run(`update categoryCount set count = count + 1 where category="Vehicles"`, 
    //           function(err) {
    //                 if (err) {
    //                     return console.log(err.message);
    //                 }
    //             });
    //         break;
        
    //     default:
    //         break;
    // }
    
});   


app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started!");
});


// app.post('/record', (req, res) => {
//     console.log("recoooooord!");
//     //var allRecordStr = JSON.stringify(req.body);
//     var allRecord = req.body.allRecord;
//     var category = parseInt(req.body.category, 10);// 0,1,2,3,4
//     //var uniqueCode = req.body.uniqueCode;

//     var pathToIdx = allPathToIdx[category];
//     for(var i=0; i<allRecord.length; i++){
//         var prefabAName = allRecord[i][0];
//         var prefabBName = allRecord[i][1];
//         var prefabCName = allRecord[i][2];
        
//         //first insert into the tripletName table
//         // switch(category){
//         //     case 0: //furniture
//         //         db.run(`INSERT INTO furnitureTriplets(prefabA, prefabB, prefabC) VALUES(?, ?, ?)`, 
//         //         [prefabAName, prefabBName, prefabCName], function(err) {
//         //             if (err) {
//         //                 return console.log(err.message);
//         //             }
//         //         });
//         //         break;
//         //     case 1: //interior
//         //         db.run(`INSERT INTO interiorTriplets(prefabA, prefabB, prefabC) VALUES(?, ?, ?)`, 
//         //         [prefabAName, prefabBName, prefabCName], function(err) {
//         //             if (err) {
//         //                 return console.log(err.message);
//         //             }
//         //         });
//         //         break;
//         //     case 2: //tree
//         //         db.run(`INSERT INTO treesTriplets(prefabA, prefabB, prefabC) VALUES(?, ?, ?)`, 
//         //         [prefabAName, prefabBName, prefabCName], function(err) {
//         //             if (err) {
//         //                 return console.log(err.message);
//         //             }
//         //         });
//         //         break;
//         //     case 3: //Vegetation
//         //         db.run(`INSERT INTO vegetationTriplets(prefabA, prefabB, prefabC) VALUES(?, ?, ?)`, 
//         //         [prefabAName, prefabBName, prefabCName], function(err) {
//         //             if (err) {
//         //                 return console.log(err.message);
//         //             }
//         //         });
//         //         break;
//         //     case 4: //Vehicles
//         //         db.run(`INSERT INTO vehiclesTriplets(prefabA, prefabB, prefabC) VALUES(?, ?, ?)`, 
//         //         [prefabAName, prefabBName, prefabCName], function(err) {
//         //             if (err) {
//         //                 return console.log(err.message);
//         //             }
//         //         });
//         //         break;
//         // }
        
//         var prefabAIdx = pathToIdx[prefabAName];//3
//         var prefabBIdx = pathToIdx[prefabBName];//12
//         var prefabCIdx = pathToIdx[prefabCName];//14
        
//         //then insert into the tripletIdx table
//         switch(category){
//             case 0: //furniture
//                 db.run(`INSERT INTO furnitureTripletsIdx(prefabAIdx, prefabBIdx, prefabCIdx) VALUES(?, ?, ?)`, 
//                 [prefabAIdx, prefabBIdx, prefabCIdx], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }
//                 });
//                 break;
//             case 1: //interior
//                 db.run(`INSERT INTO interiorTripletsIdx(prefabAIdx, prefabBIdx, prefabCIdx) VALUES(?, ?, ?)`, 
//                 [prefabAIdx, prefabBIdx, prefabCIdx], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }
//                 });
//                 break;
//             case 2: //tree
//                 db.run(`INSERT INTO treesTripletsIdx(prefabAIdx, prefabBIdx, prefabCIdx) VALUES(?, ?, ?)`, 
//                 [prefabAIdx, prefabBIdx, prefabCIdx], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }
//                 });
//                 break;
//             case 3: //Vegetation
//                 db.run(`INSERT INTO vegetationTripletsIdx(prefabAIdx, prefabBIdx, prefabCIdx) VALUES(?, ?, ?)`, 
//                 [prefabAIdx, prefabBIdx, prefabCIdx], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }
//                 });
//                 break;
//             case 4: //Vehicles
//                 db.run(`INSERT INTO vehiclesTripletsIdx(prefabAIdx, prefabBIdx, prefabCIdx) VALUES(?, ?, ?)`, 
//                 [prefabAIdx, prefabBIdx, prefabCIdx], function(err) {
//                     if (err) {
//                         return console.log(err.message);
//                     }
//                 });
//                 break;
//         }
//     }
    
// });


//close the database connection
// db.close((err) => {
//   if (err) {
//     return console.error(err.message);
//   }
//   console.log('Close the database connection.');
// });


// db.run(`INSERT INTO tripletIdx(i1, i2) VALUES(?, ?)`, 
//         [1, 2], function(err) {
//             if (err) {
//                 return console.log(err.message);
//             }
//             //console.log("added data in");
//         });


// db.run('CREATE TABLE selfTestVehiclesGood(prefabAName text, prefabBName text, prefabCName text)', function(err){
//     if (err) {
//         return console.log(err.message);
//     }
// });

// db.run('CREATE TABLE selfTestVehiclesBad(prefabAName text, prefabBName text, prefabCName text)', function(err){
//     if (err) {
//         return console.log(err.message);
//     }
// });

// //do something to the database
// db.serialize(() => {
//   db.each(`SELECT *
//           FROM userResultTable`, (err, row) => {
//     if (err) {
//       console.error(err.message);
//     }
//     console.log(row.user + row.userA);
//   });
// });




        // var aa = allRecord[i][0].split('.')[0];
        // var aap = allRecord[i][1].split('.')[0];
        // var aan = allRecord[i][2].split('.')[0];
        
        // var modelA = aa+'.png';
        // var modelAp = aap+'.png';
        // var modelAn = aan+'.png';
        
        // var modelANorm = aa.substring(0, aa.length-1)+'2.png';
        // var modelApNorm = aap.substring(0, aap.length-1)+'2.png';
        // var modelAnNorm = aan.substring(0, aan.length-1)+'2.png';
        
        // var modelADepth = aa.substring(0, aa.length-1)+'1.png';
        // var modelApDepth = aap.substring(0, aa.length-1)+'1.png';
        // var modelAnDepth = aan.substring(0, aa.length-1)+'1.png';
        
        // db.run(`INSERT INTO userSixTable(modelA, modelANorm, modelADepth, modelAp, modelApNorm, 
        // modelApDepth, modelAn, modelAnNorm, modelAnDepth) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
        // [modelA, modelANorm, modelADepth, modelAp, modelApNorm, modelApDepth, modelAn, modelAnNorm, modelAnDepth], function(err) {
        //     if (err) {
        //         return console.log(err.message);
        //     }
        //     //console.log("added data in");
        // });
