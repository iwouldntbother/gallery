if (screen.width <= 699) {
    document.getElementById("mobileSupport").style.display = "flex";
    setTimeout(function(){window.stop();}, 500)
}


var version = "VE Beta0.6.496";
var isLocked = false;
var canvas = document.getElementById("mainCanvas")
var engine = new BABYLON.Engine(canvas, false);
var floorNo = "Ground Floor"
var camera;

var pieceDisplayed = false;
var listData = [];

var videoElements = [];
var soundCreated = false;

var rootMesh;

var cupTip;
var cupDrain;
var isDrinking = false;
var whiteWineMat;
var redWineMat;
var noDrank = 0;

var currentTopPage = 2;
var PDFPages;

var fpsText;

var pieces = [];
var pieceData;

var scene;

let xAddPos = 0;
    let yAddPos = 0;
    let xAddRot = 0;
    let yAddRot = 0;
    let sideJoystickOffset = 150;
    let bottomJoystickOffset = -50;
    let translateTransform;

function init(){
scene = new BABYLON.Scene(engine);

var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("myUI");

fpsText = new BABYLON.GUI.TextBlock();
fpsText.text = "0 fps";
fpsText.color = "white";
fpsText.fontSize = 16;
fpsText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
fpsText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
fpsText.paddingTop = "10px";
fpsText.paddingRight = "10px";

advancedTexture.addControl(fpsText);

var versionText = new BABYLON.GUI.TextBlock();
versionText.text = version;
versionText.color = "white"
versionText.fontSize = 12;
versionText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
versionText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
versionText.paddingRight = "10px";

advancedTexture.addControl(versionText);

var wineCount = new BABYLON.GUI.TextBlock();
wineCount.text = "Wine Count: "+noDrank;
wineCount.color = "white";
wineCount.fontSize = 16;
wineCount.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
wineCount.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
wineCount.paddingTop = "10px";
wineCount.paddingLeft = "10px";

advancedTexture.addControl(wineCount);

var options = new BABYLON.SceneOptimizerOptions(30, 2000);
BABYLON.MergeMeshesOptimization(0);
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1));
options.addOptimization(new BABYLON.TextureOptimization(0, 1024));
options.addOptimization(new BABYLON.HardwareScalingOptimization(0, 1.5));
options.addOptimization(new BABYLON.TextureOptimization(0, 512));
options.addOptimization(new BABYLON.TextureOptimization(0, 256));

var optimizer = new BABYLON.SceneOptimizer(scene, options);

var light1 = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
light1.intensity = 1;
camera = new BABYLON.UniversalCamera("FreeCamera", new BABYLON.Vector3(0,8,0), scene);
camera.speed = 3;
camera.inertia = 0.7;
camera.setTarget(new BABYLON.Vector3(0,8,0));
camera.keysUp.push(87);
camera.keysDown.push(83);
camera.keysLeft.push(65);
camera.keysRight.push(68);
camera._needMoveForGravity = true;
camera.minZ = 0.01;

scene.gravity = new BABYLON.Vector3(0, -1, 0);
scene.shadowsEnabled = true;
camera.applyGravity = true;
camera.ellipsoid = new BABYLON.Vector3(0.25,4,0.25);
scene.collisionsEnabled = true;
camera.checkCollisions = true;

invisMat = new BABYLON.StandardMaterial("invisMat", scene);
invisMat.alpha = 0;

var gl = new BABYLON.GlowLayer("glow", scene);
gl.intensity = 0.5;


