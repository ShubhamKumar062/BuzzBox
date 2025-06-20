require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectedDB = require("./config/db"); 

const auth = require('./routes/auth');
const post = require('./routes/post');
const groups = require('./routes/groups');
const polls = require('./routes/polls');
const mod = require('./routes/mod');

const app = express();
const PORT = process.env.PORT ;

app.use(cors());
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/posts', post);
app.use('/api/groups', groups);
app.use('/api/polls', polls);
app.use('/api/mod', mod);

connectedDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App is working on port ${PORT}`);
  });
}).catch((error) => console.log("MongoDB Connection Error:", error));
