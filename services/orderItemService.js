const OrderItem = require('../models/orderItem');
const OrderItemIngredient = require('../models/orderItemIngredient');

module.exports = {
  addOrderItem: (data) => OrderItem.create(data),
  addIngredient: (data) => OrderItemIngredient.create(data)
};
