/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/
// MAIN
// standard global variables
var container, scene, camera, renderer, controls, stats;
var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

var size;

var g_expression;
var g_wireframe = 0;
var polygonizer = new Polygonizer();

//----------------------------------------------------------------------------------------------------------------------------------------
function init() 
{
	// SCENE
	scene = new THREE.Scene();
	// CAMERA
	var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
	scene.add(camera);
	camera.position.set(20,20,60);
	camera.lookAt(scene.position);	
	// RENDERER
	if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer(); 
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	renderer.setClearColor( 0x454C4F, 1 );
	
	container = document.getElementById( 'ThreeJS' );
	container.appendChild( renderer.domElement );
	// EVENTS
	THREEx.WindowResize(renderer, camera);
	THREEx.FullScreen.bindKey({ charCode : 'm'.charCodeAt(0) });
	// CONTROLS
	controls = new THREE.OrbitControls( camera, renderer.domElement );
	// STATS
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.bottom = '0px';
	stats.domElement.style.zIndex = 100;
	container.appendChild( stats.domElement );
	// LIGHT
	var light1 = new THREE.PointLight(0xffffff);
	light1.position.set(0,10,0);
	scene.add(light1);
	var light2 = new THREE.PointLight(0xffffff);
	light2.position.set(10,0,0);
	scene.add(light2);
	var light3 = new THREE.PointLight(0xffffff);
	light3.position.set(0,0,10);
	scene.add(light3);
	createGrid( 20, 10 );
	camera.layers.enable( 1 );
	// camera.layers.enable( 2 );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function animate() 
{
    requestAnimationFrame( animate );
	render();
	update();
}

//----------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() 
{
	$(document).keydown(function(e)
	{
		if(e.key === "w")
		{
			changeRenderingMode(); // toggle wireframe mode
		}
	});
});


//----------------------------------------------------------------------------------------------------------------------------------------

function update()
{
	controls.update();
	stats.update();
}

//----------------------------------------------------------------------------------------------------------------------------------------

function render() 
{
	renderer.render( scene, camera );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function makeMesh( _expression )
{
	var geometry = polygonizer.makeGeometry( _expression );
	var colorMaterial =  new THREE.MeshPhongMaterial( {color: 0x828583, side: THREE.DoubleSide} );
	colorMaterial.w

	var mesh = new THREE.Mesh( geometry, colorMaterial );
	mesh.layers.set(1);
	scene.add(mesh);

	var geo = new THREE.EdgesGeometry( geometry ); // or WireframeGeometry( geometry )
	var mat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
	var wireframe = new THREE.LineSegments( geo, mat );
	wireframe.layers.set(2);
	scene.add( wireframe );
	
	// console.log( mesh.geometry.vertices );
}

//----------------------------------------------------------------------------------------------------------------------------------------
function clear()
{
	var deletedLines = false;
	var deletedMesh = false;

    for ( var i = scene.children.length-1; i > 0 ; --i )
    {	
        // console.log( scene.children[i].id );
		if ( scene.children[i].name == 'grid' ) // ignore the grid
			continue;

        else if( scene.children[i].type == 'Mesh' && !deletedMesh ) // deletes mesh
		{
			deletedMesh = true;
            scene.remove(scene.children[i]);
		}

		else if ( scene.children[i].type == 'LineSegments' && !deletedLines ) // deletes wireframe
		{
			deletedLines = true;
            scene.remove( scene.children[i] );
		}
		
		if ( deletedLines && deletedMesh )
			break;
    }	
	
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Sphere()
{
    makeMesh("x*x + y*y + z*z - 5");
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cube()
{
    makeMesh("Math.max(x*x,y*y,z*z) - 5");
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Evaluate()
{
    makeMesh( g_expression );
}

//----------------------------------------------------------------------------------------------------------------------------------------

window.onload = function()
{ 
	var text = new GUI();
	var gui = new dat.GUI();
	gui.add(text, 'Expression').onFinishChange(function()
	{
		g_expression = text.Expression;
	});
	// gui.add(text, 'speed', -5, 5);
	// gui.add(text, 'displayOutline');
	gui.add(text, 'Clear');
	gui.add(text, 'Sphere');
	gui.add(text, 'Cube');
	gui.add(text, 'Evaluate');
	
};

//----------------------------------------------------------------------------------------------------------------------------------------

function changeRenderingMode()
{
	if ( ++g_wireframe > 2 )
	{
		g_wireframe = 0;
	}
	switch( g_wireframe )
	{
		case( 0 ) : // solid mode
		{
			camera.layers.enable( 1 ); 
			camera.layers.disable( 2 ); break;
		}
		case( 1 ) : // wireframe mode
		{
			camera.layers.disable( 1 );
			camera.layers.enable( 2 ); break;
		}
		case( 2 ) : // both
		{
			camera.layers.enable( 1 ); 
			camera.layers.enable( 2 );
			break;
		}
		default: break;
	}
}

//----------------------------------------------------------------------------------------------------------------------------------------

function createGrid( _size, _divisions )
{
	var gridHelper = new THREE.GridHelper( _size, _divisions );
	gridHelper.name = 'grid';
	scene.add( gridHelper );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function main()
{
    init();
    animate();
    
    return 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------

var GUI = function() 
{
  this.Expression = 'x*x + y*y + z*z - 5';
  this.Sphere = Sphere;
  this.Cube = Cube;
  this.Clear = clear;
  this.Evaluate = Evaluate;
};
