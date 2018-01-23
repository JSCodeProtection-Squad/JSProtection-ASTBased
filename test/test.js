function test(test1, test2) {
  var temp = test1;
  var t = test2;
  if (temp) {
    t = 1;
  }
  return t;
}
var i = 0;
while (i < 10) {
  i++;
  i += 2;
  if (i !== 0) {
    i++;
  }
}