const PORT = 5555;
const evowc = require('./lib/old/evowc-old.js');
const express = require('express');
const bodyParser = require('body-parser');

const { allowedNodeEnvironmentFlags } = require('process');

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/', doRedir);
app.post('/api/process', processComponent);
app.post('/api/login', processLogin);

function doRedir(req, res, next) {
  res.redir('/index.html');
}

async function processComponent(req, res, next) {
  const content = req.body.component || ''
  const resp = await evowc(content)
  res.json(resp);
}

async function processLogin(req, res, next) {
  setTimeout(() => {
    const {username, password} = req.body;
    if (username === 'michael.collins@stgconsulting.com' && password === 'password') {
      res.statusCode = 204;
      res.end();
      return;
    }

    res.statusCode = 401;
    res.setHeader('WWW-Authenticate', 'Bearer');
    res.end();
  }, 3000);
}


console.log(`listening on port ${PORT}`);
app.listen(PORT, '0.0.0.0');