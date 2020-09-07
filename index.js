const fs = require('fs');
const csv = require('csv-parser');
const randomWords = require('random-words');
const users = [];

async function quickstart(review) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    //Assign's the review as the document data source
    const document = {
      content: review,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const [sentityresult] = await client.analyzeEntitySentiment({document});
    
    const sentiment = result.documentSentiment;
    
  
    //Output overall sentiment to console
    console.log(`#########################`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    console.log(`#########################`);
    const sentences = result.sentences;
    sentences.forEach(sentence => {  
        console.log(`Sentence: ${sentence.text.content}`);  
        console.log(`  Score: ${sentence.sentiment.score}`);  
        console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
    });

    //Output Entity Sentiments to log
    const sentities = sentityresult.entities;
    console.log('Entities and sentiments:');
    sentities.forEach(entity => {
      console.log(`  Name-: ${entity.name}`);
      console.log(`  Score: ${entity.sentiment.score}`);});
    
    //return objects from Google NL API
    return [sentiment.score, sentities ]

  }

  //Initiate fs writer instance
  var writestream = fs.createWriteStream('outputfile.csv');
  writestream.write("Comment,Overall Sentiment,QR,Email,Huawei,NHS,Isle of Wight,All Sentiments" + "\n")

  //Begin Read Stream for CSV
  fs.createReadStream('input.csv')
    .pipe(csv())
    .on('data', async function(row) {

      //Create an instance of the quickstart function
      const sentimentAnalysis = await quickstart(row.Firstname);

      var hasqr = 'N/A';
      var hasnhs = 'N/A';
      var hasiow = 'N/A'; 
      var hashw = 'N/A';
      var hasemail = 'N/A';
      var espair = '';

      //Loop through Result Set for Entity Sentiments and Scores
      sentimentAnalysis[1].forEach(entity => {
        espair = espair + entity.name + ":"+ entity.sentiment.score + ", ";
        var entityname = entity.name.toLowerCase();

        //Check for QR Entity Sentiment Score
        if(entityname.includes('qr')){
          hasqr = entity.sentiment.score;
        }

        //Check for Isle of Wight Entity Sentiment Score
        else if(entityname.includes('isle of wight')){
          hasiow = entity.sentiment.score;
        }

        //Check for Email Entity Sentiment Score
        else if(entityname.includes('email')){
          hasemail = entity.sentiment.score;
        }

        //Check for Huawei Entity Sentiment Score
        else if(entityname.includes('huawei')){
          hashw = entity.sentiment.score;
        }

        //Check for NHS Entity Sentiment Score
        else if(entityname.includes('nhs')){
          hasnhs = entity.sentiment.score;
        }
      });

      // Create User Object
      const user = {
        firstname: row.Firstname,
        sentiment: sentimentAnalysis[0],
        entitySentiment: espair,
      };
      
      // Output User details ont CSV Line
      var comment = user.firstname.replace(/"/g, '""');
      var csvline = "\"" + comment + "\"" + ","  + user.sentiment + "," + hasqr + "," + hasemail + "," + hashw + ","+ hasnhs + ","+ hasiow + "," + "\""  + user.entitySentiment + "\"" + "\n";
      const outputfile = "outputnhs.csv";

      "Comment,Overall Sentiment,QR,Email,Huawei,NHS,Isle of Wight,All Sentiments"

      writestream.write(csvline);

    })
  .on('end', function() {
    //On end Callback Function
  });

