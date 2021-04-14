const jwt = require("jsonwebtoken");
require("dotenv").config();
const expressJwt = require("express-jwt");
const _ = require("lodash");

exports.signup = async (req, res) => {
    // const userExists = await User.findOne({ email: req.body.email });
    // if (userExists)
    //     return res.status(403).json({
    //         error: 'Email is taken!'
    //     });
    //const user = await new User(req.body);
    //await user.save();
    //res.status(200).json({ message: 'Signup success! Please login.' });
   
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let role = "subscriber";

    // send the player's details to the database

    let query =
        "INSERT INTO `users` (name, email, password, role) VALUES ('" +
        name +
        "', '" +
        email +
        "', '" +
        password +
        "', '" +
        role +
        "')";
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.status(200).send(result);
    });
};

exports.signin = (req, res) => {
    // find the user based on email
    const { email, password } = req.body;

    let query = "SELECT * FROM `users` WHERE email = '" + email + "'";

    db.query(query, (err, result) => {
        
        let user = result[0];
        if (err) {
            return res.status(500).send(err);
        }
        // generate a token with user id and secret
        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET
        );
        // persist the token as 't' in cookie with expiry date
        res.cookie("t", token, { expire: new Date() + 9999 });
        // retrun response with user and token to frontend client
        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

exports.signout = (req, res) => {
    res.clearCookie("t");
    return res.json({ message: "Signout success!" });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth",
});

