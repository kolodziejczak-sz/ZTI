const express = require('express'),
  app = express(),
  port = 7777;

const matrixParser = require('matrix-parser');
const rdfController = require("../../backend/server/controllers/rdfController.js");

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(matrixParser ());
let rdf_s = rdfController.loadStore();
app.listen(port);

app.put('/', function (req, res) {
  console.log(req.body);
  var params = req.query;
  var sparql_query = req.body.query;

  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result);
    res.send(result)
  })
});
const mpMiddleware = matrixParser();

//example: AmoiM360
app.get('/api/detail*', mpMiddleware, function (req, res) {
  var criteria = req.matrix[1].matrix;
  var brand = criteria.brand;
  var model = criteria.model;
  console.log('looking for data about: '+model+" made by "+brand);

  // var sparql_query = "SELECT * " +
  //   "{<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#"+req.params.model+"> ?p ?o }"

  var sparql_query = ""+
    " PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#> " +
    " PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
    " PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
    " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    " SELECT * {" +
    "?model rdf:type phones:model ." +
    "?model phones:made_by ?brand . "+
    "?model ?p ?s ."+
    "FILTER regex(str(?brand),\""+brand+"\", \"i\")" +
    "FILTER regex(str(?model),\""+model+"\", \"i\")" +
    "} "+
    " LIMIT 20"+//"Select * {?s ?p ?o}"
    "";

  console.log("query: "+sparql_query);
  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result);
    res.send(result)
  })
});

app.get('/api/list/os', function (req, res) {
  console.log('listing operating systems');
  var sparql_query = "" +
    " PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#> " +
    " PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
    " PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
    " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    " PREFIX owl: <http://www.w3.org/2002/07/owl#>"+
    "SELECT DISTINCT ?family {" +
     "?p phones:has_os ?os ."+
     "?os rdf:type ?family ."+
     //"?family rdfs:subClassOf phones:OS ."+
    // "?family rdf:type phones:OS ."+
    // "filter not exists { ?os rdf:type owl:NamedIndividual }"+
    // "?entity rdf:type ?type ." +
    //"?type rdfs:subClassOf phones:OS ."+
     //"?subclass rdfs:subClassOf ?c ." +
    //"?entity rdf:type ?subclass ."+
    // "MINUS {\n" +
    // "      ?family ?p \"NamedIndividual\" ." +
    // "   }"+
    "}"
    // "SELECT DISTINCT ?os {?p " +
    // " phones:has_os ?os}";//"Select * {?s ?p ?o}"

  console.log("query: "+sparql_query);
  rdf_s.execute(sparql_query, function (err, result) {

    if(err) {
      res.status(500).send({
        message:'Some error occured while fetching os list.',
        description:err
      });
    }
    else {

      console.log(result);
      res.send(result)
    }
  })
});

app.get('/api/list/brands', function (req, res) {
  console.log('listing operating systems');
  var sparql_query = " PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>" +
    "SELECT DISTINCT ?brand {?p " +
    " phones:made_by ?brand}";//"Select * {?s ?p ?o}"

  console.log("query: "+sparql_query);
  rdf_s.execute(sparql_query, function (err, result) {

    if(err) {
      res.status(500).send({
        message:'Some error occured while fetching brand list.',
        description:err
      });
    }
    else {

      console.log(result);
      res.send(result)
    }
  })
});


