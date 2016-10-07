"use strict";

/* global THREE */

/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class Euclidian30spin
 */
var EuclidianZoom_Drag = SAGE2_WebGLApp.extend({
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

        var dataxyz = xyz;
        var particleCount=Object.keys(dataxyz).length;

        //this.camera = new THREE.PerspectiveCamera(45, this.width/this.height, 1, 5000);
        this.camera.position.set(0,200,-500);

        //controls
        this.orbitControls = new THREE.OrbitControls(this.camera, this.element);
		this.orbitControls.maxPolarAngle = Math.PI / 2;
		this.orbitControls.minDistance = 200;
		this.orbitControls.maxDistance = 500;
		this.orbitControls.autoRotate  = true;
		this.orbitControls.zoomSpeed   = 0.1;
		this.orbitControls.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

        //Scene
        this.scene = new THREE.Scene();

        var coOef =100;

        for (var i=0;i<particleCount;i++) {
            //console.log(i);
            var coOrd=xyz[i];
            var vertex = new THREE.Vector3();
            vertex.x = coOrd[0] * coOef;
            vertex.y = coOrd[2] * coOef-(coOef*2.5);
            vertex.z = coOrd[1] * coOef;
           // console.log(dataxyz[i][0]);

            var limit1=0;
            var limit2=4;

            if(!(coOrd[2]<limit1||coOrd[2]>limit2)) {
                this.geometry.vertices.push(vertex);
            }
        }


        this.parameters = [
            [[1, 1, 0.5], .2],
            [[0.95, 1, 0.5], 4],
            [[0.90, 1, 0.5], 3],
            [[0.85, 1, 0.5], 2],
            [[0.80, 1, 0.5], 1]
        ];

        var parameterCount = this.parameters.length;
        var i=1;
        var color = this.parameters[i][0];
        var Size = 0.1;//this.parameters[i][1];
        this.materials[i] = new THREE.PointCloudMaterial({size: Size});
        this.particles = new THREE.PointCloud(this.geometry, this.materials[i]);
        this.particles.rotation.x = Math.random() * 6;
        this.particles.rotation.y = Math.random() * 6;
        this.particles.rotation.z = Math.random() * 6;
        this.scene.add(this.particles);
		this.camera.lookAt(this.scene.position);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        this.element.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, this.camera);
		this.controls.addButton({type: "zoom-in", position: 12, identifier: "ZoomIn"});
		this.controls.addButton({type: "zoom-out", position: 11, identifier: "ZoomOut"});
		
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
			default:
						console.log("No handler for:", data.identifier);
						return;
			
			}
			
			this.refresh(date);
		}
    }
});
