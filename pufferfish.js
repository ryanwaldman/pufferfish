
//canvas variables
var canvas;
var context;
var length;
var width;
var ringCount;
var ringRad;
var ellipseCount;
var centerX;
var centerY;

function pageInit(){
	canvas = document.getElementById('pufferGrid');
	if (canvas.getContext){
		context = canvas.getContext('2d');
		centerX = canvas.width/2.0;
		centerY = canvas.height/2.0;
		ringCount = parseInt(document.getElementById("ringCount").value);
		updateController(ringCount);
		drawCanvas();
	}
	
}

function updateController(ringCount){
	var controllerDiv = document.getElementById("ringController");
	controllerDiv.innerHTML="";
	for (var i=1;i<=ringCount;i++){
		controllerDiv.innerHTML+="<p><b>Ring "+i+"</b>"
		var lenLab = document.createElement("LABEL");
		lenLab.setAttribute("for","length"+i);
		lenLab.innerHTML = "Length";
		controllerDiv.appendChild(lenLab);
		controllerDiv.innerHTML+="&nbsp;&nbsp;"
		var lenEl = document.createElement("INPUT");
		lenEl.setAttribute("type","number");
		lenEl.setAttribute("min",1);
		lenEl.setAttribute("max",100);
		lenEl.setAttribute("step",1);
		lenEl.setAttribute("value",40);
		lenEl.setAttribute("id","length"+i);
		controllerDiv.appendChild(lenEl);
		
		controllerDiv.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;"

		var widLab = document.createElement("LABEL");
		widLab.setAttribute("for","width"+i);
		widLab.innerHTML = "Width";
		controllerDiv.appendChild(widLab);
		controllerDiv.innerHTML+="&nbsp;&nbsp;"
		var widEl = document.createElement("INPUT");
		widEl.setAttribute("type","number");
		widEl.setAttribute("min",1);
		widEl.setAttribute("max",100);
		widEl.setAttribute("step",1);
		widEl.setAttribute("value",10+5*(i-1));
		widEl.setAttribute("id","width"+i);
		controllerDiv.appendChild(widEl);

		controllerDiv.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

		var ellCountLab = document.createElement("LABEL");
		ellCountLab.setAttribute("for","ellipseCount"+i);
		ellCountLab.innerHTML = "Number of ellipses";
		controllerDiv.appendChild(ellCountLab);
		var ellCountEl = document.createElement("INPUT");
		ellCountEl.setAttribute("type","number");
		ellCountEl.setAttribute("min",1);
		ellCountEl.setAttribute("max",50);
		ellCountEl.setAttribute("step",1);
		ellCountEl.setAttribute("value",20);
		ellCountEl.setAttribute("id","ellipseCount"+i);
		controllerDiv.appendChild(ellCountEl);

		controllerDiv.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

		var radLab = document.createElement("LABEL");
		radLab.setAttribute("for","ringRad"+i);
		radLab.innerHTML = "Radius";
		controllerDiv.appendChild(radLab);
		controllerDiv.innerHTML+="&nbsp;&nbsp;"
		var radEl = document.createElement("INPUT");
		radEl.setAttribute("type","number");
		radEl.setAttribute("min",20);
		radEl.setAttribute("max",300);
		radEl.setAttribute("step",1);
		radEl.setAttribute("value",60*i);
		radEl.setAttribute("id","ringRad"+i);
		controllerDiv.appendChild(radEl);

		controllerDiv.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;"

		var offsetLab = document.createElement("LABEL");
		offsetLab.setAttribute("for","offset"+i);
		offsetLab.innerHTML = "Offset angle";
		controllerDiv.appendChild(offsetLab);
		controllerDiv.innerHTML+="&nbsp;&nbsp;"
		var offsetEl = document.createElement("INPUT");
		offsetEl.setAttribute("type","number");
		offsetEl.setAttribute("min",0);
		offsetEl.setAttribute("max",360);
		offsetEl.setAttribute("step",1);
		offsetEl.setAttribute("value",10*(i-1));
		offsetEl.setAttribute("id","offset"+i);
		controllerDiv.appendChild(offsetEl);

		controllerDiv.innerHTML+="&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"

		var colorEl = document.createElement("INPUT");
		colorEl.setAttribute("type","color");
		if (0&&i==1){
			colorEl.setAttribute("value",'#000000');
		}
		else{
			var r = parseInt(Math.sin(0.4*i)*127+128);
			var g = parseInt(Math.sin(0.4*i+2)*127+128);
			var b = parseInt(Math.sin(0.4*i+4)*127+128);
			colorEl.setAttribute("value",rgb2hex(r,g,b));
		}
		colorEl.setAttribute("id","ellipseColor"+i);
		controllerDiv.appendChild(colorEl);
		var colorLab = document.createElement("LABEL");
		colorLab.setAttribute("for","ellipseColor"+i);
		colorLab.innerHTML = "Color";
		controllerDiv.appendChild(colorLab);

		controllerDiv.innerHTML+="</p>"
	}
}


function resetCanvas() {
	if (canvas.getContext){
		context.clearRect(0,0, canvas.width, canvas.height);
	}
}


function drawCanvas(){
		context.clearRect(0,0, canvas.width, canvas.height);
		var rotation;
		for (var rings = ringCount;rings>0;rings--){
			var width = parseInt(document.getElementById("width"+rings).value);
			var length = parseInt(document.getElementById("length"+rings).value);
			var ellipseCount = parseInt(document.getElementById("ellipseCount"+rings).value);
			var ringRad = parseInt(document.getElementById("ringRad"+rings).value);
			var offset = parseInt(document.getElementById("offset"+rings).value);
			var color = document.getElementById("ellipseColor"+rings).value;
			for (var i=0;i<ellipseCount;i++){
				rotation = (i/ellipseCount)*2*Math.PI+(offset*Math.PI)/(180.0);
				safeDraw(drawellipse,ringRad,rotation,length,width,color);
			}
		}
}

function safeDraw(drawFcn){
	context.save();
	drawFcn.apply(this,Array.prototype.slice.call(arguments,1));
	context.restore();
}

function drawellipse(ringRad,rotation,length,width,color){
	context.globalCompositeOperation = 'destination-over';
	context.translate(canvas.width / 2, canvas.height / 2);
	context.rotate(rotation);
	context.scale(1,width/length);
	var grd=context.createRadialGradient(ringRad,0,0,ringRad,0,length);
	grd.addColorStop(0,color);
	grd.addColorStop(1,"white");
	//grd.addColorStop(1,hex2rgba(color,0));
	//grd.addColorStop(1,hex2rgba("#FFFFFF",0));
	context.beginPath();
	context.ellipse(ringRad,0, length, length, 0, 0, 2*Math.PI);
	context.fillStyle=grd;
	context.fill();
}


function rgb2hex(r,g,b){
	return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hex2rgba(hex,a){
	if (hex.charAt(0)=="#"){
		hex=hex.substring(1,7);
	}
	return "rgba("+parseInt(hex.substring(0,2),16)+","+parseInt(hex.substring(2,4),16)+","+parseInt(hex.substring(4,6),16)+","+a+")"
}