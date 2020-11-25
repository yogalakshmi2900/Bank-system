const express          = require('express');
const bodyParser       = require('body-parser');
const cors             = require('cors');
const app              = express();
const mongoose         = require('mongoose');
const dbConfig         = require('./config/db.js');
const expressValidator = require('express-validator');

app.use(expressValidator())
app.use(cors())

// Connecting to the database
mongoose.connect(dbConfig.url, {
    useNewUrlParser   : true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false

}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});
mongoose.set('useFindAndModify', false);
app.use('/uploads', express.static('uploads'));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false,useUnifiedTopology: true }))
// parse application/json
app.use(bodyParser.json());

app.use(cors());

// importing routes files
require('./routes/')(app);

app.listen(dbConfig.port, dbConfig.hostname, () => {
  console.log(`Server running at http://${dbConfig.hostname}:${dbConfig.port}/`);
});
