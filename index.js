const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const HTTP_ALERT_STATUS = 400;
const PORT = '3000';

const readFile = () => fs.readFileSync('./talker.json', 'utf-8');

const valiEmail = (req, res, next) => {
  const { email } = req.body;
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "email" é obrigatório' });
  }
  if (!regexEmail.test(email)) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'O "email" deve ter o formato "email@email.com"' });
  }
  next();
};

const valiPass = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "password" é obrigatório' });
  }
  if (password.length < 6) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'O "password" deve ter pelo menos 6 caracteres' });
  }
  next();
};

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', (_req, res) => {
  const readRes = JSON.parse(readFile());
  res.status(HTTP_OK_STATUS).json(readRes);
});

app.get('/talker/:id', (req, res) => {
  const readRes = JSON.parse(readFile());
  const { id } = req.params;
  const talkerId = readRes.find((talker) => talker.id === Number(id));

  if (!talkerId) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(HTTP_OK_STATUS).json(talkerId);
});

app.post('/login', valiEmail, valiPass, (_req, res) => {
  const token = crypto.randomBytes(8).toString('hex');
  res.status(HTTP_OK_STATUS).json({ token });
});

app.listen(PORT, () => {
  console.log('Online');
});