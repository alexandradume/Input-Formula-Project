const LoadMathService = require("./_services/loadDataService");
const LoadMathServiceInstance = new LoadMathService();
const resultMathJson = LoadMathServiceInstance.loadData();

const express = require('express')
const app = express()
const port = 3000

app.get('/api/loadData', (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.send(resultMathJson); //sends it to UI
});

app.listen(port, () => {
})
