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

const valiTok = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16) {
    return res.status(401).json({ message: 'Token inválido' });
  }
  next();
};

const valiName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  next();
};

const valiAge = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  next();
};

const valiTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "talk" é obrigatório' });
  }
  next();
};

const valiWatc = (req, res, next) => {
  const { talk: { watchedAt } } = req.body;
  const dateRegex = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i;
  if (!watchedAt) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!dateRegex.test(watchedAt)) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }
  next();
};

const valiRate = (req, res, next) => {
  const { talk: { rate } } = req.body;
  if (!rate) {
    return res.status(HTTP_ALERT_STATUS).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (rate < 1 || rate > 5) {
    return res.status(HTTP_ALERT_STATUS)
    .json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
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

// console.log(talkers);
app.post('/talker', valiTok, valiName, valiAge, valiTalk, valiWatc, valiRate, (req, res) => {
  const { name, age, talk } = req.body;
  const { watchedAt, rate } = talk;
  const talkers = JSON.parse(readFile());
  const talker = {
    id: talkers.length + 1,
    name,
    age,
    talk: {
      watchedAt,
      rate,
    },
  };
  talkers.push(talker);
  fs.writeFileSync('talker.json', JSON.stringify(talkers));
  res.status(201).json(talker);
});

app.listen(PORT, () => {
  console.log('Online');
});