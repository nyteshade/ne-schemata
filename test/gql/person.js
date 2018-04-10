module.exports = {
  peeps() {
    return [
      { name: 'Brielle', gender: 'Female' },
      { name: 'Sally', gender: 'Female' },
      { name: 'Randal', gender: 'TransMale' }
    ]
  },
  
  setPeep(r, { name, gender }, c, i) {
    return { name, gender }
  }  
}

