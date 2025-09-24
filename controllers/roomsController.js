
const roomService = require("../services/room.service");


module.exports = {
    getAll: async (req, res) => {
        try {
            const rooms = await roomService.getAll();
            console.log("✅ [ROOM CONTROLLER] Stanze recuperate:", rooms.length);
            res.json(rooms);
        } catch (err) {
            console.error("❌ [ROOM CONTROLLER] Errore getAll:", err);
            res.status(500).json({ message: "Errore recupero stanze" });
        }
    },

    getById: async (req, res) => {
        try {
            const room = await roomService.getById(Number(req.params.id));
            if (!room) {
                console.warn("⚠️ [ROOM CONTROLLER] Stanza non trovata:", req.params.id);
                return res.status(404).json({ message: "Stanza non trovata" });
            }
            res.json(room);
        } catch (err) {
            console.error("❌ [ROOM CONTROLLER] Errore getById:", err);
            res.status(500).json({ message: "Errore recupero stanza" });
        }
    },

    create: async (req, res) => {
        try {
            const newRoom = await roomService.create(req.body);
            console.log("✅ [ROOM CONTROLLER] Stanza creata:", newRoom);
            res.status(201).json(newRoom);
        } catch (err) {
            console.error("❌ [ROOM CONTROLLER] Errore create:", err);
            res.status(500).json({ message: "Errore creazione stanza" });
        }
    },

    update: async (req, res) => {
        try {
            const updatedRoom = await roomService.update(Number(req.params.id), req.body);
            if (!updatedRoom) {
                console.warn("⚠️ [ROOM CONTROLLER] Stanza non trovata per update:", req.params.id);
                return res.status(404).json({ message: "Stanza non trovata" });
            }
            console.log("✅ [ROOM CONTROLLER] Stanza aggiornata:", updatedRoom);
            res.json(updatedRoom);
        } catch (err) {
            console.error("❌ [ROOM CONTROLLER] Errore update:", err);
            res.status(500).json({ message: "Errore aggiornamento stanza" });
        }
    },

    delete: async (req, res) => {
        try {
            const deleted = await roomService.delete(Number(req.params.id));
            if (!deleted) {
                console.warn("⚠️ [ROOM CONTROLLER] Stanza non trovata per delete:", req.params.id);
                return res.status(404).json({ message: "Stanza non trovata" });
            }
            console.log("✅ [ROOM CONTROLLER] Stanza eliminata:", req.params.id);
            res.json({ message: "Stanza eliminata" });
        } catch (err) {
            console.error("❌ [ROOM CONTROLLER] Errore delete:", err);
            res.status(500).json({ message: "Errore eliminazione stanza" });
        }
    }
}

