# SRA

This Project was developed when I Student Research Assistant, it consists of an web based F-Rep modeling system based on HyperFun (http://hyperfun.org/).
In F-Rep the axis operations must me performed first, after thet they can be applied to the primitives, and finally we can use boolean, and other operations.

# Instructions:

- open the html file to run
- press w to toggle wireframe modes
- to declare a variable: var a = 5


# Axis Operations

- Translate

Translate( _x, _y, _z, t_x = 0, t_y = 0, t_z = 0 );
In order to translate an object we need to input first the coordinates we want to translate from and then the amount we want to translate in each axis.
for example:
var newCoordinates = Translate(x, y, z, 1, 0, 0 );
