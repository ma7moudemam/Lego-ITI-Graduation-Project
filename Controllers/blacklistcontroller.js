const errorHandeler = require("./errorHandeler.js");
const BlacklistModel = require('./../Models/blacklistModel');
const OrderModel = require("./../Models/orderModel");
const UserModel = require("./../Models/userModel");

const CronJob = require('cron').CronJob;

const job = new CronJob(
    '* 23 * * * *',
    function() {
        let x=0;
        let arr =[]
        const users = await UserModel.find({});
        for (let i=0;i<users.length ; i++){
            const userOrders = await OrderModel.find({"user" : users[i].email})
            for (let i=0; i< userOrders.length -1; i++){
                if (userOrders[i].order_date == (userOrders[i+1].order_date) ) {
                    arr = arr.push(userOrders[i].user)
                    x +=1; 
                }else{
                    x =0
                }
            }
        }

        let removeDuplicatedEmail = new Set(arr)
        if (x >= 1){
            return removeDuplicatedEmail
        } else {
            return "No fake users"
        }
       // return "cron job workes"
    },
    null,
    true,
);
// console.log(job)


// function fun() {
//     return new async((req, res) => {
//         var job = new CronJob('01 * * * * *', function() {
//                 var a = 5;
//                 var b = 2;

//                 res.send(a + b);

//             }, function() {},
//             true
//         );
//     })
// }

// console.log(fun())

// exports.getBlockUsers = async(req , res) => {

//     // if(req.role == "admin"){
//         try{

//             res.send(fun())

//             // console.log(job())
//             // if(job){
//             //     res.send(job)
//             // }else{
//             //     res.send("NO User Found")
//             // }
        
//         }catch(e){
//             res.status(400).send(e)  
//         }
    

//     // }else {
//     //     throw new Error ("not authintcated")
//     // }
// }


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
                return res.status(404).send();
            }
            res.status(302).send(user);
    }).catch((e) =>{
        res.status(500).send(e);
    })

    }else {
        throw new Error ("not authintcated")
    }
    

}







