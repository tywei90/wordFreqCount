# 基于 nodejs 的共词词频统计工具

1、去[node官网](https://nodejs.org/en/)下载安装node，配置node运行环境

2、下载本仓库
```
git clone https://github.com/tywei90/wordFreqCount.git
```

3、安装运行需要的包文件
```
cd wordFreqCount
npm install
```

4、将需要进行共词分析的excel文件命名为input.xlsx，格式为一列多行，每个词条是多个词之间是以'－'分隔开，如果出现'；'，则解析成两条词条；需要排除的词汇命名为del.xlsx，也是一列多行格式

5、运行方式
```
node init.js m n
```
m 参数是取一维词频(由高到低排序)的前m个作为输出，默认值：1000
n 参数是取一维词频(由高到低排序)的前n个做二维、三维、四维分析，默认值：500

6、文件数据很大，需要处理一段时间。统计完毕之后，生成文件为output.xlsx，包含一维到四维的数据。