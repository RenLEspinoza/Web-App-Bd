const express = require("express");
const router = express.Router();
const transferController = require("../controllers/transferController");

router.post("/transferir", transferController.transferirDinero);

module.exports = router;
