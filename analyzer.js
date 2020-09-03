async function quickstart(review) {
    // Imports the Google Cloud client library
    const language = require('@google-cloud/language');
  
    // Instantiates a client
    const client = new language.LanguageServiceClient();
  
    // The text to analyze
    const text = "The QR scanner doesn't work at any venue I have tried on the isle of wight, so I cant actually sign in anywhere!! It makes it a pointless feature. The rest of the app works as the old app did, which is great. Please sort ot the QR code scanner";
  
    const document = {
      content: review,
      type: 'PLAIN_TEXT',
    };
  
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({document: document});
    const [entityresult] = await client.analyzeEntities({document});
    const [sentityresult] = await client.analyzeEntitySentiment({document});
    
    const sentiment = result.documentSentiment;
    
  
    console.log(`Text: ${text}`);
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
    console.log(`#########################`);
    const entities = entityresult.entities;
    console.log('Entities:');
    entities.forEach(entity => {  
        console.log(entity.name);  
        console.log(` - Type: ${entity.type}, Salience: ${entity.salience}`);  
        if (entity.metadata && entity.metadata.wikipedia_url) {    
            console.log(` - Wikipedia URL: ${entity.metadata.wikipedia_url}`);  
        }
    });

    console.log(`########### Entity Sentiment ##############`);
    const sentities = sentityresult.entities;
    console.log('Entities and sentiments:');
    sentities.forEach(entity => {
      console.log(`  Name: ${entity.name}`);
      console.log(`  Type: ${entity.type}`);
      console.log(`  Score: ${entity.sentiment.score}`);
      console.log(`  Magnitude: ${entity.sentiment.magnitude}`);});


  }

  quickstart();