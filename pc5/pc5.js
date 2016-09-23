// SAGE2 is available for use under the SAGE2 Software License
//
// University of Illinois at Chicago's Electronic Visualization Laboratory (EVL)
// and University of Hawai'i at Manoa's Laboratory for Advanced Visualization and
// Applications (LAVA)
//
// See full text, terms and conditions in the LICENSE.txt included file
//
// Copyright (c) 2015

//
// original SAGE implementation: Luc Renambot
// contributed by Garry Keltie
//     garry.keltie@gmail.com
//


"use strict";

/* global THREE */


/**
 * WebGL 3D application, inherits from SAGE2_WebGLApp
 *
 * @class pc5
 */
var pc5 = SAGE2_WebGLApp.extend({

		init: function(data) {
		this.SAGE2Init("div", data);

		this.resizeEvents = "continuous";
		
		this.element.id = "div" + data.id;
		this.frame  = 0;
		this.width  = this.element.clientWidth;
		this.height = this.element.clientHeight;
		
		var fieldOfView=75;
		var aspectRatio=this.width/this.height;
		var nearPlane=1;
		var farPlane=3000;
		var cameraZ=farPlane/3;
		var fogHex=0x000000;
		var fogDensity=0.0007;
		var materials=[];
		this.particles=null;
		this.mouseX=0;
		this.mouseY=0;
		
		this.camera   = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
		this.scene    = new THREE.Scene();
		this.scene.fog=new THREE.FogExp2(fogHex, fogDensity);
		this.geometry=new THREE.Geometry();
		
		var mydata=JSON.parse(data);
		var particleCount=Object.keys(mydata).length;
		
		for (var i=0;i<particleCount;i++)
		{
			var coOrd=mydata[i].DP.split(",");
			var vertex = new THREE.Vector3();
			vertex.x = Math.abs(coOrd[0]) * Math.random()*500 - 1000;
			vertex.y = Math.abs(coOrd[1]) * Math.random()*500 - 1000;
			vertex.z = Math.abs(coOrd[2]) * Math.random()*500 - 1000;
			this.geometry.vertices.push(vertex);
		}
		
		 this.parameters = [
            [
                [1, 1, 0.5], 5
            ],
            [
                [0.95, 1, 0.5], 4
            ],
            [
                [0.90, 1, 0.5], 3
            ],
            [
                [0.85, 1, 0.5], 2
            ],
            [
                [0.80, 1, 0.5], 1
            ]
        ];
		
		var parameterCount = this.parameters.length;
		
		 for (var i = 0; i < parameterCount; i++) {

            var color = this.parameters[i][0];
            var size = this.parameters[i][1];

            materials[i] = new THREE.PointCloudMaterial({
                size: size
            });

            this.particles = new THREE.PointCloud(geometry, materials[i]);

            this.particles.rotation.x = Math.random() * 6;
            this.particles.rotation.y = Math.random() * 6;
            this.particles.rotation.z = Math.random() * 6;

            this.scene.add(this.particles);
        }
		
		
		this.renderer = new THREE.WebGLRenderer();
		
		
		this.renderer.setSize(this.width, this.height);

		this.element.appendChild(this.renderer.domElement);
		
		
		this.renderer.render(this.scene, this.camera);
		this.controls.finishedAddingControls();
	},

	load: function(date) {
	},

	draw: function(date) {
		var time=this.t*0.0005;
		this.camera.position.x +=(this.mouseX-this.camera.position.x)*0.05;
		this.camera.position.y +=(this.mouseY-this.camera.position.y)*0.05;
		this.camera.lookAt(this.scene.position);
		for (var i=0;i<this.scene.children.length;i++)
		{
			var object=this.scene.children[i];
			if (object instanceof THREE.PointCloud)
			{
				object.rotatoin.y=time*(i < 4 ? i + 1 : -(i + 1));
			}
		}
		
		for (var i = 0; i <this.materials.length; i++) {

            var color = this.parameters[i][0];

            var h = (360 * (color[0] + time) % 360) / 360;
            this.materials[i].color.setHSL(h, color[1], color[2]);
        }

		
		this.renderer.render(this.scene, this.camera);
	},

	resize: function(date) {
		this.width  = this.element.clientWidth;
		this.height = this.element.clientHeight;
		this.renderer.setSize(this.width, this.height);

		this.refresh(date);
	},

	event: function(eventType, position, user_id, data, date) {
		//this.refresh(date);
	}
	
	
	

});