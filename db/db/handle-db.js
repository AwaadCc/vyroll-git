const { compare } = require('bcryptjs');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const User = require('./User')

module.exports.connectLocalDatabase = async () => {
    mongoose.connect('mongodb://127.0.0.1:27017/vyroll-db')
}

module.exports.connect = async (mongoServer) => {
    await mongoServer.start();
    const uri = mongoServer.getUri()
    await mongoose.connect(uri , {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}

module.exports.closeDatabase = async (mongoServer) => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}

module.exports.createUser = async (username, password) => {
        try {
            const newUser = new User({username: username, password: password});
            await newUser.save();
            return newUser
        } catch (err) {
            throw err;
        }    
}

module.exports.deleteUser = async (username) => {
    User.deleteOne({username: username}).then(() => console.log("deleted " + username))
    return true;
}


/**
 * Verifies if a username that is passed to the server exists in our database.
 */
module.exports.verifyUserExists = async(username) => {
    const doc = await User.findOne({username: username})

    if (doc === null) {
        return false;
    }

    return true;
}

/**
 * Probably deprecated
 */
module.exports.verifyPassword = async (user, password) => {
    user.comparePassword(password, function(err, isMatch) {
        if(err) {
            console.log(err)
        }

        if(!isMatch) {}
    });
}

module.exports.addVideo = async(user, videoID) => {
    const doc = await User.findOne({username: user})
    if(doc.myVideos.includes(videoID))
        throw new Error("Already Exists!")
    else 
        await doc.myVideos.push(videoID)
    console.log(doc.myVideos)
}

module.exports.obtainUserInfo = async (username, password) => {
    const doc = await User.findOne({username: username});

    if (doc === null) {
        return null;
    } 
    
    const validPassword = await bcrypt.compare(password, doc.password)
    if (!validPassword) {
        return null;
    }

    const omitPassword = await JSON.parse(JSON.stringify(doc));
    delete omitPassword.password;
    return omitPassword;
}