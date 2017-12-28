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
      ?model rdfs:label ?model .
      ?model ?p ?s .
      FILTER regex(str(?model),\"${model}\", \"i\")
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

  let allModelsQuery = `
  PREFIX :<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
  PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
  PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
  
  SELECT ?model {
  ?model :image ?image .
  }
  LIMIT 5
  `;



  rdfStore.query(storage, allModelsQuery, (err, result) => {

    let resultArray = [];
    for (let i = 0, len = result.length; i < len; i++) {
      let currentModel = result[i].model.value;
      console.log(currentModel);


      let perModelQuery = `
      PREFIX :<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
      PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      SELECT * {<${currentModel}> ?p ?o
      `;

      // let perModelQuery =`
      // PREFIX :<http://www.semanticweb.org/ZTI/ontologies/2017/10/phones#>
      // PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      // PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      // PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
      //
      // SELECT * {
      //   <${currentModel}> :image ?image .
      //   <${currentModel}> :primary_camera ?camera .
      //   <${currentModel}> :has_memory ?RAM .
      //   <${currentModel}> :price_eur ?price .
      //   <${currentModel}> :display_size ?displayInch .
      // `;
      //perModelQuery+= p.brand ? `?model :made_by :${p.brand} .`:`?model :made_by ?brand .`;
      //if(p.brand)             query+=`FILTER regex(str(?brand),\"${p.brand}\", \"i\")`;
      //query+= p.os ? `?model :has_os :${p.os} .`:`?model :has_os ?OS .`;
      // if(p.os)                perModelQuery+=`FILTER regex(str(?os),\"${p.os}\", \"i\")`;
      // if(p.price_from)        perModelQuery+=`FILTER (xsd:integer(?price) > ${p.price_from}) `;
      // if(p.price_to)          perModelQuery+=`FILTER (xsd:integer(?price) < ${p.price_to}) `;
      // if(p.display_inch_from) perModelQuery+=`FILTER (xsd:float(?dsize) > ${p.display_inch_from}) `;
      // if(p.display_inch_to)   perModelQuery+=`FILTER (xsd:float(?dsize) < ${p.display_inch_to}) `;
      perModelQuery+='} LIMIT 20';

      rdfStore.query(storage, perModelQuery, (err, result) => {
        if(err) {
          res.status(500).send({
            message:'Some error occured during fetching phones.',
            description:err
          });
        } else {

          console.log(`model: ${currentModel} \n`+JSON.stringify(result))
          resultArray.push({model:currentModel, result:result});
          console.log(JSON.stringify(resultArray));
        }
      })

    }
    //res.send(resultArray);
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
