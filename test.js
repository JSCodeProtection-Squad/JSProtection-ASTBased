var numeric =  require('numeric')
var N =10;
var A = [[1,2],
    [1,1]];

var xy = numeric.random([2,10])
console.log(xy)
out = numeric.mod(numeric.dot(A, xy), 1);
console.log(out);

