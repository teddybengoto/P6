const fs = require('fs');

const Sauce = require('../bd/models/sauce');

exports.getSauces = (req, res) => {

    Sauce.find({})
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}

exports.getOneSauce = (req, res) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(404).json({ error }));
}

exports.creatSauce = (req, res) => {

    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce(
        {
            ...sauceObject,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        }
    );

    sauce.save()
        .then(() => { res.status(201).json({ message: "Votre sauce a bien été enregistré" }) })
        .catch(e => res.status(400).json({ e }));

}

exports.updateSauce = async (req, res, next) => {

    // Get Object details 
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`

    } : { ...req.body };

    delete sauceObject._id;
    delete sauceObject._userId;

    const sauceObjectQuary = {
        ...sauceObject,
        userId: req.auth.userId,
        _id: req.params.id
    }

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            if (sauce.userId != req.auth.userId) {
                return res.status(403).json({ "message": "unauthorized request" });
            }
            else {

                const filename = sauce.imageUrl.split('/images/')[1];

                fs.unlink('./images/' + filename, () => {
                    Sauce.updateOne({ _id: req.params.id }, sauceObjectQuary)
                        .then(resul => {
                            res.status(200).json({ 'message': "Votre sauce à bien été mise à jour" });
                        })
                        .catch(error => res.status(401).json({ error }));

                });

            }

        })
        .catch(e => { res.status(500).json({ e }) });

}

exports.deleteSauce = (req, res, next) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ "message": "unauthorized request" });
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1];

                fs.unlink('./images/' + filename, (er) => {
                    console.log('er: ');

                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => { res.status(200).json({ 'message': "Votre sauce à bien été supprimé" }) })
                        .catch((e) => { res.status(401).json({ e }) });

                });

            }

        })
        .catch((e) => { res.status(500).json({ e }) })
}

exports.likeSauce = (req, res) => {

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {

            let reqUserId = req.auth.userId;

            switch (req.body.like) {
                case 1: // like

                    if (sauce.usersLiked.includes(reqUserId)) {

                        return res.status(401).json({ "message": "Vous avez déjà aimé cette sauce" });
                    }
                    else {

                        sauce.usersLiked.push(reqUserId);
                        sauce.usersDisliked = sauce.usersDisliked.filter(userId => { userId !== reqUserId });
                    }

                    break;
                case 0: // cancell like or dislike

                    if (!(sauce.usersDisliked.includes(reqUserId) || sauce.usersLiked.includes(reqUserId))) {

                        return res.status(401).json({ "message": "Vous avez déjà effectué cette requete" });

                    } else {

                        sauce.usersLiked = sauce.usersLiked.filter(el => { el !== reqUserId; });
                        sauce.usersDisliked = sauce.usersDisliked.filter(el => { el !== reqUserId; });
                    }

                    break;
                case -1: // dislike

                    if (sauce.usersDisliked.includes(reqUserId)) {

                        return res.status(401).json({ "message": "Vous avez déjà effectué cette requete" });
                    }
                    else {

                        /*sauce.usersDisliked = sauce.usersDisliked.filter(el => { el !== reqUserId });
                        sauce.usersLiked = sauce.usersLiked.filter((el) => { el !== reqUserId });*/

                        sauce.usersDisliked.push(reqUserId);
                        sauce.usersLiked = sauce.usersLiked.filter(userId => { userId !== reqUserId });
                    }

                    break;

                default:
                    return res.status(500).json({ e })
            }

            Sauce.updateOne({ _id: req.params.id }, sauce)
                .then(() => { return res.status(200).json({ "message": "votre requet a bien été enregistré" }) })
                .catch(e => { return res.status(500).json({ e }) });

        })
        .catch(e => res.status(500).json({ e }));
}

