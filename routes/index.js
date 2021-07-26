var express = require('express');
var router = express.Router();
var mongoClient = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;

/* 
  1)you have created a collection for todos. 
  one document in collections should look like {todo:"cook",status:"completed"}
  another example is of a todo not completed {todo:"shop",status:"incomplete"}
  you will create an api called with url localhost:3000/todos
  it will show all todos.
  you will create a url called localhost:3000/todocompleted. this time u will return the todo which are completed
  you will create a url called localhost:3000/todocompleted. this time u will return the todo which are not completed
*/
router.get('/todos', function(req, res, next) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("todos")
        .find()
        .toArray()
        .then( (result) => {
          var links = `
            <a href='/todocompleted'>Todo Completed</a>&nbsp;
            <a href='/todoincomplete'>Todo Incomplete</a>&nbsp;
          `;
          var tr = `
              <html>
                <body>
                  ${links}<br /><br />
                  <table border='2'>
                    <tr>
                      <td>Todo</td>
                      <td>Status</td>
                    </tr>
            `;
          result.forEach( (value,index) => {
            tr += `<tr><td>${value.todo}</td><td>${value.status}</td></tr>`;
          });
          tr += "</table></body></html>";
          res.send(tr);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});

//// INCOMPLETE

router.get('/todoincomplete', function(req, res, next) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("todos")
        .find({status: {$eq: "incomplete"}})
        .toArray()
        .then( (result) => {
          var links = `
            <a href='/todos'>Todos</a>&nbsp;
            <a href='/todocompleted'>Todo Completed</a>&nbsp;
          `;
          var tr = `
              <html>
                <body>
                  ${links}<br /><br />
                  <table border='2'>
                    <tr>
                      <td>Todo</td>
                      <td>Status</td>
                    </tr>
            `;
          result.forEach( (value,index) => {
            tr += `<tr><td>${value.todo}</td><td>${value.status}</td></tr>`;
          });
          tr += "</table></body></html>";
          res.send(tr);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});



////COMPLETED

router.get('/todocompleted', function(req, res, next) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("todos")
        .find({status: {$eq: "completed"}})
        .toArray()
        .then( (result) => {
          var links = `
            <a href='/todos'>Todos</a>&nbsp;
            <a href='/todoincomplete'>Todo Incomplete</a>&nbsp;
          `;
          var tr = `
              <html>
                <body>
                  ${links}<br /><br />
                  <table border='2'>
                    <tr>
                      <td>Todo</td>
                      <td>Status</td>
                    </tr>
            `;
          result.forEach( (value,index) => {
            tr += `<tr><td>${value.todo}</td><td>${value.status}</td></tr>`;
          });
          tr += "</table></body></html>";
          res.send(tr);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});



/*
  2)Create a Ecommerce API.
  you need to have 1 collection.
  Products: should have name,price, avaialability(available/not available)
  you need to create 4 end points
  post url localhost:3000/product will create product. 
  get url localhost:3000/product -- show all products as json
  delete url localhost:3000/product/id
  localhost/product/id -->send json for only that product.
*/

router.get("/productform",function(req,res) {
  var html = `
    <html>
      <body>
        <center>
          <form action="/createproduct" method="post">
            <input type="text" name="name" placeholder="Enter product name"><br />
            <input type="price" name="price" placeholder="Enter product price"><br />
            Availability:<br />
            Available: <input type="radio" name="available" value="available">
            Unavailable: <input type="radio" name="available" value="unavailable"><br /><br />
            <button>Create product</button>
          </form>
        <center>
      </body>
    </html>
  `;
  res.send(html);
});

router.post("/createproduct", function(req,res) {
  var db;
  var connectionString = "mongodb://localhost:27017";
  console.log(req.body);
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db!");
      } else {
        db.collection("products")
        .insertOne({name: req.body.name, price: req.body.price, availability: req.body.available})
        .then( (result) => {
          console.log(result);
          res.send("<html><body>Product created!<br /><br /><a href='/product'>Go to products</a></body></html>");
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        });
      }
    })
    .catch( (err) => {
      res.send({status:0, msg: err});
    });
});

