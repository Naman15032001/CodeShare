var express = require('express');
var router = express.Router();

var nodemailer=require('nodemailer');
var config=require('../config');
var transporter=nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Share Code a platform real time sharing code'});
});
router.get('/about',function(req,res,next){
  res.render('about',{title:'Share Code a platform real time sharing code'});

});
router.route('/contact')
      .get(function(req,res,next){
  res.render('contact',{title:'Share Code a platform for real time sharing code'});

}).post(function(req,res,next){
  req.checkBody('name','Empty name').notEmpty();
  req.checkBody('email','Invalid email').isEmail();
  req.checkBody('message','Empty message').notEmpty();
  var errors=req.validationErrors();

  if(errors){
    res.render('contact',{
      title:'Share Code a platform for real time sharing code',
      name:req.body.name,
      email:req.body.email,
      message:req.body.message,
      errorMessages:errors

    });
  }else{
    var mailOptions={
      from:'Sharecode <no-reply@codeshare.com>',
      to:'mikejames8690@gmail.com',
      subject:'You got a new message from visitor 😎',
      text:req.body.message
    };
    transporter.sendMail(mailOptions,function(error,info){
      if(error){
        return console.log(error);
      }
      res.render('thank',{title:'Share Code a platform for real time sharing code'});
    });
  }
});




module.exports = router;
