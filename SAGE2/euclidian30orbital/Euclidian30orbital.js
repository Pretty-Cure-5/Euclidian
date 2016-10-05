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
                var fieldOfView=45;
                var aspectRatio=this.width/this.height;
                var nearPlane=1;
                var farPlane=5000;
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
				
				var X1 =0;
				var Y1 =0;
				var	Z1 =0;
		    
                this.camera.position.set(0, 200, -500);

               //controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
		this.orbitControls.maxPolarAngle = Math.PI / 2;
		this.orbitControls.minDistance = 0;
		this.orbitControls.maxDistance = 500;
		this.orbitControls.autoRotate  = true;
		this.orbitControls.zoomSpeed   = 1.0;
		this.speed = 0;
		this.orbitControls.autoRotateSpeed = this.speed; 


                //Scene
                this.scene = new THREE.Scene();

          
		
		
		//Varibles to control the data display
	   var coOef = 100;
	   var cube = []; 
	   var p = 0;
	   var colorsmall=0;
	   var colorspace=0;
	   
	  //this is determin how many flat cubes
	  var removeExcessFlat=0; 
	  var removeCountTotal = 10;
	  var addcube1=0; // this has to be 0 or none of the outliners will be created
	  var addcube2; //this is a random number set inside the loop
		    
			
				//varibles for the different cub sizes
		        var cubeGeometryFlat = new THREE.BoxGeometry(2, .01, 2);
		        var cubeGeometryY = new THREE.BoxGeometry(.6, 1.2, .6);
		        var cubeGeometryNothing = new THREE.BoxGeometry(.0, .0, .0);
				
				//all the cubes go into this group
				this.group = new THREE.Group();
		
			    //adding floor
		        var floorspace = new THREE.BoxGeometry(coOef*2.5, 0, coOef*2.5);
		        var floorcolor = new THREE.Color("#E7FEFF");
	            var floorMaterial = new THREE.MeshBasicMaterial({color: floorcolor});
		        var floor = new THREE.Mesh(floorspace, floorMaterial);
		
		        floor.castShadow = false;
	            floor.position.x = 0; 
		        floor.position.y = 0;
		        floor.position.z = 0;
		        this.group.add(floor);
				
	 
		
		
        for (var i = 0; i < particleCount; i++) {
			
		addcube2= Math.floor((Math.random() * 7) + 1);	
			
	 //  console.log(i);
		var X=dataxyz[i][0]*coOef;
	    var Y=(dataxyz[i][2]*coOef-(coOef*2.5))*-1;
	    var Z=(dataxyz[i][1]*coOef);
		
		if (i>2){
		var OLDY= (dataxyz[i-1][2]*coOef-(coOef*2.5))*-1;
		}
		if (i<particleCount-1){
		var NEWY= (dataxyz[i+1][2]*coOef-(coOef*2.5))*-1;
		}
		
		var hexString="00308F";
		
		colorsmall++;
		if (Y<0.37*coOef){
		hexString="00308F";
	    }
		else if (Y<.5*coOef){
		hexString="008000";
		}
		else if (Y<.7*coOef){
		hexString="FDEE00";
		}
		else if (Y<5*coOef){
		hexString="BFFF00";
		}
		
		if (Y+1<OLDY||Y-1>NEWY){
			hexString="FF007F";
		}
		
		
	   this.color = new THREE.Color("#"+hexString);
	   var cubeMaterial = new THREE.MeshBasicMaterial({
		color: this.color,
		wireframe:true
		});
	    this.mesh;
		
		
		
         
		if (Y+coOef/100<OLDY||Y-coOef/100>NEWY){
			removeExcessFlat=0;
			this.mesh = new THREE.Mesh(cubeGeometryY, cubeMaterial);
		}
		
		else if(Y+.8<OLDY||Y-.8>OLDY){
		removeExcessFlat=0;
		this.mesh = new THREE.Mesh(cubeGeometryNothing, cubeMaterial);
			
		}
		else{
		this.mesh = new THREE.Mesh(cubeGeometryFlat, cubeMaterial);
		
		}
		
        this.mesh.castShadow = false;
	    this.mesh.position.x = X; 
		this.mesh.position.y = Y;
		this.mesh.position.z = Z;
	 	this.mesh.matrixAutoUpdate = false;
		this.mesh.updateMatrix();
	 
	 
		
		if (X>X1){X1=X;}
		if (Y>Y1){Y1=Y;}
		if (Z>Z1){Z1=Z;}
	//console.log(X1+" "+Y1+" "+Z1);
	
	
	
		if (Y<coOef/10||Y>.9*coOef||X>1.1*coOef||Z>1.1*coOef){
		//this checks if its noise from the kinect and does not display
		// this may not work on other models
		//Y only uses from 10% to 90% of the range.
		//X and Z are removing whats beyond field of vision
		}
		
		else{
		if (removeExcessFlat<removeCountTotal){	
			if (removeExcessFlat==addcube1||removeExcessFlat==addcube2){
				
		// add the cube to the scene	
        this.group.add( this.mesh );
			}
		removeExcessFlat++;
		}
		else{	
        removeExcessFlat=0;
		}
		
		}
		this.scene.add(this.group);
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
    
  
				//camera postitions
                this.posX = this.camera.position.x - 80;
                this.posY = this.camera.position.y + 120;
                this.posZ = this.camera.position.z - 80;
	
	            this.camera.position.set(this.posX, this.posY, this.posZ);
                this.camera.lookAt(new THREE.Vector3(0, 0, 0));
			
				this.renderer.render(this.scene, this.camera);
	            document.getElementById(this.id).appendChild(this.renderer.domElement);
	            
	   
            //adding the widget controls
			
	
      
	    this.controls.addButton({type: "zoom-in", position: 12, identifier: "ZoomIn"});
		this.controls.addButton({type: "zoom-out", position: 11, identifier: "ZoomOut"});
	    this.controls.addButton({type: "fastforward", position: 7, identifier: "Spin+"});
		this.controls.addButton({type: "rewind", position: 8, identifier: "Spin-"});
	
		this.controls.finishedAddingControls();
		
		
     
                },
	
	         /*  event: function animate() {
					
             setTimeout( function() {
        requestAnimationFrame( animate );
    }, 1000 / 40 ); //=25fps I think
    renderer.render(scene, camera);
	controls.update();
		
},*/
 load: function(date) {
    },

    draw: function(date) {
		this.orbitControls.update();
		
        this.renderer.render(this.scene, this.camera);
    },

    resize: function(date) {
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;
        this.renderer.setSize(this.width, this.height);

        this.refresh(date);
    },

    event: function(eventType, position, user_id, data, date) {
        if(eventType==="pointerPress" && (data.button==="left")) {
            this.orbitControls.mouseDown(position.x,position.y,0);
			this.dragging=true;
            this.refresh(date);
        }
		
		else if (eventType==="pointerMove" && this.dragging)
		{
			this.orbitControls.mouseMove(position.x,position.y);
			this.refresh(date);
		}
		
		else if (eventType === "pointerRelease" && (data.button === "left")) {
				this.dragging = false;
			}
		
		
		else if (eventType==="widgetEvent")
		{
			console.log(data);
			switch (data.identifier) {
				
				   // this.controls.addButton({type: "fastforward", position: 7, identifier: "Spin+"});
		// this.controls.addButton({type: "rewind", position: 8, identifier: "Spin-"});
			
			case "ZoomIn":
						
						this.orbitControls.scale(100);
						break;
			case "ZoomOut":
						this.orbitControls.scale(-100);
						break;
            case "Spin+":
		             	this.speed++;
						this.orbitControls.autoRotateSpeed = this.speed;
						break;
            case "Spin-":
						this.speed--;
						this.orbitControls.autoRotateSpeed = this.speed;
						break;						
			default:
						console.log("No handler for:", data.identifier);
						return;
			
			}
			
			this.refresh(date);
		}
    }
});
