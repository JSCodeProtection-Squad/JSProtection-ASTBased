/**
 * Created by leegend on 2018/1/22.
 */
for (var next = 0; ;) {
    if (next === 3) {
        break;
    }
    switch (next) {
        case 0:
            if ('condition') {
                next = 1;
            } else {
                next = 3;
            }
            break;
        case 1:
            next = 0;
            break;
    }
}