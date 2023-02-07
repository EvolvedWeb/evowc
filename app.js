const PORT = 5555;
const express = require('express');
const { allowedNodeEnvironmentFlags } = require('process');

const app = express();
app.use(express.static('static'));
app.get('/', doRedir);

function doRedir(req, res, next) {
  res.redir('/index.html');
}


console.log(`listening on port ${PORT}`);
app.listen(PORT)