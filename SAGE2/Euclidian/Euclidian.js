"use strict";
// Euclidian is available for use under the ASL.
// Copyright © 2016
//
//
// See full text, terms and conditions in the LICENSE file.
// https://github.com/Pretty-Cure-5/Euclidian/blob/master/LICENSE
//
//
// Designed for the RMIT VXLab.
// http://www.rmit.edu.au/about/our-locations-and-facilities/facilities/research-facilities/virtual-experiences-laboratory
//
//
// Original implementation: Pretty Cure 5
//
// See full list in the README.md file.
// https://github.com/Pretty-Cure-5/Euclidian/blob/master/README.md


/* global THREE */

/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class Euclidian
 */

var Euclidian = SAGE2_WebGLApp.extend({

    init: function(data) {
        //add timer
        this.build(data);

    },

    addCSS: function(url, callback) {
        var fileref = document.createElement("link");
        if (callback) fileref.onload = callback;
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", url);
        document.head.appendChild(fileref);
    },

    build: function(data) {

        this.firstTime = Date.now();
        this.to60 = 0;

        this.SAGE2Init("div", data);
        this.resizeEvents = "continuous";
        this.element.id = "div" + data.id;
        console.log(data.id);

        //cssStyles:
        this.addCSS(this.resrcPath + "Euclidian.css", null);

        this.modelNumber = 0;
        this.arrows = 0;
        this.floors = 0;
        this.keysHelp = 0;
        this.modelDetailsInfo = 0;

        this.coOef = 100;
        this.Size = this.coOef * 0.01; //vertex particle size
        this.frame = 0;
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.windowHalfX = this.width / 2;
        this.windowHalfY = this.height / 2;
        var fieldOfView = 45;
        var aspectRatio = this.width / this.height;
        var nearPlane = 1;
        var farPlane = 100000;
        var cameraZ = farPlane / 3;
        var fogHex = 0x000000;
        var fogDensity = 0.5007;
        this.materials = [];
        this.distance = 0;
        this.lookx = 0;
        this.looky = 0;
        this.lookz = 0;
        this.change;
        this.changeValue = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.maxFPS = 24; // not in place,
        this.dragging = false;

        //adding the box overlay information and settings
        this.boxId = 0;
        this.boxAlive = false;
        this.boxSize;
        this.boxSizeX = 0.5;
        this.boxSizeY = 0.5;
        this.boxSizeZ = 0.5;
        this.boxX = 0;
        this.boxY = 0;
        this.boxZ = 0;
        this.boxRotate = 0;
        this.boxXR = 0; //rotation
        this.boxYR = 0;
        this.boxZR = 0;

        this.testing = false; /*only used in the test cases*/


        this.camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);

        this.camera.X = 0;
        this.camera.Y = 1.4 * this.coOef;
        this.camera.Z = 0;

        this.camera.PressX;
        this.camera.PressY;
        this.camera.PressZ;

        this.camera.HoldX;
        this.camera.HoldY;
        this.camera.HoldZ;

        this.camera.lookAtX = 0;
        this.camera.lookAtY = 0;
        this.camera.lookAtZ = 0;

        this.camera.position.set(this.camera.X, this.camera.Y, this.camera.Z);
        this.camera.lookAt(new THREE.Vector3(this.camera.lookAtX, this.camera.lookAtY, this.camera.lookAtZ));

        //controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
        this.scrollAmount = 0;
        this.orbitControls.autoRotate = true;
        this.orbitControls.zoomSpeed = 1.0;
        this.userPan = false;
        this.userPanSpeed = 2.0;
        this.speed = 0;
        this.clock = new THREE.Clock();
        this.delta = this.clock.getDelta();
        this.orbitControls.update(this.delta);
        this.orbitControls.autoRotateSpeed = this.speed;


        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setClearColor(new THREE.Color(0xc0c0c0, 1.0)); //0xC0C0C0
        this.renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.sceneFunction(data);
        this.shortcutKeysList(data);


    },


    crossHairFunction: function(data) {

        /*key stroke switch select for box manipulation*/
        switch (this.change) {

            case "bx":
                this.boxX = this.changeValue;
                break;
            case "by":
                this.boxY = this.changeValue;
                break;
            case "bz":
                this.boxZ = this.changeValue;
                break;
            case "bxR":
                this.boxXR = this.boxRotate;
                break;
            case "byR":
                this.boxYR = this.boxRotate;
                break;
            case "bzR":
                this.boxZR = this.boxRotate;
                break;

        }

        /*Display the cube in console realated to the location from the kinect scanner*/
        console.log("Location: ", (this.boxX - this.lookx) / this.coOef, (this.boxY - this.looky) / this.coOef, (this.boxZ - this.lookz) / this.coOef);
        console.log("Size: ", this.boxSizeX, this.boxSizeY, this.boxSizeZ);
        console.log("Rotation: ", this.boxXR, this.boxYR, this.boxZR);

        this.crosshair = new THREE.BoxGeometry(this.coOef * this.boxSizeX, this.coOef * this.boxSizeY, this.coOef * this.boxSizeZ);
        this.crosshairColor = new THREE.Color("#ed1c40");
        this.crosshairMaterial = new THREE.MeshBasicMaterial({
            color: this.crosshairColor,
            wireframe: true,
            wireframe_linewidth: 30
        });
        this.hair = "hair" + this.boxId++;

        this.hair = new THREE.Mesh(this.crosshair, this.crosshairMaterial);
        this.hair.castShadow = false;
        this.hair.position.x = this.boxX;
        this.hair.position.y = this.boxY;
        this.hair.position.z = this.boxZ;
        this.hair.rotation.x = this.boxXR;
        this.hair.rotation.y = this.boxYR;
        this.hair.rotation.z = this.boxZR;

        this.scene.add(this.hair);

        this.boxControlHideShow(data);
        this.boxControlHideShow(data);


    },

    sceneFunction: function(data) {


        this.particles = null;
        this.geometry = null;
        this.geometry = new THREE.Geometry();

        this.dataxyz = datamenuXYZ[this.modelNumber];
        this.ModCount = Object.keys(datamenuXYZ).length;

        //part of the testing program
       /* if (this.testing) {
            this.particleCount = this.testingCount;
            if (this.particleCount > Object.keys(this.dataxyz).length)
                this.particleCount = Object.keys(this.dataxyz).length;
        } else this.particleCount = Object.keys(this.dataxyz).length;*/

        this.particleCount = Object.keys(this.dataxyz).length;

        if (this.change == "x") {
            this.lookx = this.changeValue;
            // console.log(this.lookx);
        }
        if (this.change == "y") {

            this.looky = this.changeValue;
        }
        if (this.change == "z") {

            this.lookz = this.changeValue;
        }


        /*this is the loop that reads the data from the .js file this.dataxyz*/
        this.dataLoop(data);

        /*place the loop data into the pointcloud*/
        this.particles = new THREE.PointCloud(this.geometry, new THREE.PointCloudMaterial({
            size: this.Size,
            vertexColors: true,
            opacity: 0.7
        }));

        //add the point cloud to the scene and render
        this.scene.add(this.particles);
        this.renderer.render(this.scene, this.camera);

        //adding the custom widgetbuttons
        this.widgetButtons(data);

        //adding the info section
        this.infoFunction(data);
        this.infoguiHideShow(data);

        //adding the box controler info section
        this.boxControl(data);
        this.boxControlHideShow(data);
        this.boxControlHideShow(data);

    },

    dataLoop: function(data) {

        for (var i = 1; i < this.particleCount; i++) {


            var coOrd = this.dataxyz[i];
            var vertex = new THREE.Vector3();
            this.vertexTop = new THREE.Vector3();
            this.vertexBottom = new THREE.Vector3();



            vertex.x = (coOrd[0] * this.coOef * -1) + this.lookx;
            // kinect is inverted so we swap y and z heree
            vertex.y = (coOrd[2] * this.coOef * -1) + this.looky;
            vertex.z = (coOrd[1] * this.coOef * -1) + this.lookz;

            //get the largest and smallest coord
            //the kinnect should not be able to collect more than this 3.5 meters.

            var range = 3.5;
            var large = coOrd[0];
            if (coOrd[1] > large) {
                large = coOrd[1];
            }
            if (coOrd[2] > large) {
                large = coOrd[2];
            }

            if (large < range && coOrd[2] > 0) {

                this.vertexTop.x = vertex.x;
                this.vertexTop.y = vertex.y * 0.999;
                this.vertexTop.z = vertex.z;
                this.vertexBottom.x = vertex.x;
                this.vertexBottom.y = vertex.y * 1.01;
                this.vertexBottom.z = vertex.z;



                var hexString = 0xAAAAAA / this.dataxyz[i][2];
                var vertexColor = new THREE.Color(hexString);


                /*this.geometry.vertices.push(this.vertexTop);
                this.geometry.colors.push(vertexColor);
                this.geometry.vertices.push(this.vertexBottom);
                this.geometry.colors.push(vertexColor);*/
                this.geometry.vertices.push(vertex);
                this.geometry.colors.push(vertexColor);



            }

        } //end of the check coord[1] size if

    },

    coOrdArrows: function(data) {

        //this will place the x, y and z arrows into the scene
        if (this.arrows == 0) {
            this.from = new THREE.Vector3(0, 0, 0);
            this.tox = new THREE.Vector3(this.coOef * 1, 0, 0);
            this.directionx = this.tox.clone().sub(this.from);
            this.length = this.directionx.length();

            this.toy = new THREE.Vector3(0, this.coOef * 1, 0);
            this.directiony = this.toy.clone().sub(this.from);
            //this.length = this.direction.length();

            this.toz = new THREE.Vector3(0, 0, this.coOef * 1);
            this.directionz = this.toz.clone().sub(this.from);
            //this.length = this.direction.length();

            this.arrowHelperx = new THREE.ArrowHelper(this.directionx.normalize(), this.from, this.length, 0xff0000);
            this.arrowHelpery = new THREE.ArrowHelper(this.directiony.normalize(), this.from, this.length, 0x00ff00);
            this.arrowHelperz = new THREE.ArrowHelper(this.directionz.normalize(), this.from, this.length, 0x0000ff);
            this.scene.add(this.arrowHelperx);
            this.scene.add(this.arrowHelpery);
            this.scene.add(this.arrowHelperz);
            this.renderer.render(this.scene, this.camera);
            this.arrows = 1;

        } else {

            this.scene.remove(this.arrowHelperx);
            this.scene.remove(this.arrowHelpery);
            this.scene.remove(this.arrowHelperz);
            this.renderer.render(this.scene, this.camera);
            this.arrows = 0;

        }

    },

    floorFunction: function(data) {

        if (this.floors == 0) {

            var floorspace = new THREE.BoxGeometry(this.coOef * 3.5, 0, this.coOef * 3.5);
            var floorcolor = new THREE.Color("#E7FEFF");
            var floorMaterial = new THREE.MeshBasicMaterial({
                color: floorcolor
            });
            this.floor = new THREE.Mesh(floorspace, floorMaterial);

            this.floor.castShadow = false;
            this.floor.position.x = 0;
            this.floor.position.y = 0;
            this.floor.position.z = 0;
            this.scene.add(this.floor);
            this.floors = 1;
            this.renderer.render(this.scene, this.camera);
        } else {

            this.scene.remove(this.floor);
            this.renderer.render(this.scene, this.camera);
            this.floors = 0;
        }

    },

    widgetButtons: function(data) {
        this.controls.addButton({
            type: "fastforward",
            position: 7,
            identifier: "Spin+"
        });
        this.controls.addButton({
            type: "rewind",
            position: 8,
            identifier: "Spin-"
        });
        this.controls.addButton({
            type: "new",
            position: 4,
            identifier: "ModelDetails"
        });
        this.controls.addButton({
            type: "next",
            position: 1,
            identifier: "NextModel"
        });
        this.controls.addButton({
            type: "prev",
            position: 2,
            identifier: "PrevModel"
        });



        this.controls.finishedAddingControls();


    },



    infoFunction: function(data) {


        this.info = document.createElement('div');
        this.info.id = "infoEuclidian";
        this.info.className = "info";

        this.title = document.createElement("H2");
        this.title.text = document.createTextNode("Model Details");
        this.title.appendChild(this.title.text);
        this.info.appendChild(this.title);

        var metadata = this.dataxyz[0];
        for (var m = 0; m < 7; m++) {

            this.details = document.createElement("H3");
            this.details.text = document.createTextNode(metadata[m]);
            this.details.appendChild(this.details.text);
            this.info.appendChild(this.details);
            this.info.style.fontFamily = this.font;
        }


        this.details = document.createElement("H2");
        this.details.className = "modelNumberDisplay";
        this.details.text = document.createTextNode("Model: " + (this.modelNumber + 1) + " / " + this.ModCount);
        this.details.appendChild(this.details.text);
        this.info.appendChild(this.details);
        this.element.appendChild(this.info);

    },

    shortcutKeysList: function(data) {

        this.kinfo = document.createElement('div');
        this.kinfo.id = "keysEuclidian";
        this.kinfo.className = "info";
        this.keysList = [
            "Help", "[h]: Help (hide/show)", "[i]: Info (hide/show)", "[a]: Compass (hide/show) static", "[f]: Floor (hide/show) static", "-------------------------------------------- ", "[b]: box mode function ON/OFF", "-------------------------------------------- ", "To Move the Model or the Box", "[x],[y] and [z]: direction/axis/size ", "[0-9] change the size of the box", " [UP] [DOWN] spin the box", "[LeftArrow]: moves the model/Box", "[RightArrow]: moves the model/Box", "For example press [x] once", "[leftArrow] 5 times", "--------------------------------------------", "Change the model ", "[,<] left ", "[.>] right", "--------------------------------------------"
        ];


        this.detailsk = document.createElement("H2");
        this.detailsk.text = document.createTextNode(this.keysList[0]);
        this.detailsk.appendChild(this.detailsk.text);
        this.kinfo.appendChild(this.detailsk);

        for (var m = 1; m < 21; m++) {

            this.detailsk = document.createElement("H3");

            this.detailsk.text = document.createTextNode(this.keysList[m]);
            this.detailsk.appendChild(this.detailsk.text);
            this.kinfo.appendChild(this.detailsk);
        }

        this.element.appendChild(this.kinfo);

    },


    boxControl: function(data) {

        this.binfo = document.createElement('div');
        this.binfo.id = "boxControlEuclidian";
        this.binfo.className = "info";
        this.detailsB = document.createElement("H2");
        this.detailsB.header = document.createTextNode("Box Controller ON");
        this.detailsB.appendChild(this.detailsB.header);
        this.binfo.appendChild(this.detailsB);
        this.element.appendChild(this.binfo);

    },

    boxDetails: function(data) {

        /*Future development
         * this will display on the main appCore
         * to be fully implemented
         */

        this.boxList = [
            ["X", "Y", "Z"],
            [this.boxX, this.boxY, this.boxZ]
        ];
        console.log(this.boxX);
        for (var b = 0; b < this.boxList.length + 1; b++) {
            var id = "B" + b;
            console.log(id);
            this.detailsB = document.getElementById(id);

            this.detailsB.text = document.createTextNode(this.boxList[0][b], this.boxList[1][b]);

        }

        this.element.appendChild(this.binfo);


    },


    clearTheScene: function(data) {

        this.scene.remove(this.particles);
        this.manualdraw(date);
        this.refresh(data);
        console.log("clearScene");


    },

    infoguiHideShow: function(data) {

        if (this.info.style.display == "none") {
            this.info.style.display = "block";
        } else {
            this.info.style.display = "none";
        }
        this.manualdraw(data);

    },
    keymapHideShow: function(data) {

        if (this.kinfo.style.display == "none") {
            this.kinfo.style.display = "block";
        } else {
            this.kinfo.style.display = "none";
        }
        this.manualdraw(data);

    },
    boxControlHideShow: function(data) {


        if (this.boxAlive) {
            this.boxAlive = false;
            this.binfo.style.display = "none";
        } else {
            this.boxAlive = true;
            this.binfo.style.display = "block";
        }

        this.manualdraw(data);

    },

    load: function(date) {


    },

    //draw is continuous
    draw: function(date) {


        if (this.speed != 0) {

            this.orbitControls.update(); //this is for the <<spin>>
            this.renderer.render(this.scene, this.camera);
            this.to60 = this.to60 + 1;

            this.lastTime = Date.now();
            if (this.lastTime - this.firstTime > 999) {

                this.firstTime = Date.now();
                this.to60 = 0;

            }
        }



    },

    manualdraw: function(date) {

        this.renderer.render(this.scene, this.camera);

    },

    wait: function(data) {

        setTimeout(function() {

        }, 1000);


    },

    updateModel: function(data) {

        this.element.removeChild(this.info);
        this.scene.remove(this.particles);
        this.sceneFunction(data);




    },

    updateBox: function(data) {

        //hair is short for crosshair as in linebox has a crosshair.
        this.scene.remove(this.hair);
        this.crossHairFunction(data);
        this.manualdraw(data);

    },


    resize: function(date) {
        this.width = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.renderer.setSize(this.width, this.height);
        this.refresh(date);
    },

    event: function(eventType, position, user_id, data, date) {


        if (eventType === "pointerPress" && data.button === "left") {

            this.orbitControls.mouseDown(position.x, position.y, 0);

            this.camera.PressX = position.x;
            this.camera.PressY = position.y;
            this.camera.PressZ = position.x;

            //   console.log("press", this.camera.position.x);
            this.dragging = true;
            this.refresh(date);

        } else if (eventType === "pointerMove" && this.dragging) {
            this.orbitControls.update();
            this.renderer.render(this.scene, this.camera);
            //console.log(position.x,position.y);
            //  console.log("hold", this.camera.position.x);

            if (this.userPan) {

                //console.log(this.camera.position.y);
                //this.camera.X = this.camera.X + (this.camera.PressX - position.x);
                this.camera.position.y = this.camera.position.y + (this.camera.PressY / 20 - position.y / 20);
                //this.camera.Z = this.camera.Z + ((this.camera.PressZ/10 - position.x/10));
                this.camera.lookAtY = this.camera.lookAtY + (this.camera.PressY / 20 - position.y / 20);
                //console.log(this.camera.position.y);
                //  console.log(this.camera.lookAt);
                this.camera.lookAt(this.camera.lookAtX, this.camera.lookAtY, this.camera.lookAtZ);
                //this.camera.position.set(this.camera.X,this.camera.Y,this.camera.Z);
                //  console.log(this.camera.lookAt);
            } else {
                this.orbitControls.mouseMove(position.x, position.y);
            }
            this.refresh(date);
        } else if (eventType === "pointerRelease" && (data.button === "left")) {
            this.dragging = false;
        } else if (eventType === "pointerScroll") {

            this.scrollAmount = data.wheelDelta;
            this.orbitControls.scale((this.scrollAmount / 10) * -1);
            this.manualdraw(data);

        } else if (eventType === "specialKey" && data.state === "down") {

            /*
            if (data.code === 84) {

                this.testResults = [Date().toLocaleString(), "Test_1"];
                this.t1;
                this.t2;
                this.t3;
                this.testFPSResults = ["Test_1-FPS:"];
                // t  for running testing script

                for (this.round = 0; this.round < 10; this.round++) {
                    for (this.testi = 0; this.testi < this.ModCount; this.testi++) {


                        this.testTimerStart = new Date();

                        console.log(".");

                        this.pause = new Date();

                        //stress test reload the model 10 times + timer loop
                        this.number = 0;
                        while (this.pause - this.testTimerStart < 1000) {

                            this.pause = new Date();
                            this.updateModel(data);
                            this.manualdraw(date);
                            this.refresh(date);
                            this.number++;

                        }



                        this.testTimerEnd = new Date();
                        this.testResults.push(this.testTimerEnd - this.testTimerStart)
                        this.testFPSResults.push(this.number);

                    }
                    this.testResults.push(" ");
                    this.testFPSResults.push(" ");
                }

                console.log(this.testResults);
                console.log(this.testFPSResults);

                this.t1 = this.testResults;
                this.testResults = ["Test_2"];


                for (this.round = 0; this.round < 10; this.round++) {
                    for (this.testi = 0; this.testi < this.ModCount; this.testi++) {

                        this.testTimerStart = new Date();
                        this.refresh(date);
                        this.modelNumber = this.testi;
                        this.updateModel(data);
                        this.testTimerEnd = new Date();
                        this.testResults.push(this.testTimerEnd - this.testTimerStart)

                        console.log(".");

                    }
                    this.testResults.push(" ");
                }


                console.log(this.testResults);



                console.log(this.testResults);
                console.log(this.testFPSresults);
                this.t2 = this.testResults;
                this.testResults = ["Test_3"];

                this.testing = true;
                this.testingCount = 250;
                for (this.round = 0; this.round < 10; this.round++) {

                    this.testResults.push(this.testingCount + "=");

                    for (this.testi = 0; this.testi < this.ModCount; this.testi++) {

                        this.testTimerStart = new Date();
                        this.refresh(date);
                        this.modelNumber = this.testi;
                        this.updateModel(data);
                        this.testTimerEnd = new Date();
                        this.testResults.push(this.testTimerEnd - this.testTimerStart)

                        console.log(".");



                    }
                    this.testResults.push(" ");
                    this.testingCount = this.testingCount * 2
                }


                console.log(this.t1 + this.testFPSResults + this.t2 + this.testResults);




            }
            */
            if (data.code === 65) {
                // a   for hide show coOrd arrows

                this.coOrdArrows(data);
                this.refresh(date);

            } else if (data.code === 80) {
                // p for mouse pan
                this.userPan = !this.userPan;
            } else if (data.code === 70) {
                // f   for hide show the floor

                this.floorFunction(data);
                this.refresh(date);

            } else if (data.code === 73) {
                // i   for hide show info

                this.infoguiHideShow(data);
                this.refresh(date);

            } else if (data.code === 88) {
                // x

                if (this.boxAlive) {
                    this.change = "bx";
                    this.changeValue = this.boxX;
                    this.boxRotate = this.boxXR;
                    //  console.log("x box pressed");
                    this.refresh(date);

                } else {
                    this.change = "x";
                    this.changeValue = this.lookx;
                    //  console.log("x pressed");
                    this.refresh(date);
                }

            } else if (data.code === 89) {
                // y

                if (this.boxAlive) {
                    this.change = "by";
                    this.changeValue = this.boxY;
                    this.boxRotate = this.boxYR;
                    //   console.log("Y box pressed");
                    this.refresh(date);

                } else {
                    this.change = "y";
                    this.changeValue = this.looky;
                    //  console.log("y pressed");
                    this.refresh(date);
                }

            } else if (data.code === 90) {
                // z

                if (this.boxAlive) {
                    this.change = "bz";
                    this.changeValue = this.boxZ;
                    this.boxRotate = this.boxZR;
                    //  console.log("Z box pressed");
                    this.refresh(date);

                } else {
                    this.change = "z";
                    this.changeValue = this.lookz;
                    //  console.log(" z pressed");
                    this.refresh(date);
                }

            } else if (data.code === 37) {
                // left

                if (this.boxAlive) {
                    this.changeValue = this.changeValue - this.coOef * 0.005;
                    this.updateBox(data);
                } else {
                    this.changeValue = this.changeValue - this.coOef * 0.1;
                    this.updateModel(data);
                }


            } else if (data.code === 39) {
                // right
                if (this.boxAlive) {
                    this.changeValue = this.changeValue + this.coOef * 0.005;
                    this.updateBox(data);
                } else {
                    this.changeValue = this.changeValue + this.coOef * 0.1;
                    this.updateModel(data);
                }



            } else if (data.code === 40) {
                // up
                if (this.change.length == 2) {
                    this.change = this.change + "R";
                }
                // console.log(this.change + "rotation has change");
                if (this.boxAlive) {
                    this.boxRotate = this.boxRotate - 0.03;
                    //this.hair.rotation.x-=2;
                    this.updateBox(data);
                } else {
                    this.updateModel(data);
                }



            } else if (data.code === 38) {
                // down

                if (this.change.length == 2) {
                    this.change = this.change + "R";
                }

                if (this.boxAlive) {
                    this.boxRotate = this.boxRotate + 0.03;

                    this.updateBox(data);
                } else {
                    this.updateModel(data);
                }



            } else if (data.code === 190) {
                // [.>]
                if (this.modelNumber < this.ModCount - 1) {
                    this.modelNumber++;
                    this.updateModel(data);
                }


            } else if (data.code === 188) {
                // [,<]
                if (this.modelNumber > 0) {
                    this.modelNumber--;
                    this.updateModel(data);
                }



            } else if (data.code === 72) {
                // h
                this.keymapHideShow(data);
                this.refresh(date);



            } else if (data.code === 66) {
                // b for new box
                this.boxControlHideShow(data);
                this.updateBox(data);



            } else if (data.code > 47 && data.code < 58) {
                // numbers 0 - 9 for default box size chnages

                if (this.boxAlive) {
                    // console.log(data.code - 48);
                    this.boxSize = (data.code - 48 + 1) * 0.1; //the extra one means 0 = 1 and 9 = 10 * coOef

                    switch (this.change) {

                        case "bx":
                            this.boxSizeX = this.boxSize;
                            break;
                        case "by":
                            this.boxSizeY = this.boxSize;
                            break;
                        case "bz":
                            this.boxSizeZ = this.boxSize;
                            break;
                    }

                    this.updateBox(data);
                }

                this.refresh(date);


            } else if (data.code === 189 || data.code === 187) {

                if (this.boxAlive) {

                    switch (data.code) {

                        case 189:
                            var boxSizer = -0.01;
                            break;
                        case 187:
                            var boxSizer = 0.01;
                            break;
                    }

                    switch (this.change) {

                        case "bx":
                            this.boxSizeX = this.boxSizeX + boxSizer;
                            break;
                        case "by":
                            this.boxSizeY = this.boxSizeY + boxSizer;
                            break;
                        case "bz":
                            this.boxSizeZ = this.boxSizeZ + boxSizer;
                            break;
                    }

                    this.updateBox(data);
                }

                this.refresh(date);


            }

        } //end specialKey
        else if (eventType === "widgetEvent") {
            switch (data.identifier) {

                case "Spin+":
                    //this.infogui(data);
                    this.speed++;
                    this.orbitControls.autoRotateSpeed = this.speed;
                    break;
                case "Spin-":
                    this.speed--;
                    this.orbitControls.autoRotateSpeed = this.speed;
                    break;
                case "ModelDetails":
                    this.infoguiHideShow(data);
                    break;
                case "Clear":
                    break;
                case "NextModel":
                    if (this.modelNumber < this.ModCount - 1) {
                        this.modelNumber++;
                        this.updateModel(data);
                    }
                    break;
                case "PrevModel":
                    if (this.modelNumber > 0) {
                        this.modelNumber--;
                        this.updateModel(data);
                    }
                    break;
                case "reset":
                    break;

                default:
                    console.log("No handler for:", data.identifier);
                    return;
            }

            this.refresh(date);
        }
    }


});