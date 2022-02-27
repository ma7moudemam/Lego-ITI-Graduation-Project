const errorHandeler = require("./errorHandeler.js")
const UserModel = require('./../Models/userModel')
// const jwt = require('jsonwebtoken')

// Just for testing
exports.postUser = (req, res, next) => {
    errorHandeler(req);
    let data = req.body.name
    if (!data) {
        res.status(500).send(e)
    }
        res.status(200).send({ data });
}

// To generate token
// exports.userLogin = (req, res, next) => {
//     errorHandeler(req)

//     const user = new UserModel(req.body)
//     let token = jwt.sign(
// 					{
// 						email: req.body.email,
// 					},
// 					process.env.SECRET_KEY,
// 					{ expiresIn: "25h" }
//                 );
    
//     user.save().then((data) => {
//         console.log(token)
//         res.status(200).send({data , token})
//     }).catch((e) => {
//         res.status(500).send(e)
//     })
// }

// Get Users => Admin
exports.getAllUsers = (req, res, next) => {
    errorHandeler(req)
    console.log("All users")

    UserModel.find({}).then((users) => {
        res.status(200).send(users)
    }).catch((e) => {
        res.status(500).send(e)
    })
}

// Get User-Profile
exports.getProfile = (req, res, next) => {
    errorHandeler(req)
    res.status(200).send(req.user)
}

// Update User-Profile
exports.updateProfile = (req, res, next) => {
    errorHandeler(req)

    // Case => update not valid keys 
    const updates = Object.keys(req.body)
    const allwoedUpdates = ['email', 'password', 'age', 'address', 'country', 'street', 'city', 'building']
    const isValidOperation = updates.every((update) =>
        allwoedUpdates.includes(update) )
    if (!isValidOperation) {
        return res.status(400).send("error: Invalid updates!")
    }

    UserModel.findById(req.user._id).then((user) => { 
        if (!user) {
            throw new Error("User Not Found")
        }

        updates.forEach((update) => {
            user[update] = req.body[update]
        })

        // console.log(user)
        return user.save()
    }).then((data) => {
        res.status(201).send({data})
    }).catch((e) => {
        res.status(500).send(e)
    })

}

// Delete User-Profile 
exports.deleteProfile = (req, res, next) => {
    errorHandeler(req)

    UserModel.findByIdAndDelete(req.user._id).then((user) => {
        if (!user) {
            return res.status(404).send()
        }
        res.status(302).send(user)
    }).catch((e) => {
        res.status(500).send(e)
    })
}
