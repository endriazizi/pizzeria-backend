const db = require('../config/db');

exports.getAll = async (req, res, next) => {
    console.log("ECCO", res.json(rows))
    try {
        const [rows] = await db.execute('SELECT * FROM rooms');
        console.log("ECCO", res.json(rows))
        res.json(rows);
        console.log("ECCO", res.json(rows))
    } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
    try {
        const [rows] = await db.execute('SELECT * FROM rooms WHERE id=?', [req.params.id]);
        res.json(rows[0] || null);
    } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
    try {
        const { name, description, seats } = req.body;
        const [result] = await db.execute(
            'INSERT INTO rooms (name, description, seats) VALUES (?, ?, ?)',
            [name, description, seats]
        );
        res.json({ room_id: result.insertId, name, description, seats });
    } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
    try {
        const { name, description, seats } = req.body;
        await db.execute(
            'UPDATE rooms SET name=?, description=?, seats=? WHERE id=?',
            [name, description, seats, req.params.id]
        );
        res.json({ message: 'Room updated' });
    } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
    try {
        await db.execute('DELETE FROM rooms WHERE id=?', [req.params.id]);
        res.json({ message: 'Room deleted' });
    } catch (err) { next(err); }
};
