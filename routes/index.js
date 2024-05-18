var express = require('express');
var router = express.Router();

const studentController = require('../controllers/StudentController.js')

/* GET home page. */
router.get('/', studentController.list);

module.exports = router;
