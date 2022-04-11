const errorHandeler = require("./errorHandeler.js");
const BlacklistModel = require('./../Models/blacklistModel');
const OrderModel = require("./../Models/orderModel");
const UserModel = require("./../Models/userModel");

const CronJob = require('cron').CronJob;

const blackUserList = new CronJob(
    '* 23 * * * *',
    async function() {
        let blockUserCount=0;
        let blockUsers =[]
        const users = await UserModel.find({});
        for (let i=0;i<users.length ; i++){
            const userOrders = await OrderModel.find({"user" : users[i].email})
            for (let i=0; i< userOrders.length -1; i++){
                if (userOrders[i].order_date == (userOrders[i+1].order_date) ) {
                    blockUsers = blockUsers.push(userOrders[i].user)
                    blockUserCount +=1; 
                }else{
                    blockUserCount =0
                }
            }
        }
       //  let removeDuplicatedUsers = new Set(blockUsers)
        if (blockUserCount >= 1){
            return removeDuplicatedUsers
        } else {
            return "No fake users"
        }
    },
    null,
    true,
);

exports.addBlockUsers = (req,res,next) =>{
    errorHandeler(req);

    if(req.role == "admin"){
        let object = new BlacklistModel({
            user: req.body.user,
        });
        object.save()
            .then((data) => res.status(200).json({ data }))
            .catch((error) => next(error));
    }else {
        throw new Error ("not authintcated")
        
    }
}

exports.deleteBlockUsers = (req,res,next) =>{
    errorHandeler(req);

    if(req.role == "admin"){
        BlacklistModel.findOneAndDelete({ user : req.body.user })
    .then((user)=>{
        if (!user) {
                return res.status(404).send("No user found");
            }
            res.status(200).json({ user })
    }).catch((e) =>{
        (e) => next(e)
    })
    }else {
        throw new Error ("not authintcated")
    }
}







