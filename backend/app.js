const express = require('express');
const app = express();
const port = 7777;

const path = require('path');
const bodyParser = require('body-parser');
const matrixParser = require('./matrix-parser');
const rdfStore = require("./rdf-store.js")
const ontologyPrefix = 'http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#';
let storage;

app.use(bodyParser.json())

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.use(function(req, res, next) {
  const params = matrixParser.convert(req.url)
  console.log(`Request ${req.method} to url: ${req.url}
    with params ${JSON.stringify(params)}`);
  next();
})

app.get('/api/detail/:model', function (req, res) {
  const model = req.params.model;
  const query = `
    PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    SELECT * {
      ?model rdf:type :model .
      ?model rdfs:label ?label .
      ?model rdfs:image ?img .
      ?model rdfs:made_by ?brand .
      ?model rdfs:model ?model .
      ?model ?p ?s .
      FILTER regex(?model,${model})
    } LIMIT 1`;

  rdfStore.query(storage, query, (err, result) => {
    if(err) {
      res.status(500).send({
        message:'Some error occured during fetching phone.',
        description:err
      });
    } else {
      result = processResult(result);
      res.send(result[0]);
    }
  })
})

app.get('/api/os', function (req, res) {
  const query = `
  PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  SELECT ?x WHERE { ?x rdfs:subClassOf phones:OS . }`

  rdfStore.query(storage, query, (err, result) => {
    if(err) {
      res.status(500).send({
        message:'Some error occured during fetching list of os.',
        description:err
      });
    } else {
      result = result.map(result => result.x.value.substring(ontologyPrefix.length))
      res.send(result);
    }
  })
})

app.get('/api/brands', function (req, res) {
  const query = `
  PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
  SELECT DISTINCT ?x {?p phones:made_by ?x}`

  rdfStore.query(storage, query, (err, result) => {
    if(err) {
      res.status(500).send({
        message:'Some error occured during fetching list of brands.',
        description:err
      });
    } else {
      result = result.map(result => result.x.value.substring(ontologyPrefix.length))
      res.send(result);
    }
  })
})

//example /api/search;price_to=200;os=android;display_inch_from=1
app.get('/api/search*', function (req, res) {
  const p = matrixParser.convert(req.url);

  let query = `
    PREFIX phones: <http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
    PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
    
    SELECT ?img ?label ?brand ?price ?ram ?dsize {
      ?model rdf:type phones:model .
      ?model phones:image ?img .
      ?model rdfs:label ?label .
      ?model phones:model ?model .
      ?model phones:made_by ?brand .
      ?model phones:price_eur ?price .
      ?model phones:display_size ?dsize .
      ?model phones:has_ram ?ram .
      ${getFilters(p)}
    } LIMIT 20`

  rdfStore.query(storage, query, (err, result) => {
    if(err) {
      res.status(500).send({
        message:'Some error occured during fetching phones.',
        description:err
      });
    } else {
      result = processResult(result);
      res.send(result);
    }
  })
});

function processResult(result) {
  return result.map(phone => {
    for(key in phone) {
      let isValueWithPrefix = phone[key].value.length >= ontologyPrefix.length;
      if(isValueWithPrefix) {
        phone[key] = phone[key].value.substring(ontologyPrefix.length)
      } else {
        phone[key] = phone[key].value
      }
    }
    return phone;
  })
}

function getFilters(p) {
  var filters = [];
  p.query && filters.push(`FILTER (CONTAINS(?model, ${p.query}))`);
  p.os && filters.push(`FILTER (CONTAINS(?os, ${p.os}))`);
  p.brand && filters.push(`FILTER (REGEX(?brand,${p.brand}))`);
  p.price_from && filters.push(`FILTER (xsd:float(?price) > ${p.price_from})`);
  p.price_to && filters.push(`FILTER (xsd:float(?price) < ${p.price_to})`);
  p.ram_from && filters.push(`FILTER (xsd:float(?ram) > ${p.ram_from})`);
  p.ram_to && filters.push(`FILTER (xsd:float(?ram) < ${p.ram_to})`);
  p.display_inch_from && filters.push(`FILTER (xsd:float(?dsize) > ${p.display_inch_from})`);
  p.display_inch_to && filters.push(`FILTER (xsd:float(?dsize) < ${p.display_inch_to})`);
  return filters.join(' ');
}

function init() {
  const filePath = path.join(__dirname, 'phones_short.owl');
  rdfStore.create(store => {
    rdfStore.loadOwlToStore(store, filePath, results =>  {
      storage = store;
      app.listen(port, () => console.log('REST API started on: http://localhost:' + port));
    })
  })
}

init();
