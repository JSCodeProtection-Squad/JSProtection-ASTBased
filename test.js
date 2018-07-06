var numeric =  require('numeric')
var n =10;
var A = [[1,2],
    [1,1]];
var m = n/3
var N = numeric.round(numeric.dot(numeric.round([m]),numeric.random([1, n])));
console.log(N);
var xy = numeric.random([2,10]);
console.log("xy============================");
console.log(xy);
out = numeric.mod(numeric.dot(A, xy), 1);
console.log("M============================");
console.log(out);
// var _N = numeric.round(numeric)

console.log(m);
console.log("_N============================");
var _N = numeric.round(numeric.dot(numeric.transpose(out),[[m/2.0],[m/2.0]]));
console.log(_N);

