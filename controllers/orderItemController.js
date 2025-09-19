const orderItemService = require('../services/orderItemService');
const logger = require('../utils/logger');

module.exports = {
  addOrderItem: async (req, res) => {
    try {
      const item = await orderItemService.addOrderItem(req.body);
      res.json(item);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  addIngredient: async (req, res) => {
    try {
      const ing = await orderItemService.addIngredient(req.body);
      res.json(ing);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  }
};
