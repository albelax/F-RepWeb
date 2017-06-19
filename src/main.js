//(7*x)*(7*x) + (-4*y)*(-4*y) + (-2*z)*(-2*z) - 4
//(y-z) * 2 + (z-x) *2 + (x-y) *2
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

	polys.add( sceneManager.guiText, 'AxisSize', 1, 15).onFinishChange(function()
	{
		sceneManager.polygonizer.m_axisMin = -sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisMax = sceneManager.guiText.AxisSize;
		sceneManager.polygonizer.m_axisRange = sceneManager.polygonizer.m_axisMax - sceneManager.polygonizer.m_axisMin;
	});
	
	polys.add( sceneManager.guiText, 'BoundingBox', 1, 20).onFinishChange(function()
	{
		sceneManager.boundingBox = sceneManager.guiText.BoundingBox;
	});

	// sceneManager.gui.domElement.style.padding = '0px';
	// sceneManager.gui.domElement.style.margin = '0em';
	// console.log(sceneManager.gui.domElement);
	
	
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

	var text = $('textarea#expression').val(); // get values from the expression text area
	var color = $('textarea#color').val(); // get values from the color text area

	console.log(color);
	var output = eval( text );
	var geometry;

	if ( output.constructor.name == "Number" )
	{
		geometry = sceneManager.polygonizer.makeGeometry( sceneManager.polygonizer.getValues( text ) );
		
	}
	else //if ( output.constructor.name == "GeometryValues" )
	{
		geometry = sceneManager.polygonizer.makeGeometry( output );
	}
	sceneManager.addVertexColor( geometry, color );
	sceneManager.makeMesh( geometry );
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
	// Sphere(_z = 3);
	sceneManager.init();
	animate();
    
    return 0;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Sphere( _x = 0, _y = 0, _z = 0, _diameter = 1 )
{
	// console.log("sphere: " +  _x + " - " + _y + " - " + _z );
	this.size = _diameter * sceneManager.boundingBox; // temporary
	return sceneManager.polygonizer.getValues( "x*x + y*y + z*z -" + this.size, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cube( _x = 0, _y = 0, _z = 0, _size = 1 )
{
	// console.log("cube: " +  _x + " - " + _y + " - " + _z );
	this.size = _size * sceneManager.boundingBox; // temporary
	return sceneManager.polygonizer.getValues( "Math.max(x*x,y*y,z*z) - " + this.size, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Torus( _x = 0, _y = 0, _z = 0, _horizontalRadius = 1, _verticalRadius = 0.5 )
{
	this.HR = _horizontalRadius * sceneManager.boundingBox;
	this.VR = _verticalRadius * sceneManager.boundingBox;
	return sceneManager.polygonizer.getValues
	( 
		"Math.sqrt((Math.sqrt(x*x + z*z)-" + this.HR + ") * (Math.sqrt(x*x + z*z)-" + this.HR + ") + y * y) -" + this.VR, _x, _y, _z 
	);
}

//----------------------------------------------------------------------------------------------------------------------------------------

function InfiniteCylinder( _x = 0, _y = 0, _z = 0, _width = 1 )
{
	return sceneManager.polygonizer.getValues( "x*x + z*z - " + _width, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cylinder( _x = 0, _y = 0, _z = 0, _width = 1,_height = 1 )
{
	// infinite Cylinder - 2 Planes
	return utilSubtract( sceneManager.polygonizer.getValues( "x*x + z*z - " + _width, _x, _y, _z ),
		sceneManager.polygonizer.getValues( "-y * y +" + _height, _x, _y, _z ) );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function X( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "x - 0", _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Y2( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "-y * y +" + _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Y( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "y - 0",  0, _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Z( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "z - 0", 0, 0, _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function utilSubtract( _geoValues1, _geoValues2 = 0 )
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

	// for some reason the coordinates of the points need to be flipped
	for ( var i = 0; i < _geoValues1.originalPoints.length; ++i ) 
	{
		outValues.points[i].x = - _geoValues1.originalPoints[i].x;
		outValues.points[i].y = - _geoValues1.originalPoints[i].y;
		outValues.points[i].z = - _geoValues1.originalPoints[i].z;
	}

	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Subtract( /**/ )
{
	var args = arguments;
	var outValues = args[0];

	for ( var i = 1; i < args.length; ++i )
	{
		console.log( args[i] );
		outValues = utilSubtract( outValues, args[i] );
	}
	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function utilUnion( _geoValues1, _geoValues2 = 0 )
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

	// for some reason the coordinates of the points need to be flipped
	for ( var i = 0; i < _geoValues1.originalPoints.length; ++i ) 
	{
		outValues.points[i].x = - _geoValues1.originalPoints[i].x;
		outValues.points[i].y = - _geoValues1.originalPoints[i].y;
		outValues.points[i].z = - _geoValues1.originalPoints[i].z;
	}	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Union( /**/ )
{
	var args = arguments;
	var outValues = 0;

	for ( var i = 0; i < args.length; ++i )
	{
		console.log( args[i] );
		outValues = utilUnion( args[i], outValues );
	}
	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function utilIntersection( _geoValues1, _geoValues2 = 0 )
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

	// for some reason the coordinates of the points need to be flipped
	for ( var i = 0; i < _geoValues1.originalPoints.length; ++i ) 
	{
		outValues.points[i].x = - _geoValues1.originalPoints[i].x;
		outValues.points[i].y = - _geoValues1.originalPoints[i].y;
		outValues.points[i].z = - _geoValues1.originalPoints[i].z;
	}	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Intersection( /**/ )
{
	var args = arguments;
	var outValues = 0;

	for ( var i = 0; i < args.length; ++i )
	{
		console.log( args[i] );
		outValues = utilIntersection( args[i], outValues );
	}
	
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------