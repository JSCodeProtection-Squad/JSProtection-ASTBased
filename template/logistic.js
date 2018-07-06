function logistic(r, N, m) {
    var a0 = r['a'];
    var u = r['u'];
    var A = [];
    A.push(generate(a0, u));
    for (var i = 0; i < N; i++)
        A.push(generate(A[i], u));

    var F = numeric.round(numeric.dot([[m]], [A]));
    var diff = count(F[0]);
    return diff
}