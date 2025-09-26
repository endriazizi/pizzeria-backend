const reservationsModel = require('../models/reservationsModel.js');

exports.getAll = async () => {
    return reservationsModel.fetchAll();
};

exports.getById = async (id) => {
    return reservationsModel.fetchById(id);
};

exports.create = async (data) => {
    return reservationsModel.insert(data);
};

exports.update = async (id, data) => {
    return reservationsModel.update(id, data);
};

exports.delete = async (id) => {
    return reservationsModel.remove(id);
};
