const crypto = require('crypto');

var obj = crypto.createHash('md5');
obj.update('123456');
// console.log(obj);
//以十进制输出
var str = obj.digest('hex');
console.log(str);