/*
	Three.js "tutorials by example"
	Author: Lee Stemkoski
	Date: July 2013 (three.js v59dev)
*/
//(7*x)*(7*x) + (-4*y)*(-4*y) + (-2*z)*(-2*z) - 4

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
	this.Expression = 'Subtract(Cube(0,0,0),Sphere(0,0,0))';

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
	// sceneManager.guiText = new GUI();
	sceneManager.gui.add( sceneManager.guiText, 'Expression' ).onFinishChange(function()
	{
		sceneManager.expression = sceneManager.guiText.Expression;
	});
	// gui.add(text, 'speed', -5, 5);
	// gui.add(text, 'displayOutline');
	sceneManager.gui.add( sceneManager.guiText, 'Clear' );
	// sceneManager.gui.add( sceneManager.guiText, 'Sphere' );
	// sceneManager.gui.add( sceneManager.guiText, 'Cube' );
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

	polys.add( sceneManager.guiText, 'AxisSize', 1, 15).onFinishChange(function()
	{
		sceneManager.polygonizer.m_axisMin = -sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisMax = sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisRange = sceneManager.polygonizer.m_axisMax - sceneManager.polygonizer.m_axisMin;
	});
	
	polys.add( sceneManager.guiText, 'BoundingBox', 1, 15).onFinishChange(function()
	{
		sceneManager.boundingBox = sceneManager.guiText.BoundingBox;
	});
};

//----------------------------------------------------------------------------------------------------------------------------------------

function makeSphere()
{
    sceneManager.makeMesh( sceneManager.polygonizer.getValues( "x*x + y*y + z*z - " + sceneManager.boundingBox  ) );
	// sceneManager.makeMesh( "(Math.sqrt(x * x + y * y + z*z) - 3.0)" );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function makeCube()
{
	sceneManager.makeMesh( sceneManager.polygonizer.getValues( "Math.max(x*x,y*y,z*z) - " + sceneManager.boundingBox ) );
	// sceneManager.makeMesh( "Math.max(Math.abs(x) - 2.5, Math.max(Math.abs(y) - 2.5, Math.abs(z) - 2.5))" );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Evaluate()
{
    clear();
	var x,y,z,w,h,d;
	var output = eval( sceneManager.expression );
	// console.log( output.constructor.name );
	if ( output.constructor.name == "Number" )
	{
		sceneManager.makeMesh( sceneManager.polygonizer.getValues( sceneManager.expression ) );
	}
	else //if ( output.constructor.name == "GeometryValues" )
	{
		sceneManager.makeMesh( output );
	}
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
        // console.log( scene.children[i].id );
		if ( sceneManager.scene.children[i].name == 'grid' ) // ignore the grid
			continue;

        else if( sceneManager.scene.children[i].type == 'Mesh' ) // deletes mesh
		{
            sceneManager.scene.remove( sceneManager.scene.children[i] );
		}

		else if ( sceneManager.scene.children[i].type == 'LineSegments' ) // deletes wireframe
		{
            sceneManager.scene.remove( sceneManager.scene.children[i] );
		}

    }	
}

//----------------------------------------------------------------------------------------------------------------------------------------

function main()
{
	// Sphere(_z = 3);
	sceneManager.init();
	animate();
    
    return 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Sphere( _x = 0, _y = 0, _z = 0 )
{
	// console.log("sphere: " +  _x + " - " + _y + " - " + _z );
	return sceneManager.polygonizer.getValues( "x*x + y*y + z*z -" + sceneManager.boundingBox, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cube( _x = 0, _y = 0, _z = 0 )
{
	// console.log("cube: " +  _x + " - " + _y + " - " + _z );
	return sceneManager.polygonizer.getValues( "Math.max(x*x,y*y,z*z) - " + sceneManager.boundingBox, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Subtract( _geoValues1, _geoValues2 = 0 )
{
	var outValues = new GeometryValues();
	outValues.points = _geoValues1.points;
	outValues.originalPoints = _geoValues1.originalPoints;

	if ( _geoValues2 == 0 )
		return _geoValues1;
	for ( var i = 0; i < _geoValues1.values.length; ++i )
	{
		outValues.values[i] = Math.max( _geoValues1.values[i], - _geoValues2.values[i] );
	}

	// outValues.points = _geoValues1.points; // points are always the same, no need to change them
	outValues.points = _geoValues1.originalPoints;	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Union( _geoValues1, _geoValues2 = 0 )
{
	var outValues = new GeometryValues();
	outValues.points = _geoValues1.points;
	outValues.originalPoints = _geoValues1.originalPoints;

	if ( _geoValues2 == 0 )
		return _geoValues1;
	for ( var i = 0; i < _geoValues1.values.length; ++i )
	{
		outValues.values[i] = Math.min( _geoValues1.values[i], _geoValues2.values[i] );
	}

	outValues.points = _geoValues1.originalPoints;	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Intersection( _geoValues1, _geoValues2 = 0 )
{
	var outValues = new GeometryValues();
	outValues.points = _geoValues1.points;
	outValues.originalPoints = _geoValues1.originalPoints;

	if ( _geoValues2 == 0 )
		return _geoValues1;
	for ( var i = 0; i < _geoValues1.values.length; ++i )
	{
		outValues.values[i] = Math.max( _geoValues1.values[i], _geoValues2.values[i] );
	}

	// outValues.points = _geoValues1.points; // points are always the same, no need to change them
	outValues.points = _geoValues1.originalPoints;	
	return outValues;
}