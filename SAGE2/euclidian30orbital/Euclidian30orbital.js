"use strict";

/* global THREE */

/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class Euclidian30orbital
 */
var Euclidian30orbital = SAGE2_WebGLApp.extend({
    init: function(data) {
        this.SAGE2Init("div", data);

        this.resizeEvents = "continuous";

        this.element.id = "div" + data.id;
        this.frame  = 0;
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.windowHalfX=this.width/2;
        this.windowHalfY=this.height/2;
        var fieldOfView=75;
        var aspectRatio=this.width/this.height;
        var nearPlane=1;
        var farPlane=3000;
        var cameraZ=farPlane/3;
        var fogHex=0x000000;
        var fogDensity=0.0007;
        this.materials=[];
        this.particles=null;
        this.mouseX=0;
        this.mouseY=0;
        this.dragging=false;
        this.camera   = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.scene    = new THREE.Scene();
        this.scene.fog=new THREE.FogExp2(fogHex, fogDensity);
        this.geometry=new THREE.Geometry();
        this.id = "div" + data.id;
      //DATA for the model
        var dataxyz = xyz;
        var particleCount=Object.keys(dataxyz).length;

		//particleCount=500;
		
		
	
    this.camera.position.set(0, 200, -500);

    //controls
    this.controls = new THREE.OrbitControls(this.camera);
    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;

    //Scene
    this.scene = new THREE.Scene();

    // Helpers
  //  this.axes = new THREE.AxisHelper(500);
   // this.helper = new THREE.GridHelper(1000, 10);
    //this.helper.setColors(0x0000ff, 0x808080);
    //this.scene.add(axes);
  //  scene.add(helper);
		
		
		
		
		var p =0;
		var coOef =300;
        this.cube = []; 
		var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0500});
		var cubeGeometry = new THREE.BoxGeometry(.4, .4, .4);
		
		
        for (var i=0;i<particleCount;i++) {
			//console.log(i);
            var coOrd=xyz[i];
           
            var X = coOrd[0] * coOef;
            var Y = (coOrd[2] * coOef-(coOef*2.5))*-1;
            var Z = coOrd[1] * coOef;
      
	        this.cube[i] = new THREE.Mesh(cubeGeometry, cubeMaterial);
            //cube[i].castShadow = false;
	        this.cube[i].position.x = X; 
			this.cube[i].position.y = Y;
			this.cube[i].position.z = Z;
	  
	  

		var limit1=0;
		var limit2=4;
		
	
	    if (Y<20||Y>200||X>200||Z>200){
		console.log(p++);
		this.scene.add(this.cube[i]);
		}
		else{
        this.scene.add(this.cube[i]);
		}
		   
		   
        }
	
	
  //Hemisphere Light
    this.light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
    this.scene.add(this.light);

    //WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    this.renderer.setClearColor(0xffffff, 1)
    this.renderer.setSize(this.width, this.height);
  // this.id.append(this.renderer.domElement);
  //this.id.push(this.renderer);
  
        // add the output of the renderer to the html element
  

        // render the scene
    
  

    this.posX = this.camera.position.x - 100;
    this.posY = this.camera.position.y + 400;
    this.posZ = this.camera.position.z - 100;
	
	   this.camera.position.set(this.posX, this.posY, this.posZ);
       this.camera.lookAt(new THREE.Vector3(0, 0, 0));
	   console.log(typeof(document.getElementById(this.id)));
	   document.getElementById(this.id).appendChild(this.renderer.domElement);
	   this.renderer.render(this.scene, this.camera);
	   

  
	
	
		
		
		
     
    },
	
	event: function animate() {
   // TWEEN.update();
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
		
},

    load: function(date) {
    },

    draw: function(date) {
    },

    resize: function(date) {
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.renderer.setSize(this.width, this.height);

        this.refresh(date);
    },

    event: function(eventType, position, user_id, data, date) {
            if(eventType==="pointerMove") {
                this.mouseX=position.x -this.windowHalfX;
                this.mouseY=position.y - this.windowHalfY;

                this.refresh(date);
            }
			
			 if(eventType==="pointerClick") {
			  
        var from = {
            x: this.camera.position.x,
            y: this.camera.position.y,
            z: this.camera.position.z
        };

        var to = {
            x: this.posX,
            y: this.posY,
            z: this.posZ
        };
        tween = new TWEEN.Tween(from)
            .to(to, 600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate(function () {
            this.camera.position.set(this.x, this.y, this.z);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .onComplete(function () {
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        })
            .start();
    }
			
			
        }
		
		
		
		
		
		
		
		
		
		
});
