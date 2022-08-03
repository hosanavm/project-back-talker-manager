const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

const readFile = () => fs.readFileSync('./talker.json', 'utf-8');

const readRes = JSON.parse(readFile());
console.log(readRes[0].id);

function talkers(_req, res) {
  return res.status(200).json(readRes);
}

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', talkers);

app.get('/talker/:id', (req, res) => {
  const { id } = req.params;
  const talkerId = readRes.find((talker) => talker.id === Number(id));

  if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerId);
});

app.listen(PORT, () => {
  console.log('Online');
});