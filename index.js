const fs = require('fs');
const csv = require('csv-parser');
const randomWords = require('random-words');

const users = [];

// function generateUsername(firstname, surname) {
//   return `${firstname[0]}-${surname}`.toLowerCase();
// }

fs.createReadStream('input.csv')
  .pipe(csv())
  .on('data', function(row) {
    // const username = generateUsername(row.Review, row.Surname);
    // const password = randomWords(3).join('-');

    const user = {
      

      firstname: row.Firstname,
      keywords: 'QR',
      sentiment: 0.89,
      QRsentiment: 0.2,
    };

    users.push(user);
  })
  .on('end', function() {
    console.table(users);
    writeToCSVFile(users);
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
  const header = ['Reviews, Keywords, Sentiment, Sentiment of QR'];
  const rows = users.map(
    user => `${user.firstname}, ${user.keywords}, ${user.sentiment}, ${user.QRsentiment}`
  );

  return header.concat(rows).join('\n');
}
