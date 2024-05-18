const Student = require('../models/Student');

const studentController = {};

const encrypt = (text, decrypt = false) => {
    const s = decrypt ? (26 - 18) % 26 : 18;
    const n = s > 0 ? s : 26 + (s % 26);
    return [...text]
        .map((l, i) => {
            const c = text.charCodeAt(i);
            if (c >= 65 && c <= 90)
                return String.fromCharCode(((c - 65 + n) % 26) + 65);
            if (c >= 97 && c <= 122)
                return String.fromCharCode(((c - 97 + n) % 26) + 97);
            return l;
        })
        .join('');
};

studentController.list = async (req, res) => {
    try {
        const students = await Student.find({});
        res.render('../views/student/index', { students });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
};

studentController.verify = async (req, res) => {
    try {
        const students = await Student.find({});
        const studentForm = req.body;
        var valid = false
        var student;

        for (var i in students) {
            var studemail = encrypt(encrypt(students[i]['email'], true), true);
            var studpass = encrypt(encrypt(students[i]['password'], true), true);
            if (studentForm.email == studemail && studentForm.password == studpass) {
                valid = true;
                var id = students[i]['id'];
                student = await Student.findById(id);
            }
        }

        if (valid) {
            res.redirect('/students/show/' + id);
        } else {
            res.render('../views/student/index');
        }

    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
};

studentController.show = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        const id = student._id;
        let studentDetails = {
            'name': encrypt(encrypt(student.name, true), true),
            'address': encrypt(encrypt(student.address, true), true),
            'yearLevel': encrypt(encrypt(student.yearLevel, true), true),
            'course': encrypt(encrypt(student.course, true), true)
        };

        /* let studentDetails = {
            'name': encrypt(student.name, true),
            'address': encrypt(student.address, true),
            'yearLevel': encrypt(student.yearLevel, true),
            'course': encrypt(student.course, true)
        }; */

        if (!student) {
            return res.status(404).send("Student not found");
        }
        res.render('../views/student/show', { id, studentDetails });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
};

studentController.create = (req, res) => {
    res.render('../views/student/create');
};

studentController.save = async (req, res) => {
    try {
        const student = new Student({
            name: encrypt(encrypt(req.body.name)),
            email: encrypt(encrypt(req.body.email)),
            password: encrypt(encrypt(req.body.password)),
            address: encrypt(encrypt(req.body.address)),
            course: encrypt(encrypt(req.body.course)),
            yearLevel: encrypt(encrypt(req.body.yearLevel)),
            updated_at: Date.now()
        });
        await student.save();
        console.log('Successfully created a student');
        res.redirect('/students/show/' + student._id);
    } catch (err) {
        console.error(err);
        if (err.name == 'ValidationError') {
            const validationErrors = Object.values(err.errors).map(error => error.message);
            return res.status(400).render('../views/student/create', { errors: validationErrors });
        }
        res.status(500).send('Internal server error');
    }
};

studentController.edit = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        let id = student._id;
        let studentDetails = {
            'name': encrypt(encrypt(student.name, true), true),
            'address': encrypt(encrypt(student.address, true), true),
            'yearLevel': encrypt(encrypt(student.yearLevel, true), true),
            'course': encrypt(encrypt(student.course, true), true)
        };


        if (!student) {
            return res.status(404).send('Student not found');
        }
        res.render('../views/student/edit', { id, studentDetails });
    } catch (err) {
        console.error('Error: ', err);
        res.status(500).send('Internal server error');
    }
};

studentController.update = async (req, res) => {
    try {
        const id = req.params.id;
        const student = await Student.findByIdAndUpdate(req.params.id, {
            name: encrypt(encrypt(req.body.name)),
            address: encrypt(encrypt(req.body.address)),
            course: encrypt(encrypt(req.body.course)),
            yearLevel: encrypt(encrypt(req.body.yearLevel)),
        }, { new: true });
        res.redirect('/students/show/' + id);
    } catch (err) {
        //console.error(err);
        //res.status(400).render('../views/student/edit', { student: req.body, error: 'Failed to update student: ' + err.message });
        const id = req.params.id;
        res.redirect('/students/show/' + id);
    }
};

studentController.delete = async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(req.params.id);
        if (!deletedStudent) {
            return res.status(404).send('Student not found');
        }
        console.log('Student deleted!');
        res.redirect('/students');
    } catch (err) {
        //console.error(err);
        //res.status(500).send('Internal server error');
    }
};

module.exports = studentController;