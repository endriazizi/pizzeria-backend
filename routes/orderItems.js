const express = require('express');
const router = express.Router();
const orderItemController = require('../controllers/orderItemController');

router.post('/', orderItemController.addOrderItem);
router.post('/ingredient', orderItemController.addIngredient);

module.exports = router;
