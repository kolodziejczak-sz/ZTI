function convert(matrixString) {
  const splitCharMain = ";"
  const splitCharSecondary = "="

  const entities = matrixString.split(splitCharMain)
  return entities.reduce((acc, entity, index) => {
    if(index===0) return acc;
    const pair=entity.split(splitCharSecondary);
    acc[pair[0]] = pair[1];
    return acc;
  }, {})
}

module.exports = {
  convert: convert
};