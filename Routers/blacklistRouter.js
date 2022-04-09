const express = require('express');
const router = express.Router();
const blacklistController = require('./../Controllers/blacklistcontroller');
const auth = require('./../middelWare/auth')

// router.get('/', blacklistController.getBlockUsers)
router.post('/',auth, blacklistController.addBlockUsers)
router.delete('/',auth, blacklistController.deleteBlockUsers)
module.exports=router;
