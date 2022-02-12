const logRouter = require('./logRouter')
const userRouter = require('./userRouter')
const devRouter = require('./devRouter')
const ctrlRouter = require('./ctrlRouter')
const dataRouter = require('./dataRouter')

let CoreRouter = {
  route: function (app) {
    app.use('/login', logRouter)
    app.use('/user', userRouter)
    app.use('/dev', devRouter)
    app.use('/ctrl', ctrlRouter)
    app.use('/data', dataRouter)
  }
}


module.exports = CoreRouter