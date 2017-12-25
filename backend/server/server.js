var express = require('express'),
    app = express(),
    port = 7777;

var rdfController = require("../../backend/server/controllers/rdfController.js")

const bodyParser = require('body-parser');
app.use(bodyParser.json())
var rdf_s = rdfController.loadStore()
app.listen(port);

app.put('/', function (req, res) {
  console.log(req.body)
  var params = req.query
  var sparql_query = req.body.query

  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result)
    res.send(result)
  })
});

//example: AmoiM360
app.get('/api/detail/:model', function (req, res) {
  console.log('looking for data about: '+req.params.model)
  var sparql_query = "SELECT * {<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#"+req.params.model+"> ?p ?o }"
  console.log("query: "+sparql_query)
  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result)
    res.send(result)
  })
})

app.get('/api/list/os', function (req, res) {
  console.log('listing operating systems')
  var sparql_query = "SELECT ?s ?o WHERE {?s <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones:has_os> ?o}"
    //"@PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones>" +

  console.log("query: "+sparql_query)
  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result)
    res.send(result)
  })
})

//AcerDX900
app.get('/api/TEST', function (req, res) {
  console.log('TESTING')

    //"@PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>" +
    //"SELECT * {<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#> ?p ?o}"//"Select * {?s ?p ?o}"

  // var sparql_query ="SELECT * {<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#AcerDX900> " +
  //   " <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#has_os> ?o}"//"Select * {?s ?p ?o}"


  var sparql_query ="PREFIX phones:<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>" +
    "SELECT ?o {phones:AcerDX900 " +
    " phones:has_os ?o}"//"Select * {?s ?p ?o}"

  console.log("query: "+sparql_query)
  rdf_s.execute(sparql_query, function (err, result) {

    console.log(result)
    res.send(result)
  })
})

app.get('/api/list;matrix-uri', function (req, res) {
  var criteria = parse(req.params.matrix-uri)
  console.log('looking for phones fulfilling given criteria: '+criteria)

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

  filters = []
  filters.append(ram_from === undefined ? "":"xsd:integer(?o) > "+ram_from)
  filters.append(ram_to === undefined ? "":"xsd:integer(?o) < "+ram_to)
  filters.append(os === undefined ? "":"regex(?p,'"+os+"','i')")
  filters.append(brand === undefined ? "":"regex(?p,'"+brand+"','i')")
  filters.append(price_from === undefined ? "":"xsd:integer(?o) > "+price_from)
  filters.append(price_to === undefined ? "":"xsd:integer(?o) < "+price_to)
  filters.append(display_inch_from === undefined ? "":"xsd:integer(?o) > "+display_inch_from)
  filters.append(display_inch_to === undefined ? "":"xsd:integer(?o) < "+display_inch_to)
  filters = filtes.filter(function (element) {
    return element !== ""
  })

  var filter_string = filters.join(" && ")

  var sparql_query = "" +
    "SELECT ?s " +
    "WHERE "+
    "{?s a :phone" +
    " ?p" +
    " ?o }" +
    "FILTER(" +
    "" +
     filter_string
      +
    ")"

  console.log("query: "+sparql_query)
  rdf_s.execute(sparql_query, function (err, result) {
    console.log(result)
    res.send(result)
  })
})


console.log('REST API started on: http://localhost:' + port);

function parse(input) {
  const splitCharMain = ";"
  const splitCharSecondary = "="

  var parts = input.split(splitCharMain)
  var obj= parts.reduce(function(acc, entity, index){
    if(index===0) return acc;
    const pair=entity.split(splitCharSecondary);
    acc[pair[0]] = pair[1];
    return acc;
  }, {})
  return obj
//example: index;a=1;b=2
}

console.log()
