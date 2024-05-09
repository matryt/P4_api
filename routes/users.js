const express = require('express');
const router = express.Router();

const userMethods = require('../controllers/user');

router.post('/signup', userMethods.signup);
router.get('/signin', async (req, res, next) => await userMethods.signin(req, res, next));

module.exports = router;