galleryMesh = BABYLON.SceneLoader.ImportMesh("", "models/", "BorosBunker.babylon", scene, function(meshes){

    meshes.forEach(function(item){
        

            item.checkCollisions = true;
            if(item.name.includes("Ramp") || item.name.includes("Barrier")){
                item.material = invisMat;
            }else if(item.name.includes("Floor") || item.name.includes("Stairs")){
            }else if(item.name.includes("Particle")){
                item.checkCollisions = false;
            }else if(item.name.includes("Walls")){
            }else if(item.name.includes("OuterWall")){
            }else if(item.name.includes("Slope")){
                item.checkCollisions = false;
            }else if(item.name.includes("piece")){

                item.checkCollisions = false;

                var index = Number(item.name.split(".")[1]);
                var pieceList = document.getElementById("pieceList");
                var pieceTitle = pieceData[index][0];
                var pieceMedium = pieceData[index][5];
                var pieceArtist = pieceData[index][1];
                var pieceFile = "pieces/"+pieceData[index][6] || "pieces/holderIMG.jpg";
                var pieceFloor = artworkFloorCheck(item);

                pieceList.innerHTML += '<div onmouseout="listOut('+index+')" onmouseover="listHover('+index+')" id="'+"searchResult"+index+'" class="pieceHolder"><div class="pieceImage" style="background-image: url('+pieceFile+');"></div><div class="pieceDetails"><h1 class="pieceTitle">'+pieceTitle+'</h1><h2 class="pieceMedium">'+pieceMedium+'</h2><h3 class="pieceArtist">'+pieceArtist+'</h3><h2 class="pieceFloor">'+pieceFloor+'</h2></div></div>';

                pieces.push(item);

                
                if(pieceData[index][2]){

                    var videoTestMat = new BABYLON.StandardMaterial("mat", scene);
                    var videoTexture = new BABYLON.VideoTexture("vidMat", "pieces/"+pieceData[index][3], scene, true, false, BABYLON.VideoTexture.TRILINEAR_SAMPLINGMODE, {loop: true, autoUpdateTexture: true});
                    videoTestMat.diffuseTexture = videoTexture
                    videoTestMat.roughness = 1;
                    videoTexture.video.muted = true;
                    item.material = videoTestMat;

                    videoElements.push([videoTexture]);//, item]);

                }

                var listedItem = [
                    "searchResult"+index,
                    pieceTitle,
                    pieceArtist,
                    pieceFloor,
                    item,
                    false
                ]

                listData[index] = listedItem;

            }
        

        

    })
    
    var resultInfo = document.getElementById("pieceListResultInfo");
    if (pieces.length === 1){
        resultInfo.innerHTML = "1 result"
    }else{
        resultInfo.innerHTML = pieces.length+" results"
    }
    

}, null, function(err, msg, exc){console.log(err, msg, exc)});

