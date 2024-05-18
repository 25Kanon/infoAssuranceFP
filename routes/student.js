const express = require('express');
const router = express.Router();

const studentController = require('../controllers/StudentController.js');

router.get('/', studentController.list);

router.post('/verify', studentController.verify);

router.get('/show/:id', studentController.show);

router.get('/create', studentController.create);

router.post('/save', studentController.save);

router.get('/edit/:id', studentController.edit);

router.post('/update/:id', studentController.update);

router.post('/delete/:id', studentController.delete);

module.exports = router;