const jwt = require('jsonwebtoken')
const UserModel = require('./../Models/userModel')

const auth = async (req, res, next) => {
    try {
        const token = req.get("Authorization").split(" ")[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        const user = await UserModel.findOne({email : decoded.email})
        if (!user) {
            throw new Error()
        }
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}

module.exports = auth