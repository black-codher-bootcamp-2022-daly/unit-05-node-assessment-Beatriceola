require("dotenv").config();
const fs = require("fs");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const todoFilePath = process.env.BASE_JSON_PATH;
const getTodos = () => JSON.parse(
  fs.readFileSync(path.join(__dirname, "models/todos.json"))
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(bodyParser.json());

app.use("/content", express.static(path.join(__dirname, "public")));

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname }, (err) => {
    console.log(err);
  });
});

//   res.status(200).end();
// });

app.get("/todos", (_, res) => {
  res.header("Content-Type", "application/json");
  res.sendFile(todoFilePath, { root: __dirname });
  
});

app.get("/", (_, res) => {
  res.sendFile("./public/index.html", { root: __dirname });
});


app.get('/todos/overdue', (req, res) => {
  res.header("Content-Type", "application/json");
  let todos = getTodos()
  .filter((todo) => !todo.completed && Date.parse(todo.due) < new Date() )
  res.send(todos);
});

 
app.get("/todos/completed", (req, res) => {
  const profile = getTodos()
  const result = profile.filter((item) => item.completed == true);
  res.send(result);
});

app.get("/todos/:id", (req, res) => {
  res.header("Content-Type", "application/json");
  const id = req.params.id;
  const data = getTodos();

  const todo = data.find((todo) => todo.id === id);

  if (!todo) {
    res.status(404).send("Todo not found");
  } else {
    res.send(todo);
  }
});

app.post('/todos', (req, res) => {
  const todos = getTodos();
  let newTodo = req.body;
  if (newTodo.name && newTodo.due) {
    newTodo.id = uuidv4()
    newTodo.created = new Date().toISOString()
    newTodo.completed = false
    todos.push(newTodo.name + newTodo.due);
    // create a new file with the array of todos
    //save and update newTodo.json
    const todosJSON = JSON.stringify(newTodo, null, 2);
    fs.writeFileSync("newTodo.json", todosJSON);
    //fs.writeFileSync("newTodo.json", JSON.stringify(newTodo))
    res.setHeader("Content-Type", "application/json").status(201).send(newTodo);}
    else{
      res.status(400).send();
    }
});

app.post("/todos/:id/complete", (req, res) => {
  }
});

// Add GET request with path '/todos/overdue'

// Add GET request with path '/todos/completed'

// Add POST request with path '/todos'

// Add PATCH request with path '/todos/:id

// Add POST request with path '/todos/:id/complete

// Add POST request with path '/todos/:id/undo

// Add DELETE request with path '/todos/:id

module.exports = app;
