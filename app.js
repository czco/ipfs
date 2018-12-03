//Required modules
const ipfsAPI = require("ipfs-api");

const fs = require("fs");

//Connceting to the ipfs network via infura gateway
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

let testFile = fs.readFileSync("./demo.txt");

let testBuffer = new Buffer(testFile);

var i = 0;

var timeTaken = setInterval(function() {
  i = i + 1;
  console.log("Took " + i + " seconds");
}, 1000);

function addFile(cb) {
  console.log("add file invoked");

  ipfs.files.add(testBuffer, function(err, file) {
    if (err) {
      console.log(err);
    }
    console.log(file);
    clearInterval(timeTaken);
    cb(file[0].hash);
  });
}
//Getting the uploaded file via hash code.
function readFile(hash) {
  const validCID = hash;

  ipfs.files.get(validCID, function(err, files) {
    files.forEach(file => {
      console.log(file.path);
      console.log(file.content.toString("utf8"));
    });
  });
}
function pinHash(hash) {
  //so the file is not garbage collected after 24 hours
  ipfs.pin.add(hash, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

addFile(readFile);