//AcerDX900
app.get('/api/TEST', function (req, res) {
  console.log('TESTING');

  var brand = "asus";
  var os = "droid";
  var sparql_query ="" +
    " PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#> " +
    " PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
    " PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
    " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    " SELECT * {" +
    "?model rdf:type phones:model ." +
    "?model rdfs:label ?label ." +
    "?model phones:price_eur ?price ." +
    "?model phones:has_os ?os ." +
    "?model phones:made_by ?brand . "+
    "?model phones:display_size ?dsize . "+
    "FILTER regex(str(?brand),\""+brand+"\", \"i\")" +
    "FILTER (xsd:integer(?price) > 80)" +
    "FILTER regex(str(?os),\""+os+"\", \"i\")"+
    "FILTER (xsd:float(?dsize) > 4.0)" +
    "} "+
    " LIMIT 20"+//"Select * {?s ?p ?o}"
    "";
  console.log("query: "+sparql_query);
  rdf_s.execute(sparql_query, function (err, result) {

    console.log(result);
    res.send(result)
  })
});


app.get('/api/list*',mpMiddleware, function (req, res, next) {
  //var criteria = parse(req.params.matrix-uri)
  var criteria = req.matrix[1].matrix;
  console.log('looking for phones fulfilling given criteria: '+JSON.stringify(criteria));

  if ('ram_from' in criteria){
    var ram_from = criteria.ram_from
  }
  if ('ram_to' in criteria){
    var ram_to = criteria.ram_to
  }
  if ('os' in criteria){
    var os = criteria.os
  }
  if ('price_from' in criteria){
    var price_from = criteria.price_from
  }
  if ('price_to' in criteria){
    var price_to = criteria.price_to
  }
  if ('display_inch_from' in criteria){
    var display_inch_from = criteria.display_inch_from
  }
  if ('display_inch_to' in criteria){
    var display_inch_to = criteria.display_inch_to
  }
  if ('brand' in criteria){
    var brand = criteria.brand
  }


  var filters = [];
  //filters.push(ram_from === undefined ? "":"xsd:integer(?o) > "+ram_from)
  //filters.push(ram_to === undefined ? "":"xsd:integer(?o) < "+ram_to)
  filters.push(os === undefined ? "":"FILTER regex(str(?os),\""+os+"\", \"i\")");
  filters.push(brand === undefined ? "":"FILTER regex(str(?brand),\""+brand+"\", \"i\")");
  filters.push(price_from === undefined ? "":"FILTER (xsd:integer(?price) > "+price_from+")");
  filters.push(price_to === undefined ? "":"FILTER (xsd:integer(?price) < "+price_to+")");
  filters.push(display_inch_from === undefined ? "":"FILTER (xsd:float(?dsize) > "+display_inch_from+")");
  filters.push(display_inch_to === undefined ? "":"FILTER (xsd:float(?dsize) <"+display_inch_to+")");
  filters = filters.filter(function (element) {
      return element !== ""
  });
  var filter_string = filters.join("");

  var sparql_query =" PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#> " +
    " PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#> " +
    " PREFIX xsd: <http://www.w3.org/2001/XMLSchema#> " +
    " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    " SELECT * {" +
    "?model rdf:type phones:model ." +
    "?model rdfs:label ?label ." +
    "?model phones:price_eur ?price ." +
    "?model phones:has_os ?os ." +
    "?model phones:made_by ?brand . "+
    "?model phones:display_size ?dsize . "+
    filter_string+
    //brand === undefined ? "":"FILTER regex(str(?brand),\""+brand+"\", \"i\")" +
    // price_from === undefined ? "":"FILTER (xsd:integer(?price) > "+price_from+")" +
    // price_to === undefined ? "":"FILTER (xsd:integer(?price) < "+price_to+")" +
    // os === undefined ? "":"FILTER regex(str(?os),\""+os+"\")"+
    // display_inch_from === undefined ? "":"FILTER (xsd:float(?dsize) > "+display_inch_from+")" +
    // display_inch_to === undefined ? "":"FILTER (xsd:float(?dsize) < "+display_inch_to+")" +
    // ram_from === undefined ? "":"FILTER (xsd:integer(?ram) > "+ram_from+")" +
    // ram_to === undefined ? "":"FILTER (xsd:integer(?ram) < "+ram_to+")" +
    "} "+
    "LIMIT 20"+
    "";

  console.log("query: "+sparql_query);
  rdf_s.execute(sparql_query, function (err, result) {

    if(err) {
      res.status(500).send({
        message:'Some error occured while fetchnig query results',
        description:err
      });
    }
    else {

      console.log(result);
      res.send(result)
    }
  })
});


console.log('REST API started on: http://localhost:' + port);
console.log();
