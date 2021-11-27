const express = require('express');
const router = require("./router");
const app = express();
///////////////MIDLEWARES///////////////
app.use(express.json());
//////////////ROUTER/////////////////
app.use("/", router);

//app.listen(80, "192.168.0.103");
//app.listen(5000, () => console.log("server on port 5000")); //testing
///////////////////////////////
//https://afternoon-depths-32532.herokuapp.com/ | https://git.heroku.com/afternoon-depths-32532.git | https://git.heroku.com/afternoon-depths-32532.git
/////////////////////////

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}
app.listen(port, () => console.log("server on port"+ port));
module.exports = app;