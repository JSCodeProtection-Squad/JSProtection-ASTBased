/**
 * Created by leegend on 2018/1/22.
 */
//不透明谓词，改写while循环
for (var next = 0; ;) {
  //跳出无限循环的条件，值为length + 1
  if (next === 3) {
    break;
  }
  //控制流平坦化，body个数为length + 1
  switch (next) {
    case 0:
      if ('condition') {
        next = 1;
      } else {
        //该值为长度+1
        next = 4;
      }
      break;
  }
}