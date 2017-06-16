class SceneManager
{
    constructor()
    {
        this.container;
        this.scene;
        this.controls;
        this.stats;
        this.camera;
        this.renderer;
        this.keyboard = new THREEx.KeyboardState();
        this.clock = new THREE.Clock();
        this.size;
        this.expression;
        this.m_wireframe = 0;
        this.polygonizer = new Polygonizer();
        this.gui;
        this.guiText;
        this.m_meshes = [];
        this.m_lights = [];
        this.shading;
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    init()
    {
    	// SCENE
    	this.scene = new THREE.Scene();
    	// CAMERA
    	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
    	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
    	this.camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    	this.scene.add(this.camera);
    	this.camera.position.set(20,20,60);
    	this.camera.lookAt(this.scene.position);	
    	// RENDERER
    	if ( Detector.webgl )
    		this.renderer = new THREE.WebGLRenderer( {antialias:true} );
    	else
    		this.renderer = new THREE.CanvasRenderer();
    	this.renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    	this.renderer.setClearColor( 0x454C4F, 1 );
    
    	this.container = document.getElementById( 'ThreeJS' );
    	this.container.appendChild( this.renderer.domElement );
    	// EVENTS
    	THREEx.WindowResize(this.renderer, this.camera);
    	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
    	// CONTROLS
    	this.controls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
    	// STATS
    	this.stats = new Stats();
    	this.stats.domElement.style.position = 'absolute';
    	this.stats.domElement.style.bottom = '0px';
    	this.stats.domElement.style.zIndex = 100;
    	this.container.appendChild( this.stats.domElement );
    	// LIGHT
    	this.m_lights.push( new THREE.PointLight(0xffffff) );
    	this.m_lights[0].position.set(0,10,0);
    	this.scene.add(this.m_lights[0]);
    	var light2 = new THREE.PointLight(0xffffff);
    	light2.position.set(10,0,0);
    	this.scene.add(light2);
    	var light3 = new THREE.PointLight(0xffffff);
    	light3.position.set(0,0,10);
    	this.scene.add(light3);
    	this.createGrid( 20, 10 );
    	this.camera.layers.enable( 1 );

        this.guiText = new GUI();
	    this.gui = new dat.GUI();
        
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    createGrid( _size, _divisions )
    {
        var gridHelper = new THREE.GridHelper( _size, _divisions );
        gridHelper.name = 'grid';
        this.scene.add( gridHelper );
        
        var axis = new THREE.AxisHelper( 1 );
        axis.name = 'grid';
        this.scene.add( axis );
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    update()
    {
        this.controls.update();
        this.stats.update();
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    render() 
    {
        this.renderer.render( this.scene, this.camera );
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    makeMesh( _values )
    {
        var geometry = this.polygonizer.makeGeometry( _values );
        
        this.addVertexColor( geometry )

        // console.log( this.guiText.Color );
        // console.log( this.StringToColor(this.guiText.Color) );
         if ( this.guiText.Shading == 'Per Vertex' )
            var colorMaterial = new THREE.MeshPhongMaterial( { color: this.StringToColor(this.guiText.Color), side: THREE.DoubleSide, vertexColors: THREE.VertexColors} );
         else 
            var colorMaterial = new THREE.MeshPhongMaterial( { color: this.StringToColor(this.guiText.Color), side: THREE.DoubleSide } );

        var mesh = new THREE.Mesh( geometry, colorMaterial );
        mesh.layers.set(1);
        this.scene.add(mesh);

        var geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
        var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 3 } );
        var wireframe = new THREE.LineSegments( geo, mat );
        wireframe.layers.set(2);
        this.scene.add( wireframe );
        
        // console.log( mesh.geometry.vertices );
    }
    //----------------------------------------------------------------------------------------------------------------------------------------

    addVertexColor( _geometry )
    {
        var color, f, p, vertexIndex;
        var faceIndices = [ 'a', 'b', 'c' ];
        var radius = 2.5;
        for ( var i = 0; i < _geometry.faces.length; i ++ ) 
		{
			f = _geometry.faces[ i ];

			for( var j = 0; j < 3; j++ ) 
            {
				vertexIndex = f[ faceIndices[ j ] ];
				p = _geometry.vertices[ vertexIndex ];
				color = new THREE.Color( 0xffffff );
				// color.setHSL( ( p.y / radius + 1 ) / 2, 1.0, 0.5 );
                color.setRGB(p.x/2, p.y/2, p.z/2);
                // color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );
				f.vertexColors[ j ] = color;
			}
		}
    }

    //----------------------------------------------------------------------------------------------------------------------------------------

    changeRenderingMode()
    {
        if ( ++this.m_wireframe > 2 )
        {
            this.m_wireframe = 0;
        }
        switch( this.m_wireframe )
        {
            case( 0 ) : // solid mode
            {
                this.camera.layers.enable( 1 ); 
                this.camera.layers.disable( 2 ); break;
            }
            case( 1 ) : // wireframe mode
            {
                this.camera.layers.disable( 1 );
                this.camera.layers.enable( 2 ); break;
            }
            case( 2 ) : // both
            {
                this.camera.layers.enable( 1 ); 
                this.camera.layers.enable( 2 );
                break;
            }
            default: break;
        }
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    perVertexColor()
    {
        // changes the shading of all the objects in the scene to per vertex color
        for ( var i = sceneManager.scene.children.length - 1; i > 0 ; --i )
        {	
            if( sceneManager.scene.children[i].type == 'Mesh' ) 
            {
                var colorMaterial = new THREE.MeshPhongMaterial( { color: this.StringToColor(this.guiText.Color), side: THREE.DoubleSide, vertexColors: THREE.VertexColors} );
                sceneManager.scene.children[i] = new THREE.Mesh( sceneManager.scene.children[i].geometry, colorMaterial );
            }
        }
    }   

//----------------------------------------------------------------------------------------------------------------------------------------

    uniformColor()
    {
        // changes the shading of all the objects in the scene to a solid color
        for ( var i = sceneManager.scene.children.length - 1; i > 0 ; --i )
        {	
            if( sceneManager.scene.children[i].type == 'Mesh' ) 
            {
                var colorMaterial =  new THREE.MeshPhongMaterial( { color: this.StringToColor(this.guiText.Color), side: THREE.DoubleSide } );
                sceneManager.scene.children[i] = new THREE.Mesh( sceneManager.scene.children[i].geometry, colorMaterial );
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    StringToColor( _in )
    {
        // parses a Hex string into a Hex number ex: #828583 to 8553859
        return parseInt( "0x" + _in.substr( 1, this.guiText.Color.length ) , 16 );
    }

//----------------------------------------------------------------------------------------------------------------------------------------

    updateColors()
    {
        // update colors of all the object in the scene
        for ( var i = sceneManager.scene.children.length - 1; i > 0 ; --i )
        {	
            if( sceneManager.scene.children[i].type == 'Mesh' )
            {
                this.scene.children[i].material.color.setHex(this.StringToColor(this.guiText.Color));
            }
        }
    }

//----------------------------------------------------------------------------------------------------------------------------------------

}