router.get("/product", function(req,res) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("products")
        .find()
        .toArray()
        .then( (result) => {
          var tr = `
              <html>
                <body>
                  <table border='2' cellpadding="4" cellspacing="4">
                    <tr>
                      <td>Product</td>
                      <td>Price(Rs)</td>
                      <td>Availability</td>
                      <td>Object ID</td>
                    </tr>
            `;
          result.forEach( (value,index) => {
            tr += `<tr><td>${value.name}</td><td>${value.price}</td><td>${value.availability}</td><td>${value._id}</td></tr>`;
          });
          tr += "</table></body></html>";
          res.send(tr);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});



router.get("/productbyid/:id", function(req,res) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("products")
        .find({_id: ObjectId(req.params.id)})
        .toArray()
        .then( (result) => {
          res.json(result);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});




router.delete("/deleteproductbyid/:id", function(req,res) {
  var db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("products")
        .deleteOne({_id: ObjectId(req.params.id)})
        .then( (result) => {
          res.json({status: 1, msg: "Deleted successfully!"});
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      console.log(err);
      res.json({status: -1, msg: err});
    });
});





/*
  3) create a user api.
  fields are username,name,dob,password
  you need to create 4 end points
  post url localhost:3000/user will create user. 
  get url localhost:3000/user -- show all users as json
  delete url localhost:3000/user/id
  localhost/user/id -->send json for only that user.
*/

router.get("/userform",function(req,res) {
  var html = `
    <html>
      <body>
        <center>
          <form action="/createuser" method="post">
            <input type="text" name="username" placeholder="Enter username"><br />
            <input type="text" name="name" placeholder="Enter name"><br />
            <input type="text" name="dob" placeholder="Enter dob"><br />
            <input type="password" name="password" placeholder="Enter password"><br />
            <button>Create User</button>
          </form>
        <center>
      </body>
    </html>
  `;
  res.send(html);
});

router.post("/createuser", function(req,res) {
  var db;
  var connectionString = "mongodb://localhost:27017";
  console.log(req.body);
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db!");
      } else {
        db.collection("users")
        .insertOne({username: req.body.username, name: req.body.name, dob: req.body.dob, password: req.body.password})
        .then( (result) => {
          console.log(result);
          res.send("<html><body>User created!<br /><br /><a href='/user'>Go to users</a></body></html>");
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        });
      }
    })
    .catch( (err) => {
      res.send({status:0, msg: err});
    });
});

router.get("/user", function(req,res) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("users")
        .find()
        .toArray()
        .then( (result) => {
          var tr = `
              <html>
                <body>
                  <table border='2' cellpadding="4" cellspacing="4">
                    <tr>
                      <td>Username</td>
                      <td>Name</td>
                      <td>DOB</td>
                      <td>Password</td>
                      <td>ID</td>
                    </tr>
            `;
          result.forEach( (value,index) => {
            tr += `<tr><td>${value.username}</td><td>${value.name}</td><td>${value.dob}</td><td>${value.password}</td><td>${value._id}</td></tr>`;
          });
          tr += "</table></body></html>";
          res.send(tr);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});



router.get("/userbyid/:id", function(req,res) {
  let db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("users")
        .find({_id: ObjectId(req.params.id)})
        .toArray()
        .then( (result) => {
          res.json(result);
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      res.json({status: 0, msg: err});
    });
});




router.delete("/deleteuserbyid/:id", function(req,res) {
  var db;
  var connectionString = "mongodb://localhost:27017";
  mongoClient
    .connect(connectionString)
    .then( (client) => {
      db = client.db("julyexpress");
      if(!db) {
        console.log("Could not connect to db");
      } else {
        db.collection("users")
        .deleteOne({_id: ObjectId(req.params.id)})
        .then( (result) => {
          res.json({status: 1, msg: "Deleted successfully!"});
        })
        .catch( (err) => {
          res.json({status: 0, msg: err});
        })
      }
    })
    .catch( (err) => {
      console.log(err);
      res.json({status: -1, msg: err});
    });
});

module.exports = router;