var drunkAnimate = new BABYLON.Animation("drunkCamera", "rotation.z", 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    var key = [];
    key.push({
        frame: 0,
        value: 0
    });
    key.push({
        frame: 60,
        value: 0.1
    });
    key.push({
        frame: 120,
        value: 0
    });
    key.push({
        frame: 180,
        value: -0.1
    });
    key.push({
        frame: 240,
        value: 0
    });
    drunkAnimate.setKeys(key);
    camera.animations = [];
    camera.animations.push(drunkAnimate);

BABYLON.SceneLoader.ImportMesh("", "models/", "WineCupAnim.glb", scene, function(meshes){

    rootMesh = meshes[0];
    scene.stopAllAnimations();
    cupDrain = scene.getAnimationGroupByName("KeyAction").normalize(0, 100);
    cupUp = scene.getAnimationGroupByName("EmptyAction")//.normalize(0, 1.5);
    meshes[0].parent = camera

    meshes[0].position.y = -1.8;
    meshes[0].position.z = 0.4;
    meshes[0].rotationQuaternion.w = 0.7071;
    meshes[0].rotationQuaternion.y = 0.7071;

    whiteWineMat = new BABYLON.StandardMaterial("whiteWineMat", scene);
    whiteWineMat.diffuseColor = new BABYLON.Color3(0.9,0.9,0.8);
    whiteWineMat.alpha = 0.5;

    redWineMat = new BABYLON.StandardMaterial("redWineMat", scene);
    redWineMat.diffuseColor = new BABYLON.Color3(0.46, 0.19, 0.29);
    redWineMat.alpha = 0.95;

})


function drinkWine(type){
    noDrank++;
    wineCount.text = "Wine Count: "+noDrank;
    if(noDrank > 29) {
        scene.collisionsEnabled = false;
    }else if(noDrank > 9){
        setTimeout(function(){scene.beginAnimation(camera, 0, 240, true);}, 1000)
    }
    isDrinking = true;
    if(type === "white"){
        scene.getMeshByName("Circle").material = whiteWineMat;
    }else if(type === "red"){
        scene.getMeshByName("Circle").material = redWineMat;
    }
    cupUp.start(false);
    cupDrain.start(false);
    setTimeout(function(){
        isDrinking = false;
        cupUp.reset().stop();
        cupDrain.reset().stop();
    }, 5000)
}


scene.onPointerDown = function(evt){
    if(!isLocked){
        canvas.requestPointerLock = canvas.requestPointerLock || canvas.msRequestPointerLock || canvas.mozRequestPointerLock || canvas.webkitRequestPointerLock || false;
        if(canvas.requestPointerLock){
            canvas.requestPointerLock();
        }
    }
};

pointerlockchange = function () {
    var controlEnabled = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement || document.msPointerLockElement || false;
    
    if (!controlEnabled) {
        camera.detachControl(canvas);

        if(!pieceDisplayed){
            loadPauseMenu();
        }

        setTimeout(function(){isLocked = false;},200);
        document.getElementById("menu").style.display = "";
        document.getElementById("helpText").innerHTML = "Click anywhere to close";

        
        
        //videoElements.forEach(function(item){
        //    item[0].video.muted = true;
        //})
    } else {
        pieceDisplayed = false;
        camera.attachControl(canvas);
        setTimeout(function(){isLocked = true;},200);
        document.getElementById("menu").style.display = "none";
        document.getElementById("helpText").innerHTML = "Press ESC to bring up the map";
        document.getElementById("pieceListContainer").style.pointerEvents = "none";
        if(!document.getElementById("mainVid").paused){
            document.getElementById("mainVid").pause();
        }
        listData.forEach(function(item){
            document.getElementById(item[0]).style.pointerEvents = "none";
        })

        //videoElements.forEach(function(item){
        //    item[0].video.muted = false;
        //})

        /*if(!soundCreated){
            videoElements.forEach(function(item){
                var mediaURL = item[0].video.captureStream()
                var soundSpace = new BABYLON.Sound("sound", mediaURL, scene, null, {
                    loop: true,
                    autoplay: true,
                    spatialSound: true,
                    distanceModel: "exponential",
                    refDistance: 1.5
                });
                soundSpace.attachToMesh(item[1]);
            })
            soundCreated = true;
        }*/
    }
};

document.addEventListener("pointerlockchange", pointerlockchange, false);
document.addEventListener("mspointerlockchange", pointerlockchange, false);
document.addEventListener("mozpointerlockchange", pointerlockchange, false);
document.addEventListener("webkitpointerlockchange", pointerlockchange, false);

document.addEventListener("keydown", function(evnt){
    if(isLocked){
        if(evnt.keyCode === 82){
            camera.position = new BABYLON.Vector3(0,8,0);
            camera.setTarget = new BABYLON.Vector3(0,8,0);
            camera.rotation.x = 0;
            camera.rotation.y = 0;
        }

        if(evnt.keyCode === 16){
            camera.speed = 6;
        }
        
    }
});

document.addEventListener("keyup", function(evnt){
    if(isLocked){
        if(evnt.keyCode === 16){
            camera.speed = 3;
        }
    }
});


window.addEventListener("click", function () {
    if(isLocked){
        var pickResult = scene.pick(window.innerWidth/2, window.innerHeight/2);
        if (pickResult.hit && pickResult.pickedMesh.name.includes("piece")) {
            pieceDisplayed = true;
            document.exitPointerLock();
            pieceDisplay(pickResult.pickedMesh.name);
        }else if (pickResult.hit && pickResult.pickedMesh.name.includes("WineBox")) {
            if(!isDrinking){
                if(pickResult.pickedMesh.name.split(".")[1] === "red"){
                    drinkWine("red");
                }else if(pickResult.pickedMesh.name.split(".")[1] === "white"){
                    drinkWine("white");
                }
            }
        }else if (pickResult.hit && pickResult.pickedMesh.name.includes("PDF")) {
            pieceDisplayed = true;
            document.exitPointerLock();
            PDFDisplay()
        }
    }
});

 
scene.registerBeforeRender(function(){
    translateTransform = BABYLON.Vector3.TransformCoordinates(new BABYLON.Vector3(xAddPos/3000, 0, yAddPos/3000), BABYLON.Matrix.RotationY(camera.rotation.y));
    camera.cameraDirection.addInPlace(translateTransform);
    camera.cameraRotation.y += xAddRot/15000*-1;
    camera.cameraRotation.x += yAddRot/15000*-1;
}); 

scene.executeWhenReady(function(){
    document.getElementById("loadingScreen").style.display = "none";
    console.log("Done Loading");

    videoElements.forEach(function(item){
        item[0].video.play();
    })

    camera.position = new BABYLON.Vector3(0,8,0);
    camera.setTarget = new BABYLON.Vector3(0,8,0);
    camera.rotation.x = 0;
    camera.rotation.y = 0;

    setTimeout(function(){optimizer.start()}, 500);
    
    
    
});

return scene;
};

