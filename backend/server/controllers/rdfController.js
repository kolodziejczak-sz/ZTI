module.exports = {
 queryRdfStore : function queryRdfStore(query, callback) {
  "use strict";
  var rdfstore = require('rdfstore')
  rdfstore.create(function (err, store) {

    var sample_owl_json = JSON.parse("[ {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Ontology\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#ABC_z.o.o.\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#NamedIndividual\", \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#firma\" ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#znajduje_sie_w\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Poznan\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#HR\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ],\n" +
      "  \"http://www.w3.org/2000/01/rdf-schema#subClassOf\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#dzial\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#IT\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ],\n" +
      "  \"http://www.w3.org/2000/01/rdf-schema#subClassOf\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#dzial\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Jacek_Nowak\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#NamedIndividual\" ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_podwladnym\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Jan_Kowalski\"\n" +
      "  } ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#pracuje_w\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#ABC_z.o.o.\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Jan_Kowalski\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#NamedIndividual\", \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#kierownik\" ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_przelozonym\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Jacek_Nowak\"\n" +
      "  }, {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Robert_Kwasniewski\"\n" +
      "  } ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#pracuje_w\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#ABC_z.o.o.\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Poznan\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#NamedIndividual\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Robert_Kwasniewski\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#NamedIndividual\" ],\n" +
      "  \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_podwladnym\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#Jan_Kowalski\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#dzial\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#firma\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_podwladnym\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#ObjectProperty\" ],\n" +
      "  \"http://www.w3.org/2002/07/owl#inverseOf\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_przelozonym\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#jest_przelozonym\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#ObjectProperty\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#kierownik\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ],\n" +
      "  \"http://www.w3.org/2000/01/rdf-schema#subClassOf\" : [ {\n" +
      "    \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#pracownik\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#miasto\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#pracownik\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#pracuje_w\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#ObjectProperty\" ],\n" +
      "  \"http://www.w3.org/2000/01/rdf-schema#subPropertyOf\" : [ {\n" +
      "    \"@id\" : \"http://www.w3.org/2002/07/owl#topObjectProperty\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#sektor\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#Class\" ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#zarzadza\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#ObjectProperty\" ],\n" +
      "  \"http://www.w3.org/2000/01/rdf-schema#subPropertyOf\" : [ {\n" +
      "    \"@id\" : \"http://www.w3.org/2002/07/owl#topObjectProperty\"\n" +
      "  } ]\n" +
      "}, {\n" +
      "  \"@id\" : \"http://www.semanticweb.org/ja/ontologies/2017/2/untitled-ontology-7#znajduje_sie_w\",\n" +
      "  \"@type\" : [ \"http://www.w3.org/2002/07/owl#ObjectProperty\" ]\n" +
      "} ]");

    store.load("application/ld+json", sample_owl_json, function (err, results) {

      console.log("elements loaded into store: " + results);

      store.execute(query, function (err, results) {

        console.log(results);
        callback(results)
      });
    });
  });
}
}

