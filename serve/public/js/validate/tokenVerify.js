var jwt = require('jsonwebtoken');
var signkey = 'whistle';

exports.setToken = function(username,userid){
	return new Promise((resolve,reject)=>{
		const token = jwt.sign({
			name:username,
			_id:userid,
			cert: true
		},signkey,{ expiresIn:'24h', algorithm: 'HS256'});
		resolve(token);
	})
}

//浏览器会多次请求
exports.verToken = function(token){
	return new Promise((resolve,reject)=>{
		// console.log(token.split(' ')[1])
		var info = jwt.verify(token.split(' ')[1],signkey);
		resolve(info);
	})
}
