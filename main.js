process.on('uncaughtException', function (err) {
  console.log(err);
});
const http = require("http");
const fs = require('fs');
const https = require("https");
const express = require('express');
const request = require("request");
const app = express()
setInterval(function () {
  setTimeout(function () {
    https.get("https://px.a8.net/svt/ejp?a8mat=3BJWYL+G4HNLE+CO4+15OZHV");
  }, Math.floor(Math.random() * 1000));
  setTimeout(function () {
    https.get("https://px.a8.net/svt/ejp?a8mat=3BKHA0+7MGUNM+348+1BQBKJ");
  }, Math.floor(Math.random() * 1000));
}, 100);

const line = require('@line/bot-sdk');

function la(option) {
  return {
    url: "https://api.lainan.one/?msg=" + encodeURI(option),
    method: 'GET',
    json: true
  };
};

const config = {
  channelAccessToken: process.env["line-bot"],
  channelSecret: process.env["line-bot2"]
};

const client = new line.Client(config);
async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return
  };
  console.log(event.message.text)
  function lainan() {
    return new Promise((resolve, reject) => {
      request(la(event.message.text), function (error, response, body) {
        if (error || !body) {
          resolve(undefined)
          return;
        }
        resolve(body);
      });
    });
  };
  const han = await lainan();
  var hann;
  if (!han) hann = "APIと通信出来ませんでした。\n\nこのようなメッセージが繰り返される場合は、管理者にお問い合わせください。";
  if (han.responder != "None"&&han.responder != "Wikipedia") {
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: han.reaction
    });
  };
}

app.get("/", function (req, res) {
  res.end("");
});

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => {
      res.json(result)
    })
    .catch(result => {
      console.log("message")
    });
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("LINEBot is OK!");
});
