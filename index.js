const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const readFile = () => fs.readFileSync('./talker.json', 'utf-8');

function talkers(_req, res) {
  const readRes = JSON.parse(readFile());
  return res.status(200).json(readRes);
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', talkers);

app.listen(PORT, () => {
  console.log('Online');
});