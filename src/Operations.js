
//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_x( _x, _y, _z, _angle = 0 )
{
	if ( _angle == 0 )
		return new THREE.Vector3( _x , _y , _z );
	var angle = Math.PI * _angle / 180;
	var x = _x;
	var y = _y * Math.cos( angle ) + _z * Math.sin( angle );
	var z = -_y * Math.sin( angle ) + _z * Math.cos( angle );

	return new THREE.Vector3( x , y , z );
}

// y’=y*cos(theta)+z*sin(theta)
// z’=-y*sin(theta)+z*cos(theta)

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_y( _x, _y, _z, _angle = 0 )
{
	if ( _angle == 0 )
		return new THREE.Vector3( _x , _y , _z );
	var angle = Math.PI * _angle / 180;
	var x = - _z * Math.sin( angle ) + _x * Math.cos( angle );
	var y = _y;
	var z = _z * Math.cos( angle ) + _x * Math.sin( angle );

	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Rotate_z( _x, _y, _z, _angle = 0 )
{
	if ( _angle == 0 )
		return new THREE.Vector3( _x , _y , _z );
	var angle = Math.PI * _angle / 180;
	var x = _x * Math.cos( angle ) + _y * Math.sin( angle );
	var y = - _x * Math.sin( angle ) + _y * Math.cos( angle );
	var z = _z;

	return new THREE.Vector3( x , y , z );
}

// x' = x*cos q - y*sin q
// y' = x*sin q + y*cos q 
// z' = z

//----------------------------------------------------------------------------------------------------------------------------------------

function Translate( _x, _y, _z, t_x = 0, t_y = 0, t_z = 0 )
{
	var x = _x - t_x;
	var y = _y - t_y;
	var z = _z - t_z;

	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Scale( _x, _y, _z, t_x = 1, t_y = 1, t_z = 1 )
{
	var x = _x / t_x;
	var y = _y / t_y;
	var z = _z / t_z;

	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Union( /**/ )
{
	var args = arguments;
	var out = args[0];
	for ( var i = 0; i < args.length; ++i )
	{
		out = Math.max( args[i], out );
	}
	
	return out;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Intersection( /**/ )
{
	// return Math.min( _a, _b );
	var args = arguments;
	var out = args[0];
	for ( var i = 0; i < args.length; ++i )
	{
		out = Math.min( args[i], out );
	}
	
	return out;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Subtract( /**/ )
{
	// return Math.min( _a, - _b );
	var args = arguments;
	var out = args[0];
	for ( var i = 1; i < args.length; ++i )
	{
		out = Math.min( out, -args[i] );
	}
	
	return out;
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Twist_x( _x, _y, _z, _x1, _x2, _theta1 = 0, _theta2 = 0 )
{
	var toRad = Math.PI/180;
	var t = ( _x - _x1 ) / ( _x2 - _x1 );
	var theta = ( 1 - t ) * ( _theta1 * toRad ) + t * ( _theta2 * toRad );
	var x = _x;// 
	var y = _y * Math.cos( theta ) + _z * Math.sin( theta );
	var z = _z * Math.cos( theta ) - _y * Math.sin( theta );;
	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Twist_y( _x, _y, _z, _y1, _y2, _theta1 = 0, _theta2 = 0 )
{
	var toRad = Math.PI/180;
	var t = ( _y - _y1 ) / ( _y2 - _y1 );
	var theta = ( 1 - t ) * ( _theta1 * toRad ) + t * ( _theta2 * toRad );
	var x = _x * Math.cos( theta ) - _z * Math.sin( theta );
	var y = _y;
	var z = _z * Math.cos( theta ) + _x * Math.sin( theta );
	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function Twist_z( _x, _y, _z, _z1, _z2, _theta1 = 0, _theta2 = 0 )
{
	var toRad = Math.PI/180;
	var t = ( _z - _z1 ) / ( _z2 - _z1 );
	var theta = ( 1 - t ) * ( _theta1 * toRad ) + t * ( _theta2 * toRad );
	var x = _x * Math.cos( theta ) + _y * Math.sin( theta );
	var y = _y * Math.cos( theta ) - _x * Math.sin( theta );
	var z = _z;
	return new THREE.Vector3( x , y , z );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function BlendingUnion( _f1, _f2, _a, _a1, _a2 )
{
	var disp = _a /( 1 + ( _f1 / _a1 )**2 + ( _f2 / _a2 )**2 );
	return disp + Union( _f1, _f2 );
}

//----------------------------------------------------------------------------------------------------------------------------------------

function BlendingIntersection( _f1, _f2, _a, _a1, _a2 )
{
	var disp = _a /( 1 + ( _f1 / _a1 )**2 + ( _f2 / _a2 )**2 );
	return disp + Intersection( _f1, _f2 );
}

