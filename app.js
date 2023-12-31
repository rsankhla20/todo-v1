const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs"); // this line set ejs as the view engine of the express
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
  "mongodb+srv://sankhlarakesh4321:Rakesh4321@cluster0.xx63jxo.mongodb.net/todolistDB",
  { useNewUrlParser: true }
);

const itemsSchema = new mongoose.Schema({ name: String });

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({ name: "Welcome to your todolist!" });
const item2 = new Item({ name: "Hit + button to add a new item." });
const item3 = new Item({ name: "<-- Hit this to delete an item" });

const defalutItems = [item1, item2, item3];

//Item.insertMany(defalutItems);

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});
const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find().then(function (result) {
    if (result.length === 0) {
      Item.insertMany(defalutItems);
      res.redirect("/");
    } else {
      res.render("lists", {
        listTitle: "Today",
        newListItem: result,
      });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({ name: itemName });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(function (foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId).catch((err) => console.log(err));

    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } }
    ).catch((err) => console.log(err));
    res.redirect("/" + listName);
  }
});
app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }).then(function (result) {
    if (!result) {
      // create new list
      const list = new List({
        name: customListName,
        items: defalutItems,
      });
      list.save();
      res.redirect("/" + customListName);
    } else {
      //show existing list
      res.render("lists", {
        listTitle: result.name,
        newListItem: result.items,
      });
    }
  });
});

app.listen(3000, function () {
  console.log("server is running at port : 3000");
});
