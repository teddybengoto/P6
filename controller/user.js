const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../bd/models/user');


exports.signup = (req, res) => {

    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            const user = new User({ email: req.body.email, password: hash });

            user.save()
                .then((user) => {
                    res.status(201).json({ "message": "user creat successfully" })
                })
                .catch((e) => { res.status(400).json({ e }) });
        })
        .catch((e) => { res.status(500).json({ e }) })

}

exports.login = (req, res) => {

    User.findOne({ email: req.body.email })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ 'message': "email ou mot de passe incorrect" })
            }

            bcrypt.compare(req.body.password, user.password)
                .then(result => {

                    if (result) {
                        return res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                'sss',
                                { expiresIn: '24h' }
                            )
                        });
                    }
                    res.status(401).json({ 'message': "email ou mot de passe incorrect " })
                });

        })
        .catch((e) => { 
            console.log('hello');
            console.log("e: ",e);
            res.status(401).json({ e }) });
}

exports.test = (req, res) => {

    res.status(200).json({ "massag": "I'm a test" })

}