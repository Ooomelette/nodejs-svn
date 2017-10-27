const svn = require('./svn')
const parser = require('xml2json')
const path = require('path')

class subverion extends svn {
    constructor(config) {
        super(config)
        this.formatData = config.formatData || ''
    }

    //svn.commit('-m "descript"', callback)
    commit(args, callback) {
        if (!args || typeof args !== 'string' || (typeof args === 'string' && args.indexOf(' ') === -1)) {
            throw new Error('[SVN ERROR:404] svn commit command desc err, please input again')
            return false
        }
        let index = args.indexOf(' ')
        let operate = args.slice(0, index)
        let desc = args.slice(index + 1)
        let opt = Object.assign({ args: [operate, desc] }, { command: 'commit' })
        this.command(opt)
    }

    //svn.info('http://rep/', callback)
    info() {
        let path = this.root
        let params = this.parseArgs(Array.from(arguments))

        let handleData = (err, data) => {
            params.callback && params.callback(err, data.info.entry);
        }
        let opt = Object.assign({ args: [path + params.path], callback: handleData }, { command: 'info' })
        this.command(opt)
    }

    // svn.checkout('trunk', './', ()=>{})
    checkout() {
        let argument = Array.from(arguments);

        if (argument.length === 0) {
            throw new Error('[SVN ERROR:404] checkout input err, please input again')
            return false
        }

        if (!argument[0] && typeof argument[0] !== 'string') {
            throw new Error('[SVN ERROR:404] checkout params err, please input again')
            return false
        }

        let params = this.parseArgs(argument.slice(1))

        let cwd = path.resolve(__dirname),
            branches = this.root + argument[0],
            callback;

        if (params.path) {
            cwd = path.resolve(cwd, params.path)
        }

        if (params.callback) {
            callback = (err, data) => {
            	if (!err) {
            		data = 'success'
            	}
                params.callback(err, data)
            }
        }

        let opt = Object.assign({ args: [branches], callback: callback, options: { cwd: cwd }, xml: false }, { command: 'checkout' })

        this.command(opt)
    }

    //svn.list('http://rep/', callback)
    list(opts) {
        let path = this.root
        let params = this.parseArgs(Array.from(arguments))
        let handleData = (err, data) => {
            params.callback && params.callback(err, data.lists.list)
        }
        let opt = Object.assign({ args: [path + params.path], callback: handleData }, { command: 'list' })
        this.command(opt)
    }

    switch (opts) {
        let opt = Object.assign(opts, { command: 'switch' })
        this.command(opt)
    }

    // core
    command(opts) {
        let needxml = opts.xml === false ? false : true
        // 处理返回的xml
        let callback = (err, data) => {
            if (typeof opts.callback === 'function') {
                let result = data
                if (needxml) {
                    result = data ? this.string2json(data) : null
                }
                opts.callback(err, result)
            }
        }

        let opt = Object.assign({
            command: '',
            args: [],
            options: {}
        }, opts, { callback: callback })

        if (!opt.command) {
            throw new Error('[SVN ERROR:404] svn command not found')
            return false
        }

        if (this.debug) {
            console.log('[SVN Queue]: ', opt)
        }
        this.pushQueue(opt)
        this.run()
    }

    string2json(str) {
        let result = parser.toJson(str)
        return JSON.parse(result)
    }

    parseArgs(arr) {
        let len = arr.length,
            path = '',
            callback = null;

        switch (len) {
            case 0:
                {
                    break;
                }
            case 1:
                {
                    if (typeof arr[0] === 'string') {
                        path = arr[0];
                    } else if (typeof arr[0] === 'function') {
                        callback = arr[0]
                    }
                    break;
                }
                // 大于等于2
            default:
                {
                    path = arr[0];
                    callback = arr[1];
                }
        }

        return {
            path: path,
            callback: callback
        }
    }
}

module.exports = subverion;