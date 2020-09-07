var fs = require("fs");
var csv = require("csv");

var readStream = fs.createReadStream("input.csv"); // readStream is a read-only stream wit raw text content of the CSV file
var writeStream = fs.createWriteStream("output.csv"); // writeStream is a write-only stream to write on the disk

var csvStream = csv.parse(); // csv Stream is a read and write stream : it reads raw text in CSV and output untransformed records

csvStream.on("data", function(data) {
  //console.log(data)

  writeStream.write(JSON.stringify(data));
})
.on("end", function(){
    console.log("done");
})
.on("error", function(error){
    console.log(error)
});

readStream.pipe(csvStream)