init();

engine.runRenderLoop(function(){
    fpsText.text = engine.getFps().toFixed() + " fps";
    if(camera.position.y < 0){
        camera.position = new BABYLON.Vector3(0,8,0);
        camera.setTarget = new BABYLON.Vector3(0,8,0);
        camera.rotation.x = 0;
        camera.rotation.y = 0;
    }
    scene.render();
    
    
});

window.addEventListener("resize", function(){
    engine.resize();
});

function pieceDisplay(refNo) {
    document.getElementById("mainOBJ").style.display = "none";
    document.getElementById("PDFView").style.display = "none";
    document.getElementById("pieceListContainer").style.opacity = 0;
    document.getElementById("container").style.height = "auto";
    var index = Number(refNo.split(".")[1]);
    
    var title = document.getElementById("title");
    var name = document.getElementById("name");
    var mainImg = document.getElementById("mainImg");
    var mainVid = document.getElementById("mainVid");
    var about = document.getElementById("about");

    title.innerHTML = pieceData[index][0];
    name.innerHTML = pieceData[index][1];
    about.innerHTML = pieceData[index][4];

    if(pieceData[index][2]) {
        mainImg.style.display = "none";
        mainVid.style.display = "block";
        mainVid.src = "pieces/"+pieceData[index][3];
    }else{
        mainVid.style.display = "none";
        mainImg.style.display = "block";
        mainImg.src = "pieces/"+pieceData[index][3];
    }
}

function PDFDisplay(){
    document.getElementById("mainOBJ").style.display = "none";
    document.getElementById("pieceListContainer").style.opacity = 0;
    document.getElementById("container").style.height = "auto";

    var title = document.getElementById("title");
    var name = document.getElementById("name");
    var mainImg = document.getElementById("mainImg");
    var mainVid = document.getElementById("mainVid");
    var about = document.getElementById("about");

    mainVid.style.display = "none";
    mainImg.style.display = "none";

    title.innerHTML = "Recipes for Disaster";
    name.innerHTML = "Chelsea Jacques";
    about.innerHTML = "Recipe book consisting of recipes for events that are not normally celebrated, for example ‘Friday 13th’. Each of the recipes enclosed are not useable, but represented in the usual, aesthetically pleasing manner, as a comment on the growth of kitchen ‘tutorials’.";
    document.getElementById("PDFView").style.display = "flex";
    
}

