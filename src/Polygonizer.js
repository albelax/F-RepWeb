class Polygonizer
{
    constructor()
    {
        // number of cubes along a side
	    this.m_size = 60;
	    this.m_axisMin = -10; // prev 10
	    this.m_axisMax = 10;
        
	    this.m_axisRange = this.m_axisMax - this.m_axisMin;
        this.type = "MARCHING_CUBES";
    }

    //----------------------------------------------------------------------------------------------------------------------------------------

    getValues( _expression, _offsetX = 0, _offsetY = 0, _offsetZ = 0 )
    {
        // takes an expression and returns a bundle of values and points
        var geoValues = new GeometryValues();
        
        geoValues.offset.x = _offsetX;
        geoValues.offset.y = _offsetY;
        geoValues.offset.z = _offsetZ;

        geoValues.expression = _expression;
        // console.log(geoValues.expression);
        // Generate a list of 3D points and values at those points
        for (var k = 0; k < this.m_size; k++)
        for (var j = 0; j < this.m_size; j++)
        for (var i = 0; i < this.m_size; i++)
        {
            // actual values
            var x = this.m_axisMin + this.m_axisRange * i / (this.m_size - 1);
            var y = this.m_axisMin + this.m_axisRange * j / (this.m_size - 1);
            var z = this.m_axisMin + this.m_axisRange * k / (this.m_size - 1);
            
            geoValues.originalPoints.push( new THREE.Vector3( x , y , z ) );

            x += _offsetX;
            y += _offsetY;
            z += _offsetZ;
            
            geoValues.points.push( new THREE.Vector3( x + _offsetX , y + _offsetY, z + _offsetZ ) ); // modify here to translate!!!!
            
            geoValues.originalValues.push( new THREE.Vector3( x, y, z ) ); // now I can rotate the values
            geoValues.values.push( eval( _expression ) );
        }
        return geoValues;
    }

    //----------------------------------------------------------------------------------------------------------------------------------------

    marchingCubes ( _geometryValues )
    {
        /*
    	Three.js "tutorials by example"
	    Author: Lee Stemkoski
	    Date: July 2013 (three.js v59dev)
        */
        
        // Marching Cubes Algorithm
        var size2 = this.m_size * this.m_size;

        // Vertices may occur along edges of cube, when the values at the edge's endpoints
        // straddle the isolevel value.
        // Actual position along edge weighted according to function values.
        
        var vlist = new Array(12);
        
        var geometry = new THREE.Geometry();
        var vertexIndex = 0;
        
        for (var z = 0; z < this.m_size - 1; z++)
        for (var y = 0; y < this.m_size - 1; y++)
        for (var x = 0; x < this.m_size - 1; x++)
        {
            // index of base point, and also adjacent points on cube
            var p    = x + this.m_size * y + size2 * z,
                px   = p   + 1,
                py   = p   + this.m_size,
                pxy  = py  + 1,
                pz   = p   + size2,
                pxz  = px  + size2,
                pyz  = py  + size2,
                pxyz = pxy + size2;
            
            // store scalar values corresponding to vertices
            var value0 = _geometryValues.values[ p    ],
                value1 = _geometryValues.values[ px   ],
                value2 = _geometryValues.values[ py   ],
                value3 = _geometryValues.values[ pxy  ],
                value4 = _geometryValues.values[ pz   ],
                value5 = _geometryValues.values[ pxz  ],
                value6 = _geometryValues.values[ pyz  ],
                value7 = _geometryValues.values[ pxyz ];
            
            // place a "1" in bit positions corresponding to vertices whose
            //   isovalue is less than given constant.
            
            var isolevel = 0;
            
            var cubeindex = 0;
            if ( value0 < isolevel ) cubeindex |= 1;
            if ( value1 < isolevel ) cubeindex |= 2;
            if ( value2 < isolevel ) cubeindex |= 8;
            if ( value3 < isolevel ) cubeindex |= 4;
            if ( value4 < isolevel ) cubeindex |= 16;
            if ( value5 < isolevel ) cubeindex |= 32;
            if ( value6 < isolevel ) cubeindex |= 128;
            if ( value7 < isolevel ) cubeindex |= 64;
            
            // bits = 12 bit number, indicates which edges are crossed by the isosurface
            var bits = THREE.edgeTable[ cubeindex ];
            
            // if none are crossed, proceed to next iteration
            if ( bits === 0 ) continue;
            
            // check which edges are crossed, and estimate the point location
            //    using a weighted average of scalar values at edge endpoints.
            // store the vertex in an array for use later.
            var mu = 0.5; 
            
            // bottom of the cube
            if ( bits & 1 )
            {		
                mu = ( isolevel - value0 ) / ( value1 - value0 );
                vlist[0] = _geometryValues.points[p].clone().lerp( _geometryValues.points[px], mu );
            }
            if ( bits & 2 )
            {
                mu = ( isolevel - value1 ) / ( value3 - value1 );
                vlist[1] = _geometryValues.points[px].clone().lerp( _geometryValues.points[pxy], mu );
            }
            if ( bits & 4 )
            {
                mu = ( isolevel - value2 ) / ( value3 - value2 );
                vlist[2] = _geometryValues.points[py].clone().lerp( _geometryValues.points[pxy], mu );
            }
            if ( bits & 8 )
            {
                mu = ( isolevel - value0 ) / ( value2 - value0 );
                vlist[3] = _geometryValues.points[p].clone().lerp( _geometryValues.points[py], mu );
            }
            // top of the cube
            if ( bits & 16 )
            {
                mu = ( isolevel - value4 ) / ( value5 - value4 );
                vlist[4] = _geometryValues.points[pz].clone().lerp( _geometryValues.points[pxz], mu );
            }
            if ( bits & 32 )
            {
                mu = ( isolevel - value5 ) / ( value7 - value5 );
                vlist[5] = _geometryValues.points[pxz].clone().lerp( _geometryValues.points[pxyz], mu );
            }
            if ( bits & 64 )
            {
                mu = ( isolevel - value6 ) / ( value7 - value6 );
                vlist[6] = _geometryValues.points[pyz].clone().lerp( _geometryValues.points[pxyz], mu );
            }
            if ( bits & 128 )
            {
                mu = ( isolevel - value4 ) / ( value6 - value4 );
                vlist[7] = _geometryValues.points[pz].clone().lerp( _geometryValues.points[pyz], mu );
            }
            // vertical lines of the cube
            if ( bits & 256 )
            {
                mu = ( isolevel - value0 ) / ( value4 - value0 );
                vlist[8] = _geometryValues.points[p].clone().lerp( _geometryValues.points[pz], mu );
            }
            if ( bits & 512 )
            {
                mu = ( isolevel - value1 ) / ( value5 - value1 );
                vlist[9] = _geometryValues.points[px].clone().lerp( _geometryValues.points[pxz], mu );
            }
            if ( bits & 1024 )
            {
                mu = ( isolevel - value3 ) / ( value7 - value3 );
                vlist[10] = _geometryValues.points[pxy].clone().lerp( _geometryValues.points[pxyz], mu );
            }
            if ( bits & 2048 )
            {
                mu = ( isolevel - value2 ) / ( value6 - value2 );
                vlist[11] = _geometryValues.points[py].clone().lerp( _geometryValues.points[pyz], mu );
            }
            
            // construct triangles -- get correct vertices from triTable.
            var i = 0;
            cubeindex <<= 4;  // multiply by 16... 
            // "Re-purpose cubeindex into an offset into triTable." 
            //  since each row really isn't a row.
            
            // the while loop should run at most 5 times,
            //   since the 16th entry in each row is a -1.
            while ( THREE.triTable[ cubeindex + i ] != -1 ) 
            {
                var index1 = THREE.triTable[cubeindex + i];
                var index2 = THREE.triTable[cubeindex + i + 1];
                var index3 = THREE.triTable[cubeindex + i + 2];
                
                geometry.vertices.push( vlist[index1].clone() );
                geometry.vertices.push( vlist[index2].clone() );
                geometry.vertices.push( vlist[index3].clone() );
                var face = new THREE.Face3(vertexIndex, vertexIndex+1, vertexIndex+2);
                geometry.faces.push( face );

                geometry.faceVertexUvs[ 0 ].push( [ new THREE.Vector2(0,0), new THREE.Vector2(0,1), new THREE.Vector2(1,1) ] );

                vertexIndex += 3;
                i += 3;
            }
	    }
        geometry.computeFaceNormals();
        geometry.computeVertexNormals();
        
        return geometry;
    }

    //----------------------------------------------------------------------------------------------------------------------------------------

    makeGeometry ( _geometryValues )
    {
        if( this.type == "MARCHING_CUBES" )
        {            
            return this.marchingCubes( _geometryValues );
        }
    }
    
    //----------------------------------------------------------------------------------------------------------------------------------------

} // end Polygonizer


class GeometryValues
{
    constructor()
    {
        this.values = [];
        this.points = [];
        this.originalPoints = [];
        this.originalValues = [];
        this.expression;
        this.offset = new THREE.Vector3();
    }
}