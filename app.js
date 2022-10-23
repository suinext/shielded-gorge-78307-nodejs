const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended :true}));


app.get("/", function(req, res){
  res.sendFile(__dirname + "/sign-up.html");
})

app.post("/", function(req, res){
  var firstname = req.body.fName;
  var lastname = req.body.lName;
  var emailaddress = req.body.eMail;

  var data = {
    members: [
      {
        email_address: emailaddress,
        status: "subscribed",
        merge_fields: {
          FNAME:firstname,
          LNAME:lastname
        }
      }
    ]
  }
  var jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/c7aa58dfc0"
  const options ={
    method: "POST",
    auth: "uchitha86:df95d7b5ed9cc0fe2a89d31bef1ff430-us5"
  }

  const request = https.request(url, options, function(response){
    response.on("data", function(data){
      if (response.statusCode === 200){

          res.sendFile(__dirname + "/success.html");

      }else{

          res.sendFile(__dirname + "/failure.html")

      }
    })
  })
  request.write(jsonData);
  request.end();

})

// MAILCHIMP CONFIGURATION

//audience id c7aa58dfc0
//api key  df95d7b5ed9cc0fe2a89d31bef1ff430-us5
////////////////////////////////////////////////////////////
app.post("/failure.html", function(req, res){
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
  console.log("server is running on port 3000");
})
