

const mongoose = require('mongoose');
CONNECTION_STRING = "mongodb+srv://Alioune:E7hNRvzjkeMk7lrw@myfirst.0l30bb6.mongodb.net/StayNomad"

const connectionString = CONNECTION_STRING;

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));
