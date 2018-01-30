const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Url = require("./models/url.js");

const app = express();

app.use(express.static(path.join(__dirname, "/public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect(
  "mongodb://John:123456@ds115758.mlab.com:15758/my-mongodb-app"
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  app.listen(3000, () => {
    console.log("Listening on port 3000...");
  });
});

app.get("/", (req, res) => {
    res.render("index", {}); 
  });


app.post("/urls", (req, res) => {
  const shorten = Math.random().toString(36).substr(2, 5);
  Url.findOne({ longurl: req.body.longurl }, (err, doc) => {
    if (doc) {
      res.render("url", { url: doc });
    } else {
      Url.create(
        {
          longurl: req.body.longurl,
          shorturl: shorten
        },
        (err, doc) => {
          if (err) return console.log(err);
          res.render("url", { url: doc });
        }
      );
    }
  });
});

// app.post("/urls", (req, res) => {
//   const shorten = Math.random().toString(36).substr(2, 5);
//   const url = new Url({
//     longurl: req.body.longurl,
//     shorturl: shorten
//   });
//   Url.findOne({ longurl: req.body.longurl }, (err, doc) => {
//     if (doc) {
//       res.render("url", { url: doc });
//     } else {
//       url.save((err, doc) => {
//         if (err) return console.log(err);
//         res.render("url", { url: doc });
//       });
//     }
//   });
// });

app.get('/:inputurl', (req, res) => {
  let inputurl = req.params.inputurl;
  Url.findOne({ shorturl: inputurl}, (err, doc) => {
    if (doc) {
      res.redirect(doc.longurl);
    } else {
      res.render('index', { invalidurl: inputurl});
    }
  })
});