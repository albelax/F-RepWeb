/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/


var sceneManager = new SceneManager();

//----------------------------------------------------------------------------------------------------------------------------------------

$(document).ready(function() 
{
	$(document).keydown(function(e)
	{
		if ( e.key === "w" )
		{
			sceneManager.changeRenderingMode(); // toggle wireframe mode
		}
	});
});

//----------------------------------------------------------------------------------------------------------------------------------------

function animate() 
{
    requestAnimationFrame( animate );
    sceneManager.render();
    sceneManager.update();
}

//----------------------------------------------------------------------------------------------------------------------------------------

var GUI = function() 
{
  this.Expression = 'x*x + y*y + z*z - 5';
  this.Sphere = Sphere;
  this.Cube = Cube;
  this.Clear = clear;
  this.Evaluate = Evaluate;
  this.Shading = "Uniform";
  this.Color = "#828583";
  this.Resolution = 30;
};

window.onload = function()
{ 
	// sceneManager.guiText = new GUI();
	sceneManager.gui.add( sceneManager.guiText, 'Expression' ).onFinishChange(function()
	{
		sceneManager.expression = sceneManager.guiText.Expression;
	});
	// gui.add(text, 'speed', -5, 5);
	// gui.add(text, 'displayOutline');
	sceneManager.gui.add( sceneManager.guiText, 'Clear' );
	sceneManager.gui.add( sceneManager.guiText, 'Sphere' );
	sceneManager.gui.add( sceneManager.guiText, 'Cube' );
	sceneManager.gui.add( sceneManager.guiText, 'Evaluate' );
	
	sceneManager.gui.add( sceneManager.guiText, 'Shading', [ 'Uniform', 'Per Vertex' ] ).onFinishChange(function()
	{
		if( sceneManager.guiText.Shading == 'Per Vertex' )
		{
			sceneManager.perVertexColor();
		}
		else if( sceneManager.guiText.Shading == 'Uniform' )
		{
			sceneManager.uniformColor();
		}
	});
	
	sceneManager.gui.addColor( sceneManager.guiText, 'Color' ).onChange(function()
	{
		sceneManager.updateColors();
	});

	sceneManager.gui.add( sceneManager.guiText, 'Resolution').onFinishChange(function()
	{
		sceneManager.polygonizer.m_size = sceneManager.guiText.Resolution;
	});
	
};

//----------------------------------------------------------------------------------------------------------------------------------------

function Sphere()
{
    sceneManager.makeMesh( "x*x + y*y + z*z - 5" );
	// sceneManager.makeMesh( "(Math.sqrt(x * x + y * y + z*z) - 3.0)" );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cube()
{
    sceneManager.makeMesh( "Math.max(x*x,y*y,z*z) - 5" );
	// sceneManager.makeMesh( "Math.max(Math.abs(x) - 2.5, Math.max(Math.abs(y) - 2.5, Math.abs(z) - 2.5))" );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Evaluate()
{
    sceneManager.makeMesh( sceneManager.expression );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function clear()
{
	var deletedLines = false;
	var deletedMesh = false;

    for ( var i = sceneManager.scene.children.length-1; i > 0 ; --i )
    {	
        // console.log( scene.children[i].id );
		if ( sceneManager.scene.children[i].name == 'grid' ) // ignore the grid
			continue;

        else if( sceneManager.scene.children[i].type == 'Mesh' && !deletedMesh ) // deletes mesh
		{
			deletedMesh = true;
            sceneManager.scene.remove( sceneManager.scene.children[i] );
		}

		else if ( sceneManager.scene.children[i].type == 'LineSegments' && !deletedLines ) // deletes wireframe
		{
			deletedLines = true;
            sceneManager.scene.remove( sceneManager.scene.children[i] );
		}
		
		if ( deletedLines && deletedMesh )
			break;
    }	
}

//----------------------------------------------------------------------------------------------------------------------------------------

function main()
{
	sceneManager.init();
	animate();
    
    return 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------