function test(test1, test2) {
  var temp = test1;
  var t = test2;
  
  return temp ? t : t - 1;
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
}
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