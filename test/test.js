function test(test1, test2) {
  var temp = test1;
  var t = test2;
  function f(test) {
      return test;
  }

  return f(temp) ? f(t) : f(t - 1);
}
var i = 0;
while (i < 10) {
  i++;
  i += 2;
  if (i !== 0) {
    i++;
    var j = i;
    j++;
  }
  console.log(i);
    var t = 0;
    while (t<5){
      t++;
      console.log(t);
    }
}
console.log(1 ,2);

// i = 0;
// while (i < 5) {
//   i++;
//   i += 2;
//   if (i !== 0) {
//     i++;
//     var k = i;
//     k++;
//   }
// }