
const { initializeApp, cert } = require('firebase-admin/app');
//const { getFirestore} = require('firebase-admin/firestore');
var express = require('express')  
var app = express()  
const port=3000;
//const { initializeApp } = require("firebase-admin/app");
const { getFirestore}=require('firebase-admin/firestore');
var serviceAccount = require("./key.json");
initializeApp({
    credential: cert(serviceAccount),
});
const db=getFirestore();
app.set('view engine','ejs');
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
			res.send("Login Succesfull");
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
		res.send("sign up succesfull");
	});
});
app.listen(3000, function () {  
console.log('Example app listening on port 3000!')  
})