const express = require("express")
require('./public/js/db/connect')
const app = express()
const PORT = 8082
const staticPath = __dirname
let path = require('path')

const logRouter = require('./public/js/routes/logRouter')
const userRouter = require('./public/js/routes/userRouter')
const devRouter = require('./public/js/routes/devRouter')
const ctrlRouter = require('./public/js/routes/ctrlRouter')
const dataRouter = require('./public/js/routes/dataRouter')
const regRouter = require('./public/js/routes/regRouter')
userRouter.stp = staticPath
regRouter.stp = staticPath

var verToken = require('./public/js/validate/tokenVerify');
const cookieParser = require('cookie-parser')

app.use(cookieParser())
// 解析token获取用户信息
app.use(['/user','/dev','/ctrl','/data'], function(req, res, next) {
	var token = req.cookies.token || req.headers['authorization']
	console.log(token)
	if(token == undefined){
		return next();
	}else{
		token = "Cfun " + token
		verToken.verToken(token).then((data)=> {
			req.userx = data;
			return next();
		}).catch((error)=>{
			res.send('token失效, 请重新登录')
			// return next();
		})
	}
});




app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/reg', express.static(path.join(staticPath, 'public')))
app.use(express.static(path.join(staticPath, '')))

app.use('/login', logRouter)
app.use('/user', userRouter)
app.use('/dev', devRouter)
app.use('/ctrl', ctrlRouter)
app.use('/data', dataRouter)
app.use('/reg', regRouter)



// app.get("/", (req, res) => {
// 	// console.log(req.cookies)
//   res.sendFile(`${staticPath}/index.html`)
// })



app.listen(PORT, () => {
  console.log(`server works on port:${PORT}`)
})