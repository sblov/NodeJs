/*
* @Author: Administrator
* @Date:   2018-11-29 22:29:52
* @Last Modified by:   Administrator
* @Last Modified time: 2018-11-29 22:59:22
*/
//引入自定义模块 : ./
//输出数据： exports
//
//require: 引入模块
//	对于自定义模块，将js文件放入node_modules文件夹下，在引入时可以忽略./,
//	模块查询路径：系统模块优先，后本地模块

/*
exports.a = 1;
exports.b = 2;
exports.c = 3;
*/

module.exports = {a: 1,b: 2,c: 3};
console.log(module.exports == exports);