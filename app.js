const PORT = 5555;
const express = require('express');
const { allowedNodeEnvironmentFlags } = require('process');

const app = express();
app.use(express.static('public'));
app.get('/', redir);

function redir(req, res, next) {
  res.redir('/index.html');
}


console.log(`listening on port ${PORT}`);
app.listen(PORT)