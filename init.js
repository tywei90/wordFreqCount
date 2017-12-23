
//输入是一行多列的xls/xlsx文件
let startTime = +new Date();
console.log('词频统计开始，请耐心等待...');
let fs = require('fs');
let xlsx = require('node-xlsx');
let xlsxData = xlsx.parse('input.xlsx')[0].data;
let xlsxDel=[];

let oneDimSize = process.argv[2]||1000;
let twoDimSize = process.argv[3]||500;

// 需要排除的数据
if(fs.existsSync('del.xlsx')){
    xlsxDel = xlsx.parse('del.xlsx')[0].data;
}

// 格式化: 带'；'分隔的词条为两个词条
let data = [];
for(let i=0, len=xlsxData.length; i<len; i++){
	data = data.concat(xlsxData[i][0].split("；"));
}

// 将对象数组转换成node-xlsx的输出格式
function transToXlsForm(arr){
	let out = [];
	for(let i=0, len=arr.length; i<len; i++){
		for(key in arr[i]){
			out[i] = out[i]||[];
			out[i].push(arr[i][key]);
		}
	}
	return out
}


// <--------- 筛选出一维数据begin --------->
let dataStr = data.join('－');

// 排除 + 去重
let uniqDataSet = new Set(dataStr.split('－'));
for(let i=0, len=xlsxDel.length; i<len; i++){
	uniqDataSet.delete(xlsxDel[i][0]);
}
let uniqData = [...uniqDataSet];

let oneItem = [];
// 统计频次
for(let i=0, len=uniqData.length; i<len; i++){
	// 需要前后加分隔符，否则统计出来虚高
	let str = '－' + uniqData[i] + '－';
	let reg = str;
	// 词条里边含有正则转义字符，需要先转义。比如'C++'
	if(/[*.?+$^\[\](){}|\\/]/.test(str)){
		reg = str.replace(/([*.?+$^\[\](){}|\\/])/g, '\\$1');
	}
	let regExp = new RegExp(reg, 'g');
	oneItem[i] = oneItem[i]||{};
	oneItem[i].count = (dataStr.match(regExp)||[]).length;
	oneItem[i].item = uniqData[i];
}
// 排序
oneItem.sort(function(a,b){
	return b.count - a.count;
})
oneItem = oneItem.slice(0, oneDimSize);

let endTime1 = +new Date();
console.log('一维词频统计完毕，耗时：' + (endTime1 - startTime)/1000 + '秒');
// <--------- 筛选出一维数据end --------->


// <--------- 筛选出二维数据begin --------->
let twoData = [];
let twoItem = [];
let threeItem = [];
let fourItem = [];
let twoObj={};
let threeObj={};
let fourObj={};
for(let i=0, len=Math.min(twoDimSize, oneItem.length); i<len; i++){
	twoData.push(oneItem[i].item);
}
// 字符长的排在前面，因为正则从前面开始匹配，防止比如'教学'匹配到'教学参考资料'
twoData.sort(function(a, b){
	return b.length - a.length
})
// 正则转义
twoData.forEach(function(val,index){
	if(/[*.?+$^\[\](){}|\\/]/.test(val)){
		twoData[index] = val.replace(/([*.?+$^\[\](){}|\\/])/g, '\\$1');
	}
})
let regExp2 = new RegExp(twoData.join('|'), 'g');
for(let i=0, len=data.length; i<len; i++){
	let matchArr =  data[i].match(regExp2);
	reduceSetObj(matchArr);
}

function reduceSetObj(arr){
	if(!arr || (arr.length == 1)) return
	arr.sort();
	// 统计二维词频
	if(arr.length > 1){
		for(let i=0, len=arr.length-1; i<len; i++){
			for(let j=i+1,len2=arr.length; j<len2; j++){
				// 注意：运算符优先级 +  > ||
				twoObj[arr[i]+'－'+arr[j]] = (twoObj[arr[i]+'－'+arr[j]]||0) + 1;
			}
		}
	}
	// 统计三维词频
	if(arr.length > 2){
		for(let i=0, len=arr.length-2; i<len; i++){
			for(let j=i+1,len2=arr.length-1; j<len2; j++){
				for(let k=j+1,len3=arr.length; k<len3; k++){
					threeObj[arr[i]+'－'+arr[j]+'－'+arr[k]] = (threeObj[arr[i]+'－'+arr[j]+'－'+arr[k]]||0) + 1;
				}
			}
		}
	}
	// 统计四维词频
	if(arr.length > 3){
		for(let i=0, len=arr.length-3; i<len; i++){
			for(let j=i+1,len2=arr.length-2; j<len2; j++){
				for(let k=j+1,len3=arr.length-1; k<len3; k++){
					for(let m=k+1,len4=arr.length; m<len4; m++){
						fourObj[arr[i]+'－'+arr[j]+'－'+arr[k]+'－'+arr[m]] = (fourObj[arr[i]+'－'+arr[j]+'－'+arr[k]+'－'+arr[m]]||0) + 1;
					}
				}
			}
		}
	}
}
// 格式化二维词频
for(key in twoObj){
	twoItem.push({count: twoObj[key], item: key});
}
twoItem.sort(function(a,b){
	return b.count - a.count;
})
// 格式化三维词频
for(key in threeObj){
	threeItem.push({count: threeObj[key], item: key});
}
threeItem.sort(function(a,b){
	return b.count - a.count;
})
// 格式化四维词频
for(key in fourObj){
	fourItem.push({count: fourObj[key], item: key});
}
fourItem.sort(function(a,b){
	return b.count - a.count;
})



let endTime2 = +new Date();
console.log('二维、三维、四维词频统计完毕，耗时：' + (endTime2 - endTime1)/1000 + '秒');
// <--------- 筛选出二维数据end --------->
 
 

// <--------- 输出文件 --------->
console.log('正在写入文件...');
// 输出
transOneItem = transToXlsForm(oneItem);
transTwoItem = transToXlsForm(twoItem);
transThreeItem = transToXlsForm(threeItem);
transFourItem = transToXlsForm(fourItem);
var outBuffer = xlsx.build([
	{name: "一维词频统计", data: transOneItem}, 
	{name: "二维词频统计", data: transTwoItem},
	{name: "三维词频统计", data: transThreeItem},
	{name: "四维词频统计", data: transFourItem}
]);
fs.writeFileSync('output.xlsx', outBuffer);

let endTime3 = +new Date();
console.log('写入完毕，总共耗时：' + (endTime3 - startTime)/1000 + '秒');















