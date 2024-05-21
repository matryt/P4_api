const express = require('express');
const router = express.Router();
let auth = require("../middleware/auth");

const userMethods = require('../controllers/user');

router.post('/signup', userMethods.signup);
router.post('/signin', async (req, res, next) => await userMethods.signin(req, res, next));
router.delete("/", auth.verifyAdminAuth, async (req, res, next) => await userMethods.delete(req, res, next));

module.exports = router;