const Order = require('../models/order');

module.exports = {
  createGuestOrder: (data) => Order.create(data),
  getOrdersByTable: (table_id) => Order.findByTable(table_id),
  getOrderById: (order_id) => Order.findById(order_id),
  assignOrderToUser: (order_id, user_id) => Order.assignToUser(order_id, user_id),
  deleteOrder: (order_id) => Order.delete(order_id),
  listPendingGuestOrders: () => Order.listPendingGuests()
};
