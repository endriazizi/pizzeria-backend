const db = require("../config/db");

module.exports = {
    getAll: async () => {
        console.log("📡 [ROOM SERVICE] Recupero tutte le stanze...");
        const [rows] = await db.query("SELECT * FROM rooms");
        return rows;
    },
    // ,

    // async getById(id) {
    //     console.log(`🔎 [ROOM SERVICE] Recupero stanza con id=${id}`);
    //     const [rows] = await db.query("SELECT * FROM rooms WHERE id = ?", [id]);
    //     return rows.length ? rows[0] : null;
    // },

    // async create(room) {
    //     console.log("➕ [ROOM SERVICE] Creazione stanza:", room);
    //     const [result] = await db.query(
    //         "INSERT INTO rooms (name, seats, description) VALUES (?, ?, ?)",
    //         [room.name, room.seats, room.description || null]
    //     );
    //     return { id: result.insertId, ...room };
    // },

    // async update(id, room) {
    //     console.log(`✏️ [ROOM SERVICE] Aggiornamento stanza id=${id}`, room);
    //     await db.query(
    //         "UPDATE rooms SET name=?, seats=?, description=? WHERE id=?",
    //         [room.name, room.seats, room.description || null, id]
    //     );
    //     return this.getById(id);
    // },

    // async delete(id) {
    //     console.log(`🗑️ [ROOM SERVICE] Eliminazione stanza id=${id}`);
    //     const [result] = await db.query("DELETE FROM rooms WHERE id=?", [id]);
    //     return result.affectedRows > 0;
    // },
}

