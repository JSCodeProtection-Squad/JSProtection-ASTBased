var a = 5;
var i = 0;
while (i < 10) {
    a = i;
    // i++;
    //
    // if (a === i) {
    //     i++;
    // }
}

//不透明谓词，改写while循环
for (var next = 0; ;) {
    //跳出无限循环的条件，值为length + 1
    if (next === 4) {
        break;
    }
    //控制流平坦化，body个数为length + 1
    switch (next) {
        case 0:
            if ('condition') {
                next = 1;
            } else {
                next = 4;
            }
            break;
        case 1:
            //语句
            next = 1;
            break;
    }
}