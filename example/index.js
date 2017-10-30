const SVN = require('../src/index');
const path = require('path')
const svn = new SVN({
	username: 'yangbo',
	password: 'yangbo123',
	root: 'svn://svn.code.anzogame.com:9528/service/zyb_front/',
	debug: true,
	cwd: path.resolve(__dirname, './'),
	repoName: 'zyb_front', //仓库name
})

// svn.info((err, data) => {
// 	console.log('data', data);
// })


// svn.list((err, data) => {
// 	console.log('data', data);
// })

svn.checkout('trunk', (err, data) => {
	console.log(11111)
})

// svn.list('branches', (err, data) => {
// 	console.log('svn branches: ', data)

// })

// svn.switch('branches/20170928-ugc', '../example/trunk/', (err, data) => {
// 	console.log('data', data);
// 	console.log('err', err)
// })

svn.cleanup((err, data) => {
	console.log('err', err)
	console.log('data', data)
})