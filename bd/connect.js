const mongoose = require('mongoose');

let attempt = 0;

let conect = () => {
  mongo_uri = "mongodb+srv://PiiquanteApi:P72Pu93oxGYB4NQf@cluster0.cdoqs9d.mongodb.net/test"
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
  console.log("connecting to database...")

  mongoose.connect(mongo_uri, options)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => {
      console.log('Connexion à MongoDB échouée !');
      setTimeout(conect, 5 * attempt * 1000);
      attempt++;

    });
}

module.exports.conect = conect;






