

# nodejs-svn
nodejs-svn是svn在nodejs中的实现，旨在用nodejs控制版本，我用于线上的自动化构建工具。它由2部分组成，svnjs和indexjs，svnjs是nodejs实现svn的核心，它只包含核心的方法。相对独立。indexjs是对svn命令行的扩展，封装了一些常用的api。该库由es6的class编写，你可以根据自己的喜好和需求重新进行封装，当然这个要求你对[svn命令行](http://www.riaoo.com/subpages/svn_cmd_reference.html)有一定的了解。


# Install


```code
  npm install nodejs-svn -S
  
```


# Usage

```code
    var SVN = require('node-svn');
    var svn = new SVN({
        username: '你的svn用户名',
        passwork: '你的svn密码',
    	root: '你的svn路径，就是trunk和branches的路径',
    	debug: true, // 是否在控制台打印调试信息
    	cwd: path.resolve(__dirname, './'), //仓库存放的目录
    	repoName: 'zyb_front', //仓库name
    });
```

在new svn的时候，需要传入config对象，这个对象是必须的，其中svn的命令是在你填写的repoName中执行，如果您有额外的需求，可以使用通用方法command（），它是svn的核心方法。

在初始化之后，你就可以进行svn操作了

比如： 

```code
    svn.commit('-m "这是描述文本"', (err, res) => {
		console.log('成功后的回掉函数！')
	})
```


# API

- callback
统一的回掉，这个回掉函数会传入2个参数，err和res， err存在于，res是执行命令subversion命令返回的结果


- svn.commit('-m "descript"', callback)
接收2两个参数，第一个参数是-m操作符和提交描述，中间必须用“空格”隔开，第二个参数为执行命令后的回掉

```code
    eg： 
        svn.commit('-m "descript"', callback)
        
```


- svn.info(branches，callback)
接收最多2个参数，第一个参数是分支信息（可以为远端信息，也可以是本地库信息，不传默认本地库信息并且在root + repoName 目录下），第二个参数是回掉函数。

```code
    eg： 
        svn.info(callback);
    	svn.info('svn://test/repo', callback)
    	svn.info(path.resolve(__dirname, './'), callback)
```

- svn.checkout
接受2个参数，第一个是必须参数->分支，第二个参数是回掉函数->callback,分支检出在repoName文件夹下，目录为cwd

```code
    eg: 
    svn.checkout('branches/test-branches', callback)
	svn.checkout('trunk', (err, data) => {})
```



- svn.list
接收最多2个参数，第一个参数是分支信息（可以为远端信息，也可以是本地库信息，不传默认本地库信息并且在root + repoName 目录下），第二个参数是回掉函数。

```code
    eg： 
        svn.list(callback);
    	svn.list('svn://test/repo', callback)
    	svn.list(path.resolve(__dirname, './'), callback)

```


- svn.switch
接收最多2个参数，第一个参数是需要切换的分支名字，第二个参数是回掉函数。

```code
    eg： 
        svn.switch('trunk');
    	svn.list('branches/test', callback)

```


- svn.cleanup
接收最多1个回掉函数。

```code
    eg： 
        svn.cleanup(callback);

```


## 核心方法
- svn.command()
接受一个options对象，这个对象会对象包含以下信息：

```code
    options： {
        command: '', // 需要执行的命令 比如：switch
        args: [], // 执行svn命令的参数，比如： list --xml --username xxx --user password ***
        options: { // 运行spawn的一些参数，具体可参考nodejs文档
            cwd: path.resolve(this.cwd, this.repoName) //执行command所在的目录
        }
    }
```



# 注意
路径是字符串相加，请保证路径的正确性，特别注意root和branches的路径组合，路径请使用相对于root的路径
nodejs参考文档： http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options


## 后记
如果你还满意，不妨给我一颗star，这将成为我的动力！ths！









