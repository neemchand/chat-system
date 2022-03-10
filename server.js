const express = require('express');

const app = express();

const server = app.listen(8080, () => {
  console.log(`server is running on`, server.address().port);
});

app.use(express.static(__dirname));
