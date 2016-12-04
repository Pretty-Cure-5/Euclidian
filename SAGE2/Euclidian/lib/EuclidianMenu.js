
menugui: function(data)   {
	   
	this.menu = document.createElement('div'); 
	this.menu.className = "menuEuclidian";
    this.menu.style.position = "absolute";
	this.menu.style.width    = "250px";
	this.menu.style.height   = "300px";
	this.menu.style.top      = "10px";
	this.menu.style.left     = "30px";
	this.menu.style.backgroundColor = "rgba(200,215,205,0.9)";
	this.menu.style.border   = "none";
	this.menu.style.zIndex   = "1000";
	this.menu.dragging       = true;
	this.menu.style.display = "none";

	this.title = document.createElement("H1");
	this.title.style.position = "relative";
	this.title.style.left ="20px";
	this.title.style.color = "rgba(2,5,5,3)";
	this.title.text = document.createTextNode("Euclidian Menu");
	this.title.appendChild(this.title.text);
	this.menu.appendChild(this.title);
	
	var options =["Load","Save","Reset","Solid", "non-Solid"]
	
	for(var m=0;m<6;m++){
		
	this.option = document.createElement("H2");
	this.option.style.position = "relative";
	this.option.style.left     = "20px";
	this.option.style.border   = "2px solid #0000FF";
	this.option.style.top      = "3px";
	this.option.style.left     = "5px";
	this.option.style.color    = "rgba(2,5,5,3)";
	this.option.text = document.createTextNode(options[m]);
	this.option.appendChild(this.option.text);
	this.menu.appendChild(this.option);
			
		
	}
	 this.element.appendChild(this.menu);
	 	console.log("the menu has loaded");
   },
   
   
   
    
	