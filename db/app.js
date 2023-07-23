const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dbFunc = require('./db/handle-db')
const usersRoute = require('./routes/UsersRoute')

const app = express()
const port = 3080

// Make connection to mongo db on local machine
dbFunc.connectLocalDatabase();

// Setup npm configurations
app.use(cors({origin: '*'}))
app.use(bodyParser.json())

// Setup our routes
app.use('/users', usersRoute)


// Listen on port 3000
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
