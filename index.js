const e = require("express");
const express = require("express");
const math=require("mathjs");
const app = express();
//const port = 3000;

const { initializeApp, cert } = require('firebase-admin/app');
//const { getFirestore} = require('firebase-admin/firestore');
//var express = require('express')  
//var app = express()  
const port=3000;
//const { initializeApp } = require("firebase-admin/app");
const { getFirestore}=require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount),
});
const db=getFirestore();
app.set('view engine','ejs');
app.use(express.static('public'));
 app.get("/signin",function(req,res){
 	res.render("signin");
 });
 app.get("/signup",function(req,res){
 	res.render("signup");
 });
 app.get("/signinsubmit",(req,res)=>{
	const Email=req.query.Email;
   // console.log("Email",Email);
	const password=req.query.password;
   // console.log("Password",password);
	db.collection("customers")
	.where("Email","==",Email)
	.where("password","==",password)
	.get()
	.then((docs) => {
        //console.log(docs.size);
		if(docs.size > 0){
			res.render("Home");
		}
		else{
			res.send("Login Failed");
		}
        
	});
});
 
app.get("/signupsubmit",(req,res)=>{
	const Name=req.query.Name;
	const Email=req.query.Email;
	const password=req.query.password;
	db.collection("customers").add({
		Name : Name,
		Email : Email,
		password: password,
	}).then(()=>{
		res.render("signin");
	});
});

const arr=[];
const costs=[];
var amount=0;
app.get("/add_adv_ToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=math.evaluate(c.slice(0,c.length-2));
	amount=amount+c;
	arr.push(val);
	res.render("home");
});
app.get("/add_myth_ToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=math.evaluate(c.slice(0,c.length-2));
	amount=amount+c;
	arr.push(val);
	res.render("home2");
});
app.get("/add_k_ToCart",(req,res)=>{
	const val=req.query.item;
	var c=req.query.cost;
	costs.push(c);
	c=math.evaluate(c.slice(0,c.length-2));
	amount=amount+c;
	arr.push(val);
	res.render("home3");
});

app.get("/cart",(req,res)=>{
	if(typeof(arr) != "undefined"){
		db.collection("Cart").add({
			Cart : arr,
			Costs : costs,
			TotalCost : amount,
		}).then(()=>{
			res.render("cart",{booksData : arr, amount : amount, costs : costs});
		});
	}
});
app.get("/Home",function(req,res){
	res.render("Home2");
});
app.get("/Home2",function(req,res){
	res.render("Home3");
});
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})
