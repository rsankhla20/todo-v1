// this is the old version of app.js which doesnot use database to store tasks

const express = require('express');
const bodyparser = require('body-parser');
const date = require(__dirname + "/date.js");

// console.log(date); return  function name
//console.log(date());  return day value;

const app = express();

app.set('view engine', 'ejs'); // this line set ejs as the view engine of the express
app.use(bodyparser.urlencoded({extended:true}));
app.use(express.static("public"));

// by making array const we can still push values to it but can't assign a new array to it

const items =["Buy Food" , "Cook Food" , "Eat Food"];
const workItems= [];



app.get("/" , function(req,res){

  //  let day = date.getDate();
  const day = date.getDate();
    res.render("lists" ,{
        listTitle:day,
        newListItem:items
    });

});

app.post("/",function(req,res){
    const item =  req.body.newItem;
    
    if(req.body.list === "Work"){
        if(item.length!=0){
        workItems.push(item);
        }
        res.redirect("/work");
    }else{
        if(item.length!=0){
        items.push(item);
        }
        res.redirect("/");
     }
});

app.get("/work" , function(req,res){
    res.render("lists" ,{listTitle:"Work List", newListItem:workItems});
})

app.post("/work",function(req,res){
    
    // const item =  req.body.newItem;
    // workItems.push(item);
    res.redirect("/work");
})

app.get("/about" , function(req,res){
    res.render("about");
})

app.listen(3000, function(){
    console.log("server is running at port : 3000");
})