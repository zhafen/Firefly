function clearPartsMesh(pClear = params.partsKeys) {
	for (var i=0; i<pClear.length; i++){
		var p = pClear[i];

		params.partsMesh[p].forEach( function( e, i ) {
			e.geometry.dispose();
			params.scene.remove( e );

		} );

		params.partsMesh[p] = [];

	}
}

function drawScene(pdraw = params.partsKeys)
{
	clearPartsMesh(pClear = pdraw);
	console.log("drawing", pdraw, params.plotNmax,params.decimate)

	//d3.select("#splashdiv5").text("Drawing...");
	params.drawfrac = 0.;
	var ndraw = 0.;
	var ndiv = Math.round(params.parts.totalSize / 10.);

	//params.octree = new THREE.Octree({scene:params.scene});

	for (var i=0; i<pdraw.length; i++){
		var p = pdraw[i];
		
		params.scene.remove(params.partsMesh[p]);

		params.partsMesh[p] = [];
	
		var material = new THREE.ShaderMaterial( {

			uniforms: { //add uniform variable here
				color: {value: new THREE.Vector4( params.Pcolors[p][0], params.Pcolors[p][1], params.Pcolors[p][2], params.Pcolors[p][3])},
				oID: {value: 0},
				SPHrad: {value: params.parts[p].doSPHrad},
				uVertexScale: {value: params.PsizeMult[p]},
				maxDistance: {value: params.boxSize},
				cameraY: {value: [0.,1.,0.]},
				cameraX: {value: [1.,0.,0.]},
				velType: {value: 0.},
<<<<<<< HEAD
				texture: {value: params.texture},
				colormap: {value: params.colormap[p]},
				showcolormap: {value: params.showColorMap[p]},
				min: {value: params.colormapVals[p][params.ckeys[p][params.colormapVariable[p]]][0]},
				max: {value: params.colormapVals[p][params.ckeys[p][params.colormapVariable[p]]][1]}
=======
				columnDensity: {value: params.columnDensity},
				scaleCD: {value: params.scaleCD},
>>>>>>> upstream/master
			},

			vertexShader: myVertexShader,
			fragmentShader: myFragmentShader,
			depthWrite:false,
			depthTest: false,
			transparent:true,
			alphaTest: false,
			blending:THREE.AdditiveBlending,
		} );

		//geometry
		//var geo = new THREE.Geometry();
		var geo = new THREE.BufferGeometry();

		// attributes
		//positions
		var positions = new Float32Array( params.plotNmax[p] * 3 ); // 3 vertices per point
		geo.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );

		//radiusScaling (e.g., for filtering and on/off)
		var radiusScale = new Float32Array( params.plotNmax[p] ); 
		geo.addAttribute( 'radiusScale', new THREE.BufferAttribute( radiusScale, 1 ) );

		//alphas (e.g., for filtering and on/off)
		var alpha = new Float32Array( params.plotNmax[p] ); 
		geo.addAttribute( 'alpha', new THREE.BufferAttribute( alpha, 1 ) );

		//angles for velocities
		var velVals = new Float32Array( params.plotNmax[p] * 4); // unit vector (vx, vy, vz), scaled magnitude
		geo.addAttribute( 'velVals', new THREE.BufferAttribute( velVals, 4 ) );

		geo.setDrawRange( 0, params.plotNmax[p] );

		var mesh = new THREE.Points(geo, material);
		params.scene.add(mesh);

		// create array to hold colormap variable values
		var colormapVariable_array = new Float32Array( params.plotNmax[p]); 
		geo.addAttribute('ColorMapVariable_Array', new THREE.BufferAttribute( colormapVariable_array, 1));

		//var positions = mesh.geometry.attributes.position.array;
		var index = 0;
		var pindex = 0;
		var vindex = 0;
<<<<<<< HEAD
=======
		var rindex = 0;
		var aindex = 0;
>>>>>>> upstream/master

		var includePoint = true;
		//for (var j=0; j<params.parts[p].Coordinates.length/params.decimate; j++){
		for (var j=0; j<params.plotNmax[p]; j++){

			includePoint = true;
			//if we redraw upon filtering, then we would include the filtering here 
			// for (k=0; k<params.fkeys[p].length; k++){
			// 	if (params.parts[p][params.fkeys[p][k]] != null) {
			// 		val = params.parts[p][params.fkeys[p][k]][j]; 
			// 		if ( val < params.filterVals[p][params.fkeys[p][k]][0] || val > params.filterVals[p][params.fkeys[p][k]][1] ){
			// 			includePoint = false;
			// 		} 
			// 	}
			// }

			if (includePoint){

				//geo.vertices.push(new THREE.Vector3(params.parts[p].Coordinates[j][0], params.parts[p].Coordinates[j][1], params.parts[p].Coordinates[j][2] ))
				
				positions[pindex] = params.parts[p].Coordinates[j][0];
				pindex++;
				positions[pindex] = params.parts[p].Coordinates[j][1];
				pindex++;
				positions[pindex] = params.parts[p].Coordinates[j][2];
				pindex++;

				if (params.parts[p].Velocities != null){
					velVals[vindex] = params.parts[p].VelVals[j][0]/params.parts[p].magVelocities[j];
					vindex++;
					velVals[vindex] = params.parts[p].VelVals[j][1]/params.parts[p].magVelocities[j];
					vindex++;
					velVals[vindex] = params.parts[p].VelVals[j][2]/params.parts[p].magVelocities[j];
					vindex++;
					velVals[vindex] = params.parts[p].NormVel[j];
					vindex++;
				}

<<<<<<< HEAD
				// fill colormap array with appropriate variable values
				if (params.colormap[p] > 0.){
					if (params.parts[p][params.ckeys[p][params.colormapVariable[p]]] != null){
						colormapVariable_array[index] = params.parts[p][params.ckeys[p][params.colormapVariable[p]]][j];
					}
				}

				alphas[index] = 1.;
				index++;
=======
				radiusScale[rindex] = 1.;
				rindex++;
				
				alpha[rindex] = 1.;
				aindex++;
>>>>>>> upstream/master
				
				ndraw += 1;
				if (ndraw % ndiv < 1 || ndraw == params.parts.totalSize){
					params.drawfrac = (1 + ndraw/params.parts.totalSize)*0.5;
					//updateDrawingBar();
				}
			}
		}

		mesh.position.set(0,0,0);

		params.partsMesh[p].push(mesh)
		//params.octree.add( mesh, { useVertices: true } );
	}

	//this will not be printed if you change the N value in the slider, and therefore only redraw one particle type
	//because ndraw will not be large enough, but I don't think this will cause a problem
	//if (ndraw >= Math.floor(params.parts.totalSize/params.decimate)){
		console.log("done drawing")
		clearloading();

	//}

}
