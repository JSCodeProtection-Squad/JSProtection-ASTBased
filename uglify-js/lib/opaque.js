var numeric = require('numeric');

function generate_crpto(N, m) {
    var array = (new Array(N)).fill(0);
    var _LEFT_ = 3.569946;
    var crpto = [];
    while (true) {
        if (finished(array))
            break;
        var a0 = Math.random();
        var u = numeric.add(numeric.mul(Math.random(), numeric.add(4, -_LEFT_)), _LEFT_);
        var A = [];
        A.push(generate(a0, u));
        for (var i = 0; i < N; i++)
            A.push(generate(A[i], u));

        var F = numeric.round(numeric.dot([[m]], [A]));
        var diff = count(F[0]);
        if (array[diff - 1] == 0) {
            array[diff - 1] = 1;
            var dic = {}
            dic['a'] = a0;
            dic['u'] = u;
            dic['ret'] = diff;
            crpto.push(dic);
        }
    }
    return crpto;
}


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
    var len = list.length;
    var ret = len;
    for (var i = 0; i < len - 1; i++) {
        for (var j = i + 1; j < len; j++) {
            var num = list[i];
            if (list[j] == num) {
                ret--; i++;
            }
        }
    }
    return ret;
}
function finished(array) {
    var test = (new Array(array.length)).fill(1);
    var ret = numeric.dot([array], numeric.transpose([test]));
    if (ret[0][0] == array.length)
        return true;
    return false;
}



