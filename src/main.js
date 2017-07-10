// (7*x)*(7*x) + (-4*y)*(-4*y) + (-2*z)*(-2*z) - 4
// (y-z) * 2 + (z-x) *2 + (x-y) *2
// Cool Stuff: // x**4 - 5*x**2 + y**4 - 5*y**2 + z**4 - 5*z**2 + 11.8
// Torus://Math.sqrt((Math.sqrt(x*x + z*z)- 2) * ( Math.sqrt(x*x + z*z)-2) + y * y ) -1

// SuperEllipsoid: ((x/1)**(2/0.2) + (y/1)**(2/0.2) )**(0.2/0.2) + (z/1)**(2/0.2) -1

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

	var customContainer = document.getElementById('datGUI');
    	customContainer.appendChild(sceneManager.gui.domElement);
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
	this.Clear = pop;
	this.Evaluate = Evaluate;
	this.Shading = "Uniform";
	this.Color = "#828583";
	this.AxisSize = 10;
	this.Resolution = 60;
	this.BoundingBox = 1;
};

//----------------------------------------------------------------------------------------------------------------------------------------

window.onload = function()
{ 	
	sceneManager.gui.add( sceneManager.guiText, 'Clear' );
	
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

	var polys = sceneManager.gui.addFolder('Polygons');

	polys.add( sceneManager.guiText, 'Resolution').onFinishChange(function()
	{
		sceneManager.polygonizer.m_size = sceneManager.guiText.Resolution;
	});

	polys.add( sceneManager.guiText, 'AxisSize', 1, 150).onFinishChange(function()
	{
		sceneManager.polygonizer.m_axisMin = -sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisMax = sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisRange = sceneManager.polygonizer.m_axisMax - sceneManager.polygonizer.m_axisMin;
	});
	
	polys.add( sceneManager.guiText, 'BoundingBox', 1, 20).onFinishChange(function()
	{
		sceneManager.boundingBox = sceneManager.guiText.BoundingBox;
	});	
};

//----------------------------------------------------------------------------------------------------------------------------------------

function Evaluate()
{
    clear();
	var x,y,z,w,h,d;
	
	var points = sceneManager.polygonizer.getPoints();
	var values = [];
	var text = $('textarea#expression').val(); // get values from the expression text area
	var color = $('textarea#color').val(); // get values from the color text area

	for ( var i = 0; i < points.length; ++i )
	{
		x = points[i].x;
		y = points[i].y;
		z = points[i].z;
		values[i] = eval( text );
	}
	var output = new GeometryValues();
	output.points = points;
	output.values = values;
	var geometry;

	geometry = sceneManager.polygonizer.makeGeometry( output );
	
	sceneManager.addVertexColor( geometry, color );
	sceneManager.makeMesh( geometry );
	// console.log(geometry);
}

//----------------------------------------------------------------------------------------------------------------------------------------

function pop()
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

function clear()
{
	for ( var i = sceneManager.scene.children.length-1; i > 0 ; --i )
	{
		pop();
	}

}

//----------------------------------------------------------------------------------------------------------------------------------------

function main()
{
	// noise1(0,0);
	sceneManager.init();
	animate();
    
    return 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------
