const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');
let logger = require("./Logger");
app.use(cors());
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let questionRoute = require('./routes/question.js');
app.use('/api/q',questionRoute);
let userRoute = require("./routes/user.js");
app.use("/api/u",userRoute);
app.use(express.static('client/build'));
app.get('*',(req,res)=>{
	res.sendFile(path.resolve(__dirname,'client','build','index.html'));
});
app.listen(process.env.PORT || 5000, ()=>{
	logger.debug("App listening at",process.env.PORT || 5000);
});