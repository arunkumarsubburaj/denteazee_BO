var fs = require("fs");
const express = require("express");
var nodemailer = require("nodemailer"); //importing node mailer
const app = express();
app.set("views", "./views"); // specify the views directory
app.set("view engine", "html"); // register the template engine

// route which captures form details and sends it to your personal mail
var sendMail = function (req, res) {
  console.log("oooo", req.body.email);
  /*Transport service is used by node mailer to send emails, it takes service and auth object as parameters.
    here we are using gmail as our service 
    In Auth object , we specify our email and password
  */
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "arun123.sa@gmail.com", //replace with your email
      pass: "qngmnumjvdllmcjq", //replace with your password
    },
  });

  /*
    In mail options we specify from and to address, subject and HTML content.
    In our case , we use our personal email as from and to address,
    Subject is Contact name and 
    html is our form details which we parsed using bodyParser.
  */
  var appoinmentStream = htmlParser("./views/layout_appoinment.html", req, res);
  var contactUsStream = htmlParser("./views/layout_contactus.html", req, res);
  var mailOptions = {
    from: "arun123.sa@gmail.com", //replace with your email
    to: "arun123.sa@gmail.com", //replace with your email
    subject:
      req.query.type == "contactus"
        ? `New Contact Request`
        : `New Appoinment Request`,
    html: req.query.type == "contactus" ? contactUsStream : appoinmentStream,
  };

  /* Here comes the important part, sendMail is the method which actually sends email, it takes mail options and
   call back as parameter 
  */

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.send("error"); // if error occurs send error as response to client
    } else {
      console.log("Email sent: " + info.response);
      res.send("Sent Successfully"); //if mail is sent successfully send Sent successfully as response
    }
  });
};

var htmlParser = function (filePath, req, res) {
  const content = fs.readFileSync(filePath);
  var rendered = content
    .toString()
    .replace("#name#", req.body.name)
    .replace("#email#", req.body.email)
    .replace("#phoneNo#", req.body.phoneNo);
  if (filePath.indexOf("layout_appoinment") > -1) {
    rendered = rendered
      .replace("#date#", req.body.date)
      .replace("#time#", req.body.time)
      .replace("#department#", req.body.department);
  } else {
    rendered = rendered.replace("#message#", req.body.message);
  }
  return rendered;
};

exports.MailController = {
  sendMail,
};
