export { };

const userCtrl = require('../controllers/user.controller');

const express = require('express');
const router = express.Router();

router.route('/api/v0/user')
    .post(userCtrl.create)
    .get(userCtrl.read)
    .put(userCtrl.update)
    .delete(userCtrl.remove);

router.route('/api/v0/users')
    .get(userCtrl.readAll);

module.exports = router;
