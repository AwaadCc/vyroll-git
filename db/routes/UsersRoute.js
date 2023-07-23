const express = require('express')
const router = express.Router()
const dbFunc = require('../db/handle-db')

/**
 * Route to determine if a user exists based on the given username.
 */
router.post('/user-verify', async (req, res) => {

    const username = req.body.username
    let exists = await dbFunc.verifyUserExists(username)

    let responseObj = {
        exists: exists
    }

    res.send(JSON.stringify(responseObj))
})

/**
 * Will attempt to create an acccount based on the username and password
 * passed in the body of the request. It will respond with a JSON object
 * that correlates to the status of the request to create a new user and a
 * message with more detail.  Ensure this gets called via useEffect in order
 * to avoid crashing the server via entering duplicate keys when using this in 
 * react components.
 */
router.post('/user-create', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    console.log(req.body)
    let responseObj = { status: 'unfulfilled', statusMsg: '' }

    let exists = await dbFunc.verifyUserExists(username)

    if (exists) {
        responseObj = {
            status: 'failed',
            statusMsg: 'User already exists.'
        }
    } else {
        if (dbFunc.createUser(username, password)) {
            responseObj = {
                status: 'success',
                statusMsg: 'User account created successfully!',
                uname: username
            }
        }
    }

    res.send(JSON.stringify(responseObj))
})

router.post('/user-upload', async (req, res) => {
	const username = req.body.username;
	const videoID = req.body.videoID;

	let responseObj = { status: 'unfulfilled', statusMsg: '' }

	dbFunc.addVideo(username, videoID);

	responseObj = {
        status: 'success',
        statusMsg: 'User account created successfully!',
        uname: username,
        vids: videoID
    }

	res.send(JSON.stringify(responseObj))
})

/**
 * Will attempt to delete a user based on the username passed in the body
 * of the request.  Response will handle similary to the user-create route.
 */
router.post('/user-delete', async (req, res) => {
    const username = req.body.username

    let responseObj = { status: 'unfulfilled', statusMsg: '' }

    let exists = await dbFunc.verifyUserExists(username)

    if (!exists) {
        responseObj = {
            status: 'failed',
            statusMsg: 'User does not exist.'
        }
    } else {
        dbFunc.deleteUser(username)
        responseObj = {
            status: 'success',
            statusMsg: 'User deleted successfully.'
        }
    }

    res.send(JSON.stringify(responseObj))
})

/**
 * Will handle a post request from the client attempting to login
 * with the given credentials.  If the user successfully enters
 * a matching username and password, we will send the client the corresponding
 * user object that will contain all the user information.
 */
router.post('/user-login', async (req, res) => {
    const username = req.body.username
    const password = req.body.password
    let responseObj = { status: 'unfulfilled', statusMsg: '', userObj: undefined }

    console.log("r")

    let userInfo = await dbFunc.obtainUserInfo(username, password);

    if (userInfo === null) {
        responseObj = {
            status: 'failed',
            statusMsg: 'Incorrect username or password',
            userObj: undefined
        }
    } else {
        responseObj = {
            status: 'success',
            statusMsg: 'User has successfully logged in',
            userObj: userInfo
        }
    }

    res.send(JSON.stringify(responseObj))
})

module.exports = router