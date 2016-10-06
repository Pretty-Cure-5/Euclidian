"use strict";

/* global THREE */

/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class Euclidian_PointCloud
 */
var Euclidian_PointCloud = SAGE2_WebGLApp.extend({
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
        var farPlane=3000;
        var cameraZ=farPlane/3;
        var fogHex=0x000000;
        var fogDensity=0.5007;
        this.materials=[];
        this.particles=null;
        this.mouseX=0;
        this.mouseY=0;
        this.dragging=false;
        this.camera   = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        this.scene    = new THREE.Scene();
        this.scene.fog=new THREE.FogExp2(fogHex, fogDensity);
        this.geometry=new THREE.Geometry();

        this.dataxyz = datamenuXYZ[0];
        this.particleCount=Object.keys(this.dataxyz).length;

        //this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 1, 5000);
        //camera postitions
                this.posX = this.camera.position.x + 0;
                this.posY = this.camera.position.y + 0;
                this.posZ = this.camera.position.z + 0;
	
	            this.camera.position.set(this.posX, this.posY, this.posZ);
				
				this.camera.position.set(0,200,-500);
				this.camera.lookAt(20, 20, 20);
				//this.camera.lookAt(this.scene.position);

        //controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
		this.orbitControls.maxPolarAngle = Math.PI / 2;
		this.orbitControls.minDistance = 0;
		this.orbitControls.maxDistance = 5000;
		this.orbitControls.autoRotate  = true;
		this.orbitControls.zoomSpeed   = 1.0;
		this.speed = 0;
		this.orbitControls.autoRotateSpeed = this.speed; 
        //Scene
         this.scene = new THREE.Scene();
		var coOef =100;
		var big=0;
		 //adding floor
		        var floorspace = new THREE.BoxGeometry(coOef*3.5, 0, coOef*2.5);
		        var floorcolor = new THREE.Color("#E7FEFF");
	            var floorMaterial = new THREE.MeshBasicMaterial({color: floorcolor});
		        var floor = new THREE.Mesh(floorspace, floorMaterial);
		
		        floor.castShadow = false;
	            floor.position.x = 0; 
		        floor.position.y = 0;
		        floor.position.z = 0;
		        this.scene.add(floor);

        for (var i=0;i<this.particleCount;i++) {
            //console.log(i);
            var coOrd=this.dataxyz[i];
            var vertex = new THREE.Vector3();
			this.vertexTop = new THREE.Vector3();
			this.vertexBottom = new THREE.Vector3();
			
			
			vertex.x = coOrd[0] * coOef;
            vertex.y = (coOrd[2] * coOef-coOef*2.5)*-1;
            vertex.z = coOrd[1] * coOef;
			
			
            this.vertexTop.x = vertex.x;
            this.vertexTop.y = vertex.y*.999;
            this.vertexTop.z = vertex.z;
			
			
			
			this.vertexBottom.x = vertex.x;
            this.vertexBottom.y = vertex.y*1.01;
            this.vertexBottom.z = vertex.z;
			
			
           
		var Y=vertex.y;
		var X=vertex.x;
        var Z=vertex.z;		
		if (i>2){
		var OLDY= (this.dataxyz[i-1][2]*coOef-(coOef*2.5))*-1;
		var OLDX= (this.dataxyz[i-1][0]*coOef);
		var OLDZ= (this.dataxyz[i-1][1]*coOef);
		}
		if (i<this.particleCount-1){
		var NEWY= (this.dataxyz[i+1][2]*coOef-(coOef*2.5))*-1;
		var NEWX= (this.dataxyz[i+1][0]*coOef);
		var NEWZ= (this.dataxyz[i+1][1]*coOef);
		}
		
		var hexString=0x00308F;
		
		
		if (Y<coOef*.37){
		hexString=0x00308F;
	    }
		else if (Y<coOef*.50){
		hexString=0x008000;
		}
		else if (Y<coOef*.70){
		hexString=0xFAEA00;
		}
		else if (Y<coOef*5){
		hexString=0x008000;
		}
		
		if ((Y+2<OLDY||Y-2>NEWY)&&(X+1<OLDX||X-1>NEWX&&Z+1<OLDZ||Z-1>NEWZ)){
			
			hexString=0xAA007F;
		}
			
			if(X+1<OLDX&&X-1>NEWX||Z+1<OLDZ&&Z-1>NEWZ){
				
				hexString=0xE7FEFF;
			}
			
			
		
		   
		   var vertexColor = new THREE.Color(hexString);
		   
		   

            var limit1=100;
            var limit2=5;
			
			
            if((vertex.y>limit2)&&(vertex.y<limit1)) {
				
				if (coOrd[2]<big){
					
					big = coOrd[2];
					
				}
				 this.geometry.vertices.push(this.vertexTop);
				 this.geometry.colors.push(vertexColor);
				  this.geometry.vertices.push(this.vertexBottom);
				  this.geometry.colors.push(vertexColor);
                this.geometry.vertices.push(vertex);
				this.geometry.colors.push(vertexColor);
				
				if(Y<coOef*1.1){
					var TG=0;
				while (Y>0){
					var vertexToground = "vtx"+TG;
					TG++;
					Y=Y-(coOef*.02);
					this.vertexToground= new THREE.Vector3();
					this.vertexToground.x=vertex.x;
					this.vertexToground.y= Y;
					this.vertexToground.z=vertex.z;
					this.geometry.vertices.push(this.vertexToground);
				    this.geometry.colors.push(vertexColor);
					
					
				}
				
				}
				
			
            }
			
		
			
        }


        console.log("the highest point is" + big );
        var Size = coOef*0.01;//this.parameters[i][1];
        
        this.particles = new THREE.PointCloud(this.geometry, new THREE.PointCloudMaterial({size: Size, vertexColors:true, opacity:0.7}));
       
		this.particles.rotation.x = 0;//Math.random() * 6;
        this.particles.rotation.y = 0;//Math.random() * 6;
        this.particles.rotation.z = 0;//Math.random() * 6;
        this.scene.add(this.particles);
		
        this.renderer = new THREE.WebGLRenderer();
		this.renderer.setClearColor(new THREE.Color(0xc0c0c0,1.0));//0xC0C0C0
        this.renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
		
		this.controls.addButton({type: "fastforward", position: 7, identifier: "Spin+"});
		this.controls.addButton({type: "rewind", position: 8, identifier: "Spin-"});
        this.controls.finishedAddingControls();
    },

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
			switch (data.identifier) {
			
			case "ZoomIn":
						
						this.orbitControls.scale(20);
						break;
			case "ZoomOut":
						this.orbitControls.scale(-20);
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
