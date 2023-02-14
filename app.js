const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));// to use css folder located inside public folder
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/signup.html"); //absolute path
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    var data ={
        members : [ // key=members : value=[]
            { //here MEMBERS is key whose VALUE is an ARRAY OF OBJECTS
                email_address : email, // key : value
                status : "subscribed",
                merge_fields : 
                    {
                        FNAME : firstName,
                        LNAME : lastName
                    }
                
            }
            
        ]
    };

    const jsonData = JSON.stringify(data);
    //const url = "https://us14.api.mailchimp.com/3.0/lists/2c60ea34e5"; 
    const url =  "https://us14.api.mailchimp.com/3.0/lists/2c60ea34e5"

    const options = {
        method : "POST",
        //old API key with name "Posted in public, do not enable"  & not active now
        //auth : "tahira:31338d3e705b4c9bed9a03a134367cc4-us14"// name:password i.e API key
        //new API key with name "newsletter-signup"  & active now on MAILCHIMP
        auth : "tahira:3fd2f42693e16ae419eae421b946e4f8-us14"
    };

   const request = https.request(url, options, function(response){//here response is not built-in, we can name it anything
    if(response.statusCode === 200){
        res.sendFile(__dirname + "/success.html");
    }  
    else{
        res.sendFile(__dirname + "/failure.html");
    }
    
    response.on("data", function(data){
          console.log(JSON.parse(data));
      });
    });

     request.write(jsonData); 
     request.end();

});


app.post("/failure", function(req,res){ //means a Post Request is made from "failure.html page"
    res.redirect("/"); //takes to the "HOME ROUTE PAGE"
});





app.listen(process.env.PORT || 3003, function(){ //process is a HEROKU object to tell to run on their chosen port
    console.log("Server running");
});

//API KEY
//31338d3e705b4c9bed9a03a134367cc4-us14

//Audience ID
//2c60ea34e5

// --data @- \
// <<EOF | jq '.id'
// {
//   "email_address": "$user_email",
//   "status": "pending",
//   "merge_fields": {
// 	"FNAME": "$user_fname",
// 	"LNAME": "$user_lname",
// 	"BIRTHDAY": "$user_birthday",
// 	"ADDRESS": {
//            "addr1": "123 Freddie Ave",
//            "city": "Atlanta",
//            "state": "GA",
//            "zip": "12345",

//      }
//   }
// }
// EOF