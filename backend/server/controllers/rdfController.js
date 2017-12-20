module.exports = {
  queryRdfStore: function queryRdfStore(query, callback) {
    "use strict";
    var fs = require('fs');
    var rdfstore = require('rdfstore')
    var path = require('path');
    rdfstore.create(function (err, store) {

      console.log(__dirname)
      var filePath = path.join(__dirname, '..', '..', '..', 'ontology', 'phones-turtle.owl');
      var inputString = fs.readFileSync(filePath).toString()

      const type = "text/turtle"//"application/ld+json"
      store.load(type, inputString, function (err, results) {
        console.log("elements loaded into store: " + results);

        store.execute(query, function (err, results) {

          console.log(results);
          callback(results)
        });
      });
    });

    console.log(TEST)

  },

  loadStore: function loadStore() {

    var fs = require('fs');
    var rdfstore = require('rdfstore')
    var path = require('path');

    const filePath = path.join(__dirname, '..', '..', '..', 'ontology', 'phones-turtle.owl');
    var inputString = fs.readFileSync(filePath).toString()
    const type = "text/turtle"//"application/ld+json"
    var full_store
    var s = rdfstore.create(function (err, store) {

      console.log(__dirname)

      store.load(type, inputString, function (err, results) {
        console.log("elements loaded into store: " + results);
        full_store = store
      })

    })
    while (full_store === undefined) {
      require('deasync').runLoopOnce()
    }
    return full_store
  }

}

