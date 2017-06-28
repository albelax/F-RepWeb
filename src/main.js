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
	return sceneManager.polygonizer.getValues( "-x * x - y * y - z * z + " + this.size, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cube( _x = 0, _y = 0, _z = 0, _size = 1 )
{
	// console.log("cube: " +  _x + " - " + _y + " - " + _z );
	this.size = _size * sceneManager.boundingBox; // temporary
	return sceneManager.polygonizer.getValues( "Math.min( -x * x, -y * y, -z * z ) + " + this.size, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Torus( _x = 0, _y = 0, _z = 0, _horizontalRadius = 1, _verticalRadius = 0.5 )
{
	this.HR = _horizontalRadius * sceneManager.boundingBox;
	this.VR = _verticalRadius * sceneManager.boundingBox;
	
	return sceneManager.polygonizer.getValues
	( 
		"-(Math.sqrt((Math.sqrt(x*x + z*z)-" + this.HR + ") * ( Math.sqrt(x*x + z*z)- " + this.HR + ") + y * y ) -" + this.VR+")", _x, _y, _z 
	);
}

//----------------------------------------------------------------------------------------------------------------------------------------

function InfiniteCylinder( _x = 0, _y = 0, _z = 0, _width = 1 )
{
	return sceneManager.polygonizer.getValues( "-x*x - z*z + " + _width, _x, _y, _z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cylinder( _x = 0, _y = 0, _z = 0, _width = 1, _height = 1 )
{
	// infinite Cylinder - 2 Planes
	var width = _width * sceneManager.boundingBox;
	var height = _height * sceneManager.boundingBox;
	var expression = "Math.min( -x*x - z*z + " + _width + ", -( y * y -" + _height + "))";
	return sceneManager.polygonizer.getValues(expression, _x, _y, _z);

}

//----------------------------------------------------------------------------------------------------------------------------------------

function Cone( _x = 0, _y = 0, _z = 0, _width = 1, _height = 1 )
{
	// infinite Cylinder - 2 Planes
	return sceneManager.polygonizer.getValues( "(y*y) - (x*x)/1 - (z*z)/1 " );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function TangleCube( _x = 0, _y = 0, _z = 0, _width = 1, _height = 1 )
{
	// infinite Cylinder - 2 Planes
	return sceneManager.polygonizer.getValues( "-(x**4 - 5*x**2 + y**4 - 5*y**2 + z**4 - 5*z**2 + 11.8)" );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function SuperEllipsoid(_x = 0, _y = 0, _z = 0, _s1 = 0.2, _s2 = 0.2)
{
	var f = "-(( (x/1)**(2/"+_s2+") + (y/1)**(2/"+_s2+") )**("+_s2+"/"+_s1+") + ((z/1)**(2/"+_s1+")) -1)";
	return sceneManager.polygonizer.getValues( f, _x, _y, _z, _s1, _s2 );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function X( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "-x + 0", _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Y2( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "y * y -" + _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Y( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "-y + 0",  0, _value );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Z( _value = 0 )
{
	return sceneManager.polygonizer.getValues( "-z + 0", 0, 0, _value );
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
		outValues.values[i] = Math.min( _geoValues1.values[i], -_geoValues2.values[i] );
	}

	// Inverse transformations
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
		outValues.values[i] = Math.max( _geoValues1.values[i], _geoValues2.values[i] );
	}

	// Inverse transformations
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
	var expressions = [];
	for ( var i = 0; i < args.length; ++i )
	{
		expressions.push(args[i].expression);
		console.log(args[i]);
		outValues = utilUnion( args[i], outValues );
	}
	outValues.expression = "Math.max(";
	for ( var i = 0; i < expressions.length; ++i)
	{
		outValues.expression += expressions[i];
		if (i+1 < expressions.length)
			outValues.expression +=  ",";
	}
	outValues.expression += ")";
	outValues.originalValues = outValues.values;
	// outValues.originalValues = args[0].originalValues;
	// console.log(outValues.expression);
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
		outValues.values[i] = Math.min( _geoValues1.values[i], _geoValues2.values[i] );
	}

	// Inverse transformations
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

function Scale( _geoValues, _x = 1, _y = 1, _z = 1 )
{
	var outValues = new GeometryValues();
	outValues.points = _geoValues.points;
	outValues.values = _geoValues.values;
	outValues.originalPoints = _geoValues.originalPoints;

	for ( var i = 0; i < _geoValues.points.length; ++i )
	{
		outValues.points[i].x = (_geoValues.points[i].x * _x);
		outValues.points[i].y = (_geoValues.points[i].y * _y);
		outValues.points[i].z = (_geoValues.points[i].z * _z);
	}
	return outValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_x( _geoValues, _angle = 0 )
{
	// var angle = Math.PI * _angle / 180;
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i )
	{		
		var x = _geoValues.offset.x;
		var y = _geoValues.offset.y;
		var z = _geoValues.offset.z;

		x += _geoValues.originalPoints[i].x;
		y += _geoValues.originalPoints[i].y * Math.sin( _angle ) + _geoValues.originalPoints[i].z * Math.cos( _angle );
		z += _geoValues.originalPoints[i].y * Math.cos( _angle ) - _geoValues.originalPoints[i].z * Math.sin( _angle );

		_geoValues.values[i] = eval( _geoValues.expression );
	}
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i ) 
	{
		_geoValues.points[i].x = - _geoValues.originalPoints[i].x;
		_geoValues.points[i].y = - _geoValues.originalPoints[i].y;
		_geoValues.points[i].z = - _geoValues.originalPoints[i].z;
	}	
	return _geoValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_y( _geoValues, _angle = 0 )
{
	// var angle = Math.PI * _angle / 180;
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i )
	{		
		var x = _geoValues.offset.x;
		var y = _geoValues.offset.y;
		var z = _geoValues.offset.z;

		x += _geoValues.originalPoints[i].z * Math.cos( _angle ) - _geoValues.originalPoints[i].x * Math.sin( _angle );
		y += _geoValues.originalPoints[i].y;
		z += _geoValues.originalPoints[i].z * Math.sin( _angle ) + _geoValues.originalPoints[i].x * Math.cos( _angle );

		_geoValues.values[i] = eval( _geoValues.expression );
	}
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i ) 
	{
		_geoValues.points[i].x = - _geoValues.originalPoints[i].x;
		_geoValues.points[i].y = - _geoValues.originalPoints[i].y;
		_geoValues.points[i].z = - _geoValues.originalPoints[i].z;
	}	
	return _geoValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_z( _geoValues, _angle = 0 )
{
	// var angle = Math.PI * _angle / 180;
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i )
	{		
		var x = _geoValues.offset.x;
		var y = _geoValues.offset.y;
		var z = _geoValues.offset.z;

		x += _geoValues.originalPoints[i].x * Math.cos( _angle ) - _geoValues.originalPoints[i].y * Math.sin( _angle );
		y += _geoValues.originalPoints[i].x * Math.cos( _angle ) + _geoValues.originalPoints[i].y * Math.cos( _angle );
		z += _geoValues.originalPoints[i].z;

		_geoValues.values[i] = eval( _geoValues.expression );
	}
	
	for ( var i = 0; i < _geoValues.originalPoints.length; ++i ) 
	{
		_geoValues.points[i].x = - _geoValues.originalPoints[i].x;
		_geoValues.points[i].y = - _geoValues.originalPoints[i].y;
		_geoValues.points[i].z = - _geoValues.originalPoints[i].z;
	}	
	return _geoValues;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate( _geoValues, _axis, _angle = 0 )
{
	var angle = Math.PI * _angle / 180;
	switch( _axis )
	{
		case 0: return Rotate_x( _geoValues, angle );
		case 1: return Rotate_y( _geoValues, angle );
		case 2: return Rotate_z( _geoValues, angle );
		default: return;
	}
}

//----------------------------------------------------------------------------------------------------------------------------------------
