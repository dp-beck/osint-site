const express = require('express');
const router = express.Router();
const user_controller = require("../controllers/userController.js");

/* GET users listing. */
router.get('/:id', user_controller.user_detail);

module.exports = router;
