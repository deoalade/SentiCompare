const fs = require('fs');
const fs2 = require('fs');
const csv = require('csv-parser');
const randomWords = require('random-words');
const users = [];

// function generateUsername(firstname, surname) {
//   return `${firstname[0]}-${surname}`.toLowerCase();
// }

async function quickstart(review) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    const document = {
      content: review,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const [sentityresult] = await client.analyzeEntitySentiment({document});
    
    const sentiment = result.documentSentiment;
    
  
    
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

    //console.log(`########### Entity Sentiment ##############`);
    const sentities = sentityresult.entities;
    console.log('Entities and sentiments:');
    sentities.forEach(entity => {
      console.log(`  Name: ${entity.name}`);
      console.log(`  Score: ${entity.sentiment.score}`);});
    
    return [sentiment.score, sentities ]

  }

  var writestream = fs.createWriteStream('outputfile.csv');
  writestream.write("Comment,Sentiment Score,QR Sentiment,Entity Sentiments" + "\n")

 fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', async function(row) {


    const sentimentAnalysis = await quickstart(row.Firstname);

    var hasqr = 'N/A';
    var espair = '';

    sentimentAnalysis[1].forEach(entity => {
          espair = espair + entity.name + ":"+ entity.sentiment.score + ", ";
            var entityname = entity.name.toLowerCase();
            if(entityname.includes('qr')){
                hasqr = entity.sentiment.score;
            }
    });

    
    //console.log("!!!!!!!!!!!!!!!!!!!!" + espair);

        
        const user = {
        firstname: row.Firstname,
      //   sentiment: sentimentAnalysis[0],
      //   entitySentiment: espair,
        sentiment: sentimentAnalysis[0],
        entitySentiment: espair,
      };

    
    

    /////////////////////////////////console.log(user.firstname);

    

    //users.push(user);
    
    var csvline = "\"" + user.firstname + "\"" + ","  + user.sentiment + "," + hasqr + "," + "\""  + user.entitySentiment + "\"" + "\n";
    const outputfile = "outputnhs.csv";

    // fs.writeFile(outputfile, csvline ), err => {
    //     if (err) {
    //       console.log('Error writing to csv file', err);
    //     } else {
    //       console.log(`saved as ${filename}`);
    //     }
    //   };

    writestream.write(csvline);

  })
  .on('end', function() {
    //console.table(users);
    //writeToCSVFile(users);
  });

function writeToCSVFile(users) {
  const filename = 'outputreview.csv';

  fs.writeFile(filename, extractAsCSV(users), err => {
    if (err) {
      console.log('Error writing to csv file', err);
    } else {
      console.log(`saved as ${filename}`);
    }
  });
}

function extractAsCSV(users) {
  const header = ['Reviews, Sentiment, Entities & Sentiments'];
  const rows = users.map(
    user => `${user.firstname},  ${user.sentiment}, ${user.entitySentiment}`
  );

  return header.concat(rows).join('\n');
}
