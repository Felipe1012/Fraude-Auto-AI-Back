const router = require("express").Router();
const params = require("../params");
const fs = require("fs");
const apiPost = require("../utils/watsonML");

// Watson NLU Route for analize text
router.post("/upload-text", async function (req, res) {
  const inputText = req.body.text;
  var btoa = require("btoa");
  var request = require('request');
  console.log("hola")

  // Paste your Watson Machine Learning service apikey here
  var apikey = "OsN5YGaPVWgAFSrsC1o3LFXDnAFNdNUQdGRZuRMOo_7E";

  // Use this code as written to get an access token from IBM Cloud REST API
  //
  var IBM_Cloud_IAM_uid = "bx";
  var IBM_Cloud_IAM_pwd = "bx";
  var options = {
    url: "https://iam.bluemix.net/oidc/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd)
    },
    body: "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey"
  };
var iam_token
  request.post(options, function (error, response, body) {
     iam_token = JSON.parse(body)["access_token"];
    //console.log(iam_token)
 
        console.log(iam_token)


        const scoring_url = "https://us-south.ml.cloud.ibm.com/ml/v4/deployments/e77dff64-78c3-4ec1-a950-212417740eb6/predictions?version=2020-09-30";

        const wmlToken = "Bearer " + iam_token;
         var payload=JSON.stringify(inputText)
         payload = payload.replace(/\\/g, "");

         console.log(payload)
        apiPost(scoring_url, wmlToken, payload, function (resp) {
          let parsedPostResponse;
          try {
            parsedPostResponse = JSON.parse(this.responseText);
          } catch (ex) {
            // TODO: handle parsing exception
          }
          console.log("Scoring response");
          console.log(parsedPostResponse);
          res.send(parsedPostResponse)

        }, function (error) {
          console.log(error);
        });
  });

});
module.exports = router;
