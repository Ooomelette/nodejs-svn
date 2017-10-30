// svn 核心方法

const spawn = require('child_process').spawn
const path = require('path')
class SVN {
    constructor(config) {
        let { password = '', username = '', root = '', debug = false, cwd = path.resolve(__dirname)} = config
        this.password = password
        this.username = username
        this.root = root
        this.queues = []
        this.isRuning = false
        this.debug = debug
        this.cwd = cwd
    }

    run() {
    	let _this = this;
        if (this.isRuning || this.queues.length === 0) {
        	return 
        }
        this.isRuning = true

        let params = this.queues.shift(),
            text = '',
            err = null;

        let callback = params.callback;

        if (this.debug) {
        	console.log('[SVN COMMAND]: ' + params.command + ' ' +  params.args.join(' '))
        }

        let proc = spawn(params.command, params.args, params.options);

        // 执行成功
        proc.stdout.on('data', (data) => {
        	text += data
        })

        //执行失败
        proc.stderr.on('data', (data) => {
            data = String(data)
            err = new Error(data)
        })

        // 进程错误
        proc.on('error', (error) => {
            var result = null,
                err = new Error('[SVN ERROR:404] svn command not found')
            if (error.code === 'ENOENT' && callback) {
                callback(err, text, params)
            }
            this.isRuning = false
            this.run()
        })

        // 进程关闭
        proc.on('close', (code) => {
            callback && callback(err, text, params)
            this.isRuning = false
            this.run()
        })
    }

    pushQueue(cmds) {
        let { command = '', args = [], options = {}, callback = null, xml = false} = cmds;

        if (callback && typeof callback !== 'function') {
            console.log('callback 参数必须是一个函数，而不是一个' + typeof callback);
            return false
        }

        let opts = {
            command: 'svn',
            args: [command].concat(args),
            options: Object.assign({cwd: this.cwd}, options),
            xml: xml,
            callback: callback
        }

        if (opts.xml) {
        	opts.args = opts.args.concat(['--xml']);
        }

        opts.args = opts.args.concat(['--non-interactive', '--trust-server-cert'])

        if (this.username && this.password) {
            opts.args = opts.args.concat(['--username', this.username, '--password', this.password])
        }

        this.queues.push(opts)
    }
}

module.exports = SVN