# Student Research Assistant Project

This Project was developed when I Student Research Assistant, it consists of an web based F-Rep modeling system based on HyperFun (http://hyperfun.org/).
In F-Rep the axis operations must me performed first, after thet they can be applied to the primitives, and finally we can use boolean, and other operations.

## Instructions:

- open the html file to run
- press w to toggle wireframe modes
- to declare a variable: var a = 5


## Axis Operations

### Translation
```
Translate( _x, _y, _z, t_x = 0, t_y = 0, t_z = 0 );
```
In order to translate an object we need to input first the coordinates we want to translate from and then the amount we want to translate in each axis.

```
var translatedCoordinates = Translate(x, y, z, 1, 0, 0 );
```
### Scale
```
Scale( _x, _y, _z, t_x = 0, t_y = 0, t_z = 0 );
```
In order to Scale an object we need to input first the coordinates we want to Scale from and then the amount we want to Scale in each axis.

```
var scaledCoordinates = Scale(x, y, z, 1, 0, 0 );
```
### Rotation
```
Rotate_x( _x, _y, _z, _angle = 0 );
Rotate_y( _x, _y, _z, _angle = 0 );
Rotate_z( _x, _y, _z, _angle = 0 );
```
To Rotate an object it's necessary to input the original coordinates and the angle we wanto to rotate it by.

```
var rotatedCoordinates = Rotate_x( x, y, z, 45 ); 
```

### Twist
```
Twist_x( _x, _y, _z, _x1, _x2, _theta1 = 0, _theta2 = 0 );
Twist_y( _x, _y, _z, _y1, _y2, _theta1 = 0, _theta2 = 0 );
Twist_z( _x, _y, _z, _z1, _z2, _theta1 = 0, _theta2 = 0 );
```

