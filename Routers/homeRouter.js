const express = require('express')
const router = express.Router()
const homeController = require('./../Controllers/homeController')

router.get('/', homeController.getProducts)
router.get('/random-products', homeController.getRandomProducts)
router.get('/new-products', homeController.getNewProducts)
router.get('/trending-products', homeController.getTrendingProducts)


module.exports = router;

