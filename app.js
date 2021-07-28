require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dialogflow = require("@google-cloud/dialogflow")
const { v4: uuidv4 } = require('uuid');
const Path = require("path")


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/getlist",async (req,res)=>{
  console.log(path.join(__dirname, 'key.json'));
  const intentsClient = new dialogflow.IntentsClient({
    keyFilename: path.join(__dirname, 'key.json')
  });
  const projectAgentPath = intentsClient.projectAgentPath("shahebazahamed-sdfu");

  console.log(projectAgentPath);

  const request = {
    parent: projectAgentPath,
  };

  // Send the request for listing intents.
  const [response] = await intentsClient.listIntents(request);
  response.forEach(intent => {
    console.log('====================');
    console.log(`Intent name: ${intent.name}`);
    console.log(`Intent display name: ${intent.displayName}`);
    console.log(`Action: ${intent.action}`);
    console.log(`Root folowup intent: ${intent.rootFollowupIntentName}`);
    console.log(`Parent followup intent: ${intent.parentFollowupIntentName}`);

    console.log('Input contexts:');
    intent.inputContextNames.forEach(inputContextName => {
      console.log(`\tName: ${inputContextName}`);
    });

    console.log('Output contexts:');
    intent.outputContexts.forEach(outputContext => {
      console.log(`\tName: ${outputContext.name}`);
    });
  });
  res.json({data:response})
})

var port = process.env.PORT || 8080;

app.listen(port,function () {
  console.log(`Server is running at the ${port}`);

});
module.exports=app
