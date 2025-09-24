


const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/roomsController');
const { authenticate, authorize } = require('../middlewares/authMiddleware');

router.get('/', getAll);
router.use(authenticate);

// router.get('/:id', getById);
// router.post('/', authorize('admin'), create);
// router.put('/:id', authorize('admin'), update);
// router.delete('/:id', authorize('admin'), remove);

module.exports = router;







//const RoomController = require("../controllers/rooms.controller");
//const { authenticateToken } = require("../middlewares/auth");
//const { Router } = require("express");
//const router = Router();

//const controller = new RoomController();

// Rotte protette con JWT
// router.get("/", authenticateToken, controller.getAll.bind(controller));
// router.get("/:id", authenticateToken, controller.getById.bind(controller));
// router.post("/", authenticateToken, controller.create.bind(controller));
// router.put("/:id", authenticateToken, controller.update.bind(controller));
// router.delete("/:id", authenticateToken, controller.delete.bind(controller));

//module.exports = router;
