var express = require('express'),
    app = express(),
    port = 8888;

var rdfController = require("../../backend/server/controllers/rdfController.js")

const bodyParser = require('body-parser');
app.use(bodyParser.json())

app.listen(port);

app.put('/', function (req, res) {
  console.log(req.body)
  rdfController.queryRdfStore(req.body.query, function(result) {
    res.send(result)
  })
});

console.log('REST API started on: ' + port);
