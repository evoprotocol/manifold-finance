

// always creates a vector in R4:
function Vector(x, y, z, w){
	this.list = [0,0,0,1]; // w component = 1 
	let fromArray = false;
	if(x instanceof Array){ 
		fromArray = true;
		this.list = x; 
		while(this.list.length < 4){
			this.list.push(0);
			if(this.list.length === 4){
				this.list[3] = 1;
			}
		}	
	}

	if(x != undefined && !fromArray){ this.list[0] = x; }
	this.x = this.list[0];

	if(y != undefined && !fromArray){ this.list[1] = y; }
	this.y = this.list[1];	

	if(z != undefined && !fromArray){ this.list[2] = z; }
	this.z = this.list[2];

	if(w != undefined && !fromArray){ this.list[3] = w; }
	this.w = this.list[3];

	this.dot = function(v){
	 	let d = null;
	 	for(let i = 0; i < this.list.length; i++){
	 		d += this.list[i] * v.list[i];
	 	}
	 	return d;
	}
	
}

class Matrix{

	constructor(m){
		this.chain = false;
		this.rows = [];
		this.cols = [];
		this.tcols = []; //< non-accumulating transormation result
		this.r = 0;
		this.c = 0;
		if(arguments.length > 1){
			Array.from(arguments).forEach((v)=>{
				this.addVector(v);
			});		
		}else if(arguments.length === 1){
			this.fromRowArray(arguments[0]); 	
		}
	}

	fromRowArray(m){
		this.rows = [];
		this.cols = [];
		this.tcols = [];
		this.r = m.length;
		this.c = m[0].length;
		for(let i = 0; i < this.c; i++){
			this.cols.push([]);
			this.tcols.push([]);
		}
		m.forEach((el)=>{
			this.rows.push(el);
			for(let i = 0; i < this.c; i++){
				this.cols[i].push(el[i]);
				this.tcols[i].push(el[i]);
			}
		})
	}

	getRowMatrix(){
		return this.rows;
	}

	getColMatrix(){
		return this.cols;
	}

	getresultColMatrix(){
		return this.tcols;
	}

	startChain(){
		this.chain = true;
	}

	stopChain(){
		this.chain = false;
	}

	// same as columns if nothing multiplied
	x(i){
		return this.tcols[i][0];
	}
	y(i){
		return this.tcols[i][1];
	}
	z(i){
		return this.tcols[i][2];
	}

	multiply(m){ 
		let n = [];
		if(m.r){  
			//if Matrix obj:
			for (let i = 0; i < this.r; i++) {
					n.push([]);
				for (let j = 0; j < m.c; j++) {
					n[i][j] = this.dot(this.rows[i], m.cols[j]);
					this.tcols[j][i] = n[i][j];
				}
			}
			return n;
		}
		// if row: array (cols not precomputed)
		this.tcols = [];	
		for (let i = 0; i < m[0].length; i++) {
				this.tcols.push([]);
			  for (let j = 0; j < m.length; j++) {
			  	this.tcols[i].push(m[j][i]);
			  }
		}

		for (let i = 0; i < this.r; i++) {
			n.push([]);
			for (let j = 0; j < m[0].length; j++) {
				n[i][j] = this.dot(this.rows[i], this.tcols[j]);
				this.tcols[j][i] = n[i][j];
			}
		 }	
		return n;		

	}

	leftMultiply(m, save){ 
		let n = [], cols = [];
		if(m.r){  
			// if Matrix obj
			for(let i = 0; i < this.c; i++){cols.push([]);}

			for(let i = 0; i < m.r; i++) {
					n.push([]);
				for (let j = 0; j < this.c; j++) {
					n[i][j] = this.chain ? this.dot(m.rows[i], this.tcols[j]) : this.dot(m.rows[i], this.cols[j]);
					cols[j][i] = n[i][j];
				}
			}
			this.tcols = cols;
			if(save){this.rows = n; this.cols = cols;}
			return n;
		}
		// if row array
		for(let i = 0; i < this.c; i++){cols.push([]);}

		for (let i = 0; i < m.length; i++) {
				n.push([]);
			for (let j = 0; j < this.c; j++) {
				n[i][j] = this.chain ? this.dot(m[i], this.tcols[j]) : this.dot(m[i], this.cols[j]);
				cols[j][i] = n[i][j];
			}
		}	
		this.tcols = cols;
		if(save){this.rows = n; this.cols = cols;}
		return n;
	}

	transformation(m){  
		this.leftMultiply(m, true);
	}

	transform(m){
		m.transformation(this);
	}

	addVector(v){
		if(v.list){v = v.list;}

		if(this.r === 0){
			this.cols.push(v); 
			this.tcols.push(v);
			this.r = v.length;
			this.c++;
			for (let i = 0; i < this.r; i++) {
				this.rows.push([]);
			}
		}else if(v.length === this.r){
			this.cols.push(v); 
			this.tcols.push(v);
			this.c++;
		}

		for (var i = 0; i < this.r; i++) {
			this.rows[i].push(this.cols[this.c-1][i]);
		}			
	}

	dot(a1,a2){
		return a1[0]*a2[0] + a1[1]*a2[1] + a1[2]*a2[2] + a1[3]*a2[3];
	}

}