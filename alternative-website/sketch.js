
const runAnimation = true;
let disp, disp2, mouseX, mouseY;
let size = 100;
var runID;
var running = runAnimation;

window.onload = ()=>{
	disp = document.querySelector('#disp'); 
	disp2 = document.querySelector('#disp2'); 
	disp3 = document.querySelector('#disp3'); 
	disp4 = document.querySelector('#disp4'); 
	mouseX = 1000;
	mouseY = 500;
	window.onmousemove = function(event){
		mouseX = event.clientX;//+200;
		mouseY = event.clientY;//+100;
	}

	if(runAnimation){
	runID = window.setInterval(run, 25);
}
}


v1 = new Vector(0,0,0);
v2 = new Vector(1,0,0);
v3 = new Vector(1,0,1);
v4 = new Vector(0,0,1);
v5 = new Vector(0,1,0);
v6 = new Vector(1,1,0);
v7 = new Vector(1,1,1);
v8 = new Vector(0,1,1);

m = new Matrix(v1,v2,v3,v4,v5,v6,v7,v8)

m.transformation([[size,0,0,0],[0,size,0,0],[0,0,size,0],[0,0,0,1]]); // scale
m.transformation([[1,0,0,-size/2],[0,1,0,-size/2],[0,0,1,-size/2],[0,0,0,1]]);  //translate

let thetaz = 0.016, thetax = 0.018, thetay = 0.008;

zrotation = [[Math.cos(thetaz), -Math.sin(thetaz), 0, 0],
			[Math.sin(thetaz), Math.cos(thetaz), 0, 0],
			[0, 0, 1, 0],
			[0,0,0,1]];
xrotation = [[1,0,0,0],
			[0,Math.cos(thetax), -Math.sin(thetax), 0],
			[0, Math.sin(thetax), Math.cos(thetax), 0],
			[0,0,0,1]];
yrotation = [[Math.cos(thetay), 0, Math.sin(thetay), 0],
			[0, 1, 0, 0],
			[-Math.sin(thetay), 0, Math.cos(thetay), 0],
			[0,0,0,1]];

rotation = new Matrix(zrotation);
rotation.transformation(xrotation);
rotation.transformation(yrotation);


let f = 1.1;
let f2 = 1.2;


function startAnim(){
	if(!running){
		runID = window.setInterval(run, 20);
		running = true;
	}
}

function stopAnim(){
	clearInterval(runID);
	running = false;
}


function run(){
	f = (mouseX/innerWidth)*2; 
	f2 = (mouseY/innerHeight)*2; 
	
	m.transformation(rotation);
//	m.startChain();
    m.leftMultiply([[f, 0, 0, 1], [0, f2, 0, 1], [0, 0, 1, 1], [0,0,0,1]]); 
      // m.leftMultiply([[1,0,0,mouseX],[0,1,0,mouseY],[0,0,1,0],[0,0,0,1]]); 
	// m.leftMultiply([[0.5,0,0,0],[0,0.5,0,0],[0,0,0.5,0],[0,0,0,1]]); 
  //  m.stopChain();
	ascii();
}		


function ascii(){
	let scl = 0.3
	let e = 8;
	let str = '';
	for(let _y = 0; _y < 30; _y++){
		for(let _x = 0; _x < 60; _x++){

			let y = _y-15;		
			let x = _x-25;

		  	let drawpt = 0;

		  	var i = 0;
		  	var len = 4;
		  	for(i = 0; i < len; i++){ //top, bottom square edges
		  		let a = i; let b = ((i+1) != len) ? i+1 : i-3; 
		  		drawpt = drawpt | inline(x,y*2,m.x(a)*scl,m.y(a)*scl,m.x(b)*scl,m.y(b)*scl,e);
		  		if(i+1 == len && i < 7){len += 4;}
		  	}
		  	len = 4;
		  	for(i = 0; i <len; i++){ // connecting edges
		  		drawpt = drawpt | inline(x,y*2,m.x(i)*scl,m.y(i)*scl,m.x(i+4)*scl,m.y(i+4)*scl,e);
		  	}
	      				
			if(drawpt){ str += '*'; }else{ str += ' ' };

		}
		str += '\n';
	}  
	disp.innerHTML = str; 
	//disp2.innerHTML = str; 
}

//check point with determinant
function inline(px,py,ax,ay,bx,by,e){
	return ((px >= ax && px <= bx) || (px >= bx && px <= ax)) && 
	((py >= ay && py <= by) || (py >= by && py <= ay)) && 
	(Math.abs(((bx - ax) * (py - ay) - (px - ax) * (by - ay))) < e);
}