function loadPauseMenu() {
    var title = document.getElementById("title");
    var name = document.getElementById("name");
    var mainImg = document.getElementById("mainImg");
    var mainVid = document.getElementById("mainVid");
    var about = document.getElementById("about");
    var mainOBJ = document.getElementById("mainOBJ");
    var mainPDF = document.getElementById("PDFView");
    var pieceList = document.getElementById("pieceListContainer");

    pieceList.style.pointerEvents = "all";

    document.getElementById("container").style.height = "90vh";

    pieceList.style.opacity = 1;

    title.innerHTML = "Map";
    
    about.innerHTML = "The red dot is where you are now & the blue dots represent work on display on this floor"
    
    mainVid.style.display = "none";
    mainImg.style.display = "none";
    mainPDF.style.display = "none";
    mainOBJ.style.display = "block"

    floorNo = checkFloor(camera);
    name.innerHTML = floorNo;
    
    posX = scene.cameras[0].position.x;
    posY = scene.cameras[0].position.z;

    newPoint = locToPoint(posX,posY)
    mainOBJ.getElementById("mapDot").setAttribute("cx", newPoint.x)
    mainOBJ.getElementById("mapDot").setAttribute("cy", newPoint.y)

    mainOBJ.getElementById("artworkDotHolder").innerHTML = "";

    listData.forEach(function(item, itemIndex){
        if(item[3].includes(floorNo)){
            document.getElementById(item[0]).getElementsByClassName("pieceFloor")[0].style.color = "green";
            item[5] = true;
            document.getElementById(item[0]).style.pointerEvents = "all";

            var artPosX = item[4].absolutePosition.x;
            var artPosY = item[4].absolutePosition.z;
            var artNewPoint = locToPoint(artPosX,artPosY)

            mainOBJ.getElementById("artworkDotHolder").innerHTML += '<circle id="artworkDot'+itemIndex+'" fill="#4287f5" cx="'+artNewPoint.x+'" cy="'+artNewPoint.y+'" r="21"/>'
        }else{
            document.getElementById(item[0]).getElementsByClassName("pieceFloor")[0].style.color = "grey";
            item[5] = false;
            document.getElementById(item[0]).style.pointerEvents = "none";
        }
    })
}


function locToPoint(oldValueX, oldValueY){
    oldMinX = -64.4;
    oldMaxX = 147.6;
    oldMinY = -116.5;
    oldMaxY = 96.1;
    
    newMinX = 2048;
    newMaxX = 0;
    newMinY = 0;
    newMaxY = 2048;

    newValues = {x:0, y:0}
    newValues.x = ((((oldValueX-oldMinX)*(newMaxX-newMinX))/(oldMaxX-oldMinX)+newMinX));
    newValues.y = ((((oldValueY-oldMinY)*(newMaxY-newMinY))/(oldMaxY-oldMinY)+newMinY));

    return newValues;
}

function checkFloor(object) {
    var heightPos = object.position.y;

    if(heightPos<15){
        document.getElementById("floor0").style.display = "inline";
        document.getElementById("floor1").style.display = "none";
        document.getElementById("floor2").style.display = "none";
        document.getElementById("floor3").style.display = "none";
        return "Ground Floor";
    }else if(heightPos>15 && heightPos<30){
        document.getElementById("floor0").style.display = "none";
        document.getElementById("floor1").style.display = "inline";
        document.getElementById("floor2").style.display = "none";
        document.getElementById("floor3").style.display = "none";
        return "First Floor";
    }else if(heightPos>30 && heightPos<45){
        document.getElementById("floor0").style.display = "none";
        document.getElementById("floor1").style.display = "none";
        document.getElementById("floor2").style.display = "inline";
        document.getElementById("floor3").style.display = "none";
        return "Second Floor";
    }else if(heightPos>45 && heightPos<60){
        document.getElementById("floor0").style.display = "none";
        document.getElementById("floor1").style.display = "none";
        document.getElementById("floor2").style.display = "none";
        document.getElementById("floor3").style.display = "inline";
        return "Third Floor";
    }

}


function artworkFloorCheck(mesh){
    var meshYPos = mesh.position.y; //Middle of mesh
    var meshYScale = mesh.scaling.y; //Height of mesh
    var meshYL = meshYPos - (meshYScale/2); //Lowest point of mesh
    var meshYH = meshYPos + (meshYScale/2); //Highest point of mesh

    if(meshYL<16){
        if(meshYH<16){
            return "Ground Floor";
        }else if(meshYH<32){
            return "Ground Floor & First Floor"
        }else if(meshYH<50){
            return "Ground Floor, First Floor & Second Floor"
        }else if(meshYH<68){
            return "Ground Floor, First Floor, Second Floor & Third Floor"
        }  
    }else if(meshYL<32){
        if(meshYH<32){
            return "First Floor";
        }else if(meshYH<50){
            return "First Floor & Second Floor"
        }else if(meshYH<68){
            return "First Floor, Second Floor & Third Floor"
        }  
    }else if(meshYL<50){
        if(meshYH<68){
            return "Second Floor & Third Floor"
        }  
    }else if(meshYL<68){
        return "Third Floor"
    }
};





function searchInput(){
    var pieceSearchInput = document.getElementById("pieceSearch").value

    var resultNo = 0;

    listData.forEach(function(details){
        if(details[1].toLowerCase().includes(pieceSearchInput.toLowerCase()) || details[2].toLowerCase().includes(pieceSearchInput.toLowerCase())){
            document.getElementById(details[0]).style.display = "block";
            resultNo++;
        }else{
            document.getElementById(details[0]).style.display = "none";
        }
    })

    if(resultNo === 1){
        document.getElementById("pieceListResultInfo").innerHTML = "1 Result"; 
    }else{
        document.getElementById("pieceListResultInfo").innerHTML = resultNo+" Results"; 
    }

    
}

function listHover(pieceID){
    document.getElementById("mainOBJ").getElementById("artworkDot"+pieceID).setAttribute("fill", "#32a852");
}

function listOut(pieceID){
    document.getElementById("mainOBJ").getElementById("artworkDot"+pieceID).setAttribute("fill", "#4287f5");
}


var pageOne = document.getElementById("pageOne")
var pageTwo = document.getElementById("pageTwo")
var PDFBTNLeft = document.getElementById("PDFLeft")
var PDFBTNRight = document.getElementById("PDFRight")

function PDFLeft() {
    currentTopPage--;
    pageOne.src = "pieces/cookbook/"+PDFPages[currentTopPage - 2];
    pageTwo.src = "pieces/cookbook/"+PDFPages[currentTopPage - 1];
    pageCheck();
}

function PDFRight() {
    currentTopPage++;
    pageOne.src = "pieces/cookbook/"+PDFPages[currentTopPage - 2];
    pageTwo.src = "pieces/cookbook/"+PDFPages[currentTopPage - 1];
    if(currentTopPage < PDFPages.length){
        new Image().src = "pieces/cookbook/"+PDFPages[currentTopPage];
    }
    pageCheck();
}

function pageCheck(){
    //Left
    if(currentTopPage < 3){
        PDFBTNLeft.style.display = "none";
    }else if(currentTopPage > 2){
        PDFBTNLeft.style.display = "block";
    }

    //Right
    if(currentTopPage === PDFPages.length){
        PDFBTNRight.style.display = "none";
    }else if(currentTopPage < PDFPages.length){
        PDFBTNRight.style.display = "block";
    }
}

