const PORT = 23456;
// @ts-ignore
import * as path from 'node:path';
import { evowc } from './lib/evowc.js';
import express from 'express';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static('static'));
app.use(bodyParser.json());

app.get('/', doRedir);
app.post('/api/process', processComponent);
app.post('/api/login', processLogin);
app.get('/test', doEvoPages('test.html'));
app.get('/test/*', doEvoPages('test.html'));
app.get('/slideshow', doEvoPages('slideshow.html'));
app.get('/slideshow/*', doEvoPages('slideshow.html'));

// @ts-ignore
function doRedir(req, res, next) { // eslint-disable-line no-unused-vars
  res.redir('/index.html');
}

function doEvoPages(fileName) {
  // @ts-ignore
  return (req, res, next) => {
    const options = {
      root: path.join(__dirname, 'static')
    };

    res.sendFile(fileName, options, function (err) {
      if (err) {
        next(err);
      } else {
        console.log('Sent:', fileName);
      }
    });
  }
}

// @ts-ignore
async function processComponent(req, res, next) { // eslint-disable-line no-unused-vars
  const content = req.body.component || ''
  const resp = evowc(content)
  res.json(resp);
}

// @ts-ignore
async function processLogin(req, res, next) { // eslint-disable-line no-unused-vars
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