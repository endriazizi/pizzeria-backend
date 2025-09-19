const orderService = require('../services/orderService');
const logger = require('../utils/logger');

module.exports = {
  createGuestOrder: async (req, res) => {
    try {
      const order = await orderService.createGuestOrder(req.body);
      res.json(order);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  getOrdersByTable: async (req, res) => {
    try {
      const orders = await orderService.getOrdersByTable(req.params.table_id);
      res.json(orders);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const order = await orderService.getOrderById(req.params.order_id);
      res.json(order);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  assignOrderToUser: async (req, res) => {
    try {
      const updated = await orderService.assignOrderToUser(req.params.order_id, req.body.user_id);
      res.json(updated);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  deleteOrder: async (req, res) => {
    try {
      const deleted = await orderService.deleteOrder(req.params.order_id);
      res.json(deleted);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  listPendingGuestOrders: async (req, res) => {
    try {
      const list = await orderService.listPendingGuestOrders();
      res.json(list);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  }
};
