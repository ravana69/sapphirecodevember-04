
		var renderer, scene, camera;
		var sapphiresapphiresapphire, uniforms;
		var displacement, noise;

    const TEXTURE_PATH = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/1037366';

		init();
		animate();

		function init() {

			camera = new THREE.PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 10000 );
			camera.position.z = 400;

			scene = new THREE.Scene();
      loader = new THREE.TextureLoader();
      loader.setCrossOrigin( 'https://s.codepen.io' );

			uniforms = {

				amplitude: { value: 1 },
				color:     { value: new THREE.Color( 0x00d8ff) },
				texture:   { value: loader.load( TEXTURE_PATH + '/textture.jpg' ) }

			};

			uniforms.texture.value.wrapS = uniforms.texture.value.wrapT = THREE.RepeatWrapping;

			var shaderMaterial = new THREE.ShaderMaterial( {

				uniforms: uniforms,
				vertexShader:document.getElementById( 'vertexshader' ).textContent,
				fragmentShader: document.getElementById( 'fragmentshader' ).textContent

			});


			var geometry = new THREE.TorusBufferGeometry( 1, 10, 400, 4 );

			displacement = new Float32Array( geometry.attributes.position.count );
			noise = new Float32Array( geometry.attributes.position.count );

			for ( var i = 0; i < displacement.length; i ++ ) {

				noise[ i ] = Math.random() * 10;

			}

			geometry.addAttribute( 'displacement', new THREE.BufferAttribute( displacement, 1 ) );

			sapphire = new THREE.Mesh( geometry, shaderMaterial );
      sapphire.scale.x = 0.07;
      sapphire.scale.y = 0.11;
      sapphire.scale.z = 0.07;
      sapphire.position.y = 4.5;

			scene.add( sapphire );

      renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setClearColor( 0x000000, 0 );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
      camera.lookAt(sapphire.position);

			var container = document.getElementById( 'sapphire' );
			container.appendChild( renderer.domElement );

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		function animate() {

			requestAnimationFrame( animate );

			render();

		}

		function render() {

			var time = Date.now() * 0.002;

			sapphire.rotation.y = sapphire.rotation.y = 0.2 * time;

			uniforms.amplitude.value = 3 * Math.sin( sapphire.rotation.y * 0.15 );
			//uniforms.color.value.offsetHSL( 0.00001, 0.5, 0 );

			for ( var i = 0; i < displacement.length; i ++ ) {

				displacement[ i ] = Math.sin( 0.15 * i + time );

				noise[ i ] += 2 * ( 2 - Math.random() );
				noise[ i ] = THREE.Math.clamp( noise[ i ], -15, 15 );

				displacement[ i ] += noise[ i ];

			}

			sapphire.geometry.attributes.displacement.needsUpdate = true;

			renderer.render( scene, camera );

		}
