//输入是一行多列的xls/xlsx文件
let startTime = +new Date();
console.log('词频统计开始，请耐心等待...');
let fs = require('fs');
let xlsx = require('node-xlsx');
if(!fs.existsSync('./xlsx/csv.xlsx')){
	console.log('需要提供csv.xlsx文件');
    return 
}
let xlsxData = xlsx.parse('./xlsx/csv.xlsx')[0].data;
let search = process.argv[2];
if(!search){
	console.log('需要提供筛选的词组');
    return 
}

// 词条里边含有正则转义字符，需要先转义。比如'C++'
let searchArr = search.split('|');
let regExpArr = [];
for(let i=0, len=searchArr.length; i<len; i++){
	let str = searchArr[i];
	if(/[*.?+$^\[\](){}|\\/]/.test(str)){
		str = str.replace(/([*.?+$^\[\](){}|\\/])/g, '\\$1');
	}
	regExpArr.push(str);
}
let regExp = new RegExp(regExpArr.join('|'));

// 开始统计
let count = 0;
for(let i=1, len=xlsxData.length; i<len; i++){
	let str = xlsxData[i].join('');
	if(regExp.test(str)) count++
}

let endTime = +new Date();
console.log(`查询的词条: ${search}, 在列表中一共出现 ${count} 次。共耗时：${(endTime-startTime)/1000}秒`);










