require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app= express();
const mongoose= require("mongoose");
const encrypt= require("mongoose-encryption");
mongoose.connect("mongodb://localhost:27017/userDB");
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({extended:true}));

const userSchema= new mongoose.Schema({
  email: String,
  password: String
});
userSchema.plugin(encrypt,{secret: process.env.SECRET, encryptedFields:["password"]});
const User= mongoose.model("User",userSchema);
app.get("/",function(req,res){
  res.render("home");
});
app.get("/register",function(req,res){
  res.render("register");
})
app.get("/login",function(req,res){
  res.render("login");
})
app.post("/register",function(req,res){
  const newUser= new User({
    email:req.body.username,
    password: req.body.password
  });
  newUser.save();
  res.render("home")
});
app.post("/login",function(req,res){
  User.findOne({email:req.body.username},function(err,found){
    if(found)
    {
      if(found.password===req.body.password)
      {
        res.render("secrets");
      }
      else{
        res.send("Unable to login");
      }
    }else{
      res.send(err);
    }
  });
});










app.listen(3000,function(){
  console.log("server is running on port 3000")
})
