#!/usr/bin/env node

const svn = require('./svn')
const parser = require('xml2json')
const path = require('path')

class subverion extends svn {
    constructor(config) {
        super(config)
        let {cwd = path.resolve(__dirname), repoName = 'SVN'} = config
        this.cwd = cwd
        this.repoName = repoName    
    }

    //svn.commit('-m descript', callback)
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
        let opt = Object.assign({ args: [path + params.path], callback: handleData, xml: true }, { command: 'info' })
        this.command(opt)
    }

    // svn.checkout('trunk', './', ()=>{})
    checkout() {
        let argument = Array.from(arguments);

        if (argument.length === 0 || (!argument[0] && typeof argument[0] !== 'string')) {
            throw new Error('[SVN ERROR:404] checkout input err, please input again')
            return false
        }

        let branches = this.root + argument[0],
            handleData = (err, data) => {
                if (!err) {
                    data = 'success'
                }
                typeof arguments[1] === 'function' && arguments[1](err, data);
            };

        let opt = Object.assign({ args: [branches, this.repoName], callback: handleData, options: {cwd: this.cwd} }, { command: 'checkout' })
        this.command(opt)
    }

    //svn.list('http://rep/', callback)
    list() {
        let path = this.root
        let params = this.parseArgs(Array.from(arguments))
        let handleData = (err, data) => {
            params.callback && params.callback(err, data.lists.list)
        }
        let opt = Object.assign({ args: [path + params.path], callback: handleData, xml: true }, { command: 'list' })
        this.command(opt)
    }

    // svn.switch('./branches/test')
    switch (branches, callback) {
        if (typeof branches !== 'string') {
            throw new Error('[SVN ERROR:404] switch params err, please input again')
            return false
        }
        let opt = Object.assign({
            args: [this.root + branches],
            callback: callback
        }, { command: 'switch' })
        this.command(opt)
    }

    cleanup() {
        let params = this.parseArgs(Array.from(arguments))
        let handleData = (err, data) => {
            let result = null;
            if (!err) {
                result = {
                    message: 'success',
                    data: data
                }
            }
            params.callback && params.callback(err, result)
        }
        let opt = Object.assign( {callback: handleData }, { command: 'cleanup' })
        this.command(opt)
    }

    // core
    command(opts) {
        let needxml = opts.xml
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
            options: {
                cwd: path.resolve(this.cwd, this.repoName) //执行command所在的目录
            }
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