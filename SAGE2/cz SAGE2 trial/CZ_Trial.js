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
 * @class car_threejs
 */
var CZ_Trial = SAGE2_WebGLApp.extend({

        init: function(data) {
        this.SAGE2Init("div", data);

        this.resizeEvents = "continuous";

        this.element.id = "div" + data.id;
        this.frame  = 0;
        this.width  = this.element.clientWidth;
        this.height = this.element.clientHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.camera   = new THREE.PerspectiveCamera(45.0, this.width / this.height, 0.1, 10000.0);
        this.scene    = new THREE.Scene();

        this.camera.position.z=300;
        this.renderer.setSize(this.width, this.height);

        this.element.appendChild(this.renderer.domElement);

        /*var planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1);
        var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
        this.plane = new THREE.Mesh(planeGeometry, planeMaterial);


        // rotate and position the plane
        this.plane.rotation.x = -0.5 * Math.PI;
        this.plane.position.x = 15;
        this.plane.position.y = 0;
        this.plane.position.z = 0;

        // add the plane to the scene
        this.scene.add(this.plane);*/
        var cubeGeometry = new THREE.BoxGeometry(50, 50, 50);
        var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        this.cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

        // position the cube
        this.cube.position.x = -10;
        this.cube.position.y = 3;
        this.cube.position.z = 0;

        // add the cube to the scene
        this.scene.add(this.cube);

        var sphereGeometry = new THREE.SphereGeometry(20, 20, 20);
        var sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff});
        this.sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

        // position the sphere
       /* this.sphere.position.x = 20;
        this.sphere.position.y = 0;
        this.sphere.position.z = 2;*/
        this.scene.add(this.sphere);

        this.ambientLight = new THREE.AmbientLight(0x0c0c0c);
        this.scene.add(this.ambientLight);

        // add spotlight for the shadows
        this.spotLight = new THREE.SpotLight(0xffffff);
        this.spotLight.position.set(10, 50, 130);

        this.scene.add(this.spotLight);




        this.scene.add(this.camera);


        this.renderer.render(this.scene, this.camera);
        this.controls.finishedAddingControls();
    },

    load: function(date) {
    },

    draw: function(date) {
        /*var amplitude = 50;
        var period    = 2.0; // in sec
        var centerY   = 0;*/
        var step=0;

        step =this.t+ 0.04;
            this.sphere.position.x = 20 + ( 10 * (Math.cos(step)));
            this.sphere.position.y = 2 + ( 10 * Math.abs(Math.sin(step)));
        this.cube.rotation.x=0.02+this.t;
        this.cube.rotation.y=0.02+this.t;
        this.cube.rotation.z=0.02+this.t;
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
