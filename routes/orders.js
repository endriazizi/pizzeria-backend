const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createGuestOrder);
router.get('/table/:table_id', orderController.getOrdersByTable);
router.get('/:order_id', orderController.getOrderById);
router.post('/:order_id/assign-user', orderController.assignOrderToUser);
router.delete('/:order_id', orderController.deleteOrder);
router.get('/guests/pending', orderController.listPendingGuestOrders);

module.exports = router;
