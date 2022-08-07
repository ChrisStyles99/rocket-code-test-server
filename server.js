require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const {validateBirthday} = require('./helpers/validations');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors({
  origin: 'http://localhost:3000'
}))

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const port = process.env.PORT || 5000;

// app.get('/createTable', (req, res) => {
//   const sql = `CREATE TABLE users_test_christian_rdz (
//       user_id INT NOT NULL AUTO_INCREMENT,
//       user_first_name VARCHAR(100) NOT NULL,
//       user_middle_name VARCHAR(100),
//       user_father_last_name VARCHAR(100) NOT NULL,
//       user_mother_last_name VARCHAR(100),
//       user_birthday DATE NOT NULL,
//       user_email VARCHAR(255) NOT NULL,
//       user_phone VARCHAR(20) NOT NULL,
//       PRIMARY KEY (user_id)
//   )`

//   connection.query(sql, (error, result) => {
//     if(error) throw error;

//     console.log(result);
//     res.send(result);
//   })
// })

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users_test_christian_rdz';

  connection.query(sql, (error, result) => {
    if(error) throw error;

    res.send(result);
  })
})

app.post('/newUser', (req, res) => {
  const sql = `INSERT INTO users_test_christian_rdz (user_first_name, user_middle_name, user_father_last_name, user_mother_last_name, user_birthday, user_email, user_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

  if(!req.body.firstName || !req.body.fatherLastName) {
    return res.status(400).json({error: true, message: 'Por favor mande su nombre completo'});
  }

  if(parseInt(req.body.year) > new Date().getFullYear()) {
    return res.status(400).json({error: true, message: 'Por favor mande una fecha valida'});
  }

  if(!req.body.email.includes('@')) {
    return res.status(400).json({error: true, message: 'Por  favor mande un e-mail valido'});
  }

  if(!/^(\(\+?\d{2,3}\)[\*|\s|\-|\.]?(([\d][\*|\s|\-|\.]?){6})(([\d][\s|\-|\.]?){2})?|(\+?[\d][\s|\-|\.]?){8}(([\d][\s|\-|\.]?){2}(([\d][\s|\-|\.]?){2})?)?)$/.test(req.body.phone)) {
    return res.status(400).json({error: true, message: 'Por favor mande un telefono celular valido'});
  }

  const birthday = validateBirthday(`${req.body.month} ${req.body.day} ${req.body.year}`);
  
  connection.query(sql, [req.body.firstName, req.body.middleName, req.body.fatherLastName, req.body.motherLastName, birthday, req.body.email, req.body.phone],(error, results) => {
    if(error) throw error;

    res.status(201).json({error: false, message: 'Usuario añadido con exito'});
  });

  // res.send('ok');
});

app.listen(port, () => {
  console.log(`Server on port ${port}`);
});