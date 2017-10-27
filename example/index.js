const SVN = require('../src/index');

const svn = new SVN({
	password: '',
	username: '',
	root: 'svn://svn.code.anzogame.com:9528/service/zyb_front/',
	debug: true
})


// svn.info((err, data) => {
// 	console.log('data', data);
// })


// svn.list((err, data) => {
// 	console.log('data', data);
// })

svn.checkout('trunk', '../example/', (err, data) => {
	console.log(11111)
})

