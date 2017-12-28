const fs = require('fs');
const rdfstore = require('rdfstore')

function create(callback) {
  rdfstore.create((err, store) => {
    if(err) {
      console.error('rdfstore.create error', err);
      return;
    }
    console.log('rdfstore.create success');
    callback(store);
  });
}

function loadOwlToStore(store, filePath, callback) {
  const inputString = fs.readFileSync(filePath).toString()
  const type = "text/turtle"//"application/ld+json
  store.load(type, inputString, (err, results) => {
    if(err) {
      console.error('store.load error', err);
      return;
    }
    console.log('store.load success');
    callback(results);
  })
}

function query(store, query, callback) {
  console.log('store.execute ', query)
  store.execute(query, function (err, results) {
    if(err) {
      console.error('store.execute error', query, err);
      callback(err);
      return;
    }
    console.log('store.execute success with results: ', results);
    callback(null, results);
  });
}

module.exports = {
  create: create,
  loadOwlToStore: loadOwlToStore,
  query: query
}