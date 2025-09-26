const reservationsService = require('../services/reservationsService.js');
const logger = require('../utils/logger');

exports.getAll = async (req, res, next) => {
    try {
        const reservations = await reservationsService.getAll();
        res.json(reservations);
    } catch (err) {
        logger.error(`❌ getAll Reservations Error: ${err.message}`);
        next(err);
    }
};

exports.getById = async (req, res, next) => {
    try {
        const reservation = await reservationsService.getById(req.params.id);
        res.json(reservation || null);
    } catch (err) {
        logger.error(`❌ getById Reservations Error: ${err.message}`);
        next(err);
    }
};

exports.create = async (req, res, next) => {
    try {
        const reservationId = await reservationsService.create(req.body);
        res.json({ reservation_id: reservationId });
    } catch (err) {
        logger.error(`❌ create Reservation Error: ${err.message}`);
        next(err);
    }
};

exports.update = async (req, res, next) => {
    try {
        await reservationsService.update(req.params.id, req.body);
        res.json({ message: 'Reservation updated' });
    } catch (err) {
        logger.error(`❌ update Reservation Error: ${err.message}`);
        next(err);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await reservationsService.delete(req.params.id);
        res.json({ message: 'Reservation deleted' });
    } catch (err) {
        logger.error(`❌ delete Reservation Error: ${err.message}`);
        next(err);
    }
};
