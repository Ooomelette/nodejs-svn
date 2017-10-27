# node-svn
svn


# Install

npm install -g node-svn

# Usage

var SVN = require('node-svn');
var svn = new SVN({
	username: '你的svn用户名',
	passwork: '你的svn密码',
	root: '你的svn路径，就是trunk和branches的路径'
});

在new svn的时候，需要传入config对象，这个对象是必须的

在初始化之后，你就可以进行svn操作了

比如： 
	svn.commit('-m "这是描述文本"', (err, res) => {
		console.log('成功后的回掉函数！')
	})

# API

callback

统一的回掉，这个回掉函数会传入2个参数，err和res， err存在于，res是执行命令subversion命令返回的结果

- svm.commit('-m "descript"', callback)
接收2两个参数，第一个参数是-m操作符和提交描述，中间必须用“空格”隔开，第二个参数为执行命令后的回掉

- svn.checkout('branches', 'path', callback)
接收3个参数，第一个参数是checkout的目录或者文件，第二个参数是把文件放在什么路径，第三个是回掉函数
svn.checkout('trunk', '../example/', (err, data) => {
	console.log(11111)
})

-




# 注意
路径是字符串相加，请保证路径的正确性，特别注意root和branches的路径组合，路径请使用相对于root的路径