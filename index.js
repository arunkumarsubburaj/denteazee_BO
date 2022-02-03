const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "html");

const { MailController } = require("./node_mailer");
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/email", MailController.sendMail);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
