var numeric = require('numeric')
// var n =10;
// var A = [[1,2],
//     [1,1]];
// var m = n/3
// var N = numeric.round(numeric.dot(numeric.round([m]),numeric.random([1, n])));
// console.log(N);
// var xy = numeric.random([2,10]);
// console.log("xy============================");
// console.log(xy);
// out = numeric.mod(numeric.dot(A, xy), 1);
// console.log("M============================");
// console.log(out);
// // var _N = numeric.round(numeric)

// console.log(m);
// console.log("_N============================");
// var _N = numeric.round(numeric.dot(numeric.transpose(out),[[m/2.0],[m/2.0]]));
// console.log(_N);
const N = 5;
const m = 10;
const _LEFT_ = 3.569946;
var a0 = Math.random();
var u = numeric.add(numeric.mul(Math.random(), numeric.add(4, -_LEFT_)), _LEFT_);
var A = [];
A.push(generate(a0, u));
for (var i = 0; i < N; i++)
    A.push(generate(A[i], u));

var F = numeric.round(numeric.dot([[m]], [A]));
console.log(a0);
console.log(u);
console.log(A);
console.log(F);

function generate(a_n, u) {
    if (0 <= a_n <= 0.5) {
        return numeric.mul(numeric.mul(numeric.mul(4, u), a_n), numeric.add(0.5, -a_n));
        // return 4*u*a_n*(0.5-a_n);
    }
    else if (0.5 <= a_n <= 1) {
        return numeric.add(1, -numeric.mul(4, numeric.mul(a_n, numeric.mul(numeric.add(0.5, -a_n), numeric.add(1, -a_n)))));
        // return 1-4*u*a_n*(0.5-a_n)*(1-a_n);
    }
    return 0
}

function count(list) {
    var len = len(list);
    var ret = len;
    for (var i = 0; i < ret - 1; i++) {
        for (var j = i + 1; j < ret; j++) {
            var num = list[i];
            if (list[j] == num) {
                // 重复，数组总长度减1
                ret--;

                i++;
            }
        }
    }
}