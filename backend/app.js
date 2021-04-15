const express = require('express');
const app = express();
const mysql = require('mysql');
const morgan = require('morgan');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createConnection ({
    host: 'localhost',
    user: 'newuser',
    password: '#{2gaM7N{*6>}aTH',
    database: 'health_records'
});

// connect to database
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});
global.db = db;
// bring in routes
const patientRoutes = require('./routes/patient');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// apiDocs
/*
app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});
*/
// middleware -
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

app.use('/api', authRoutes);
app.use('/api', patientRoutes);
app.use('/api', userRoutes);
app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
});
