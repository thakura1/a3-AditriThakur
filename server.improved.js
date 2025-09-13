const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library if you"re testing this on your local machine.
  // However, Glitch will install it automatically by looking in your package.json
  // file.
  mime = require("mime"),
  dir = "public/",
  port = 3000;

// Data Storage
const todos = [
  // { id: 1, name: "Example task", deadline: "2025-09-15", importance: "medium", daysLeft: "7"}
];

// Can handle GET and POST requests
const server = http.createServer(function (request, response) {
  if (request.method === "GET") {
    handleGet(request, response);
  } else if (request.method === "POST") {
    handlePost(request, response);
  }
});

function derivedDays(todo) {
  const [y, m, d] = String(todo.deadline).split("-").map(Number);
  const today = new Date();
  const todayLocal = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const dueLocal = new Date(y, m - 1, d);
  const msPerDay = 24 * 60 * 60 * 1000;
  // Due today Shows 0 days left
  return Math.round((dueLocal - todayLocal) / msPerDay);
}

const handleGet = function (request, response) {
  const filename = dir + request.url.slice(1);

  // Homepage
  if (request.url === "/") {
    sendFile(response, "public/index.html");
  }
  // Sends back todos
  else if (request.url === "/todos") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ todos }));
    return;
  } else {
    // Any other request for a file
    sendFile(response, filename);
  }
};

const handlePost = function (request, response) {
  let dataString = "";

  request.on("data", function (data) {
    dataString += data;
  });

  request.on("end", function () {
    //console.log(JSON.parse(dataString));

    // Body exists outside of submit because update and delete also adjust todos
    let body = {};
    try {
      body = JSON.parse(dataString || "{}");
    } catch (e) {
      response.writeHead(400, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ error: "Could not parse JSON" }));
      return;
    }
    // ... do something with the data here!!!
    // Only request to submit will get todos
    if (request.url === "/submit") {
      const { name, deadline, importance } = body;

      // Error so all feilds are filled out, send error status
      if (!name || !deadline || !importance) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Missing required fields." }));
        return;
      }

      const todo = {
        id: Date.now(),
        name: String(name).trim(),
        deadline: String(deadline),
        importance: String(importance),
        daysLeft: derivedDays({ deadline }),
      };

      todos.push(todo);

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ todos }));
      return;
    } else if (request.url === "/update") {
      const { id, name, deadline, importance } = body;
      if (!id) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Missing id." }));
        return;
      }

      // Find todo by id
      const idx = todos.findIndex((t) => String(t.id) === String(id));
      if (idx === -1) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Todo not found." }));
        return;
      }

      // Update provided fields
      if (typeof name === "string") todos[idx].name = name.trim();
      if (typeof deadline === "string") todos[idx].deadline = deadline;
      if (typeof importance === "string") todos[idx].importance = importance;

      // Recompute daysLeft
      todos[idx].daysLeft = derivedDays({ deadline: todos[idx].deadline });

      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ todos }));
      return;
    }

    else if (request.url === "/delete") {
      const { id } = body;
      if (!id) {
        response.writeHead(400, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Missing id." }));
        return;
      }
      // Find todo by id
      const idx = todos.findIndex((t) => String(t.id) === String(id));
      if (idx === -1) {
        response.writeHead(404, { "Content-Type": "application/json" });
        response.end(JSON.stringify({ error: "Todo not found." }));
        return;
      }
      // Splice removes index item
      todos.splice(idx, 1);
      response.writeHead(200, { "Content-Type": "application/json" });
      response.end(JSON.stringify({ todos }));
      return;
    }
    else {
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("Not Found");
      return;
    }

    // response.writeHead(200, "OK", { "Content-Type": "text/plain" });
    // response.end("test");
  });
};

const sendFile = function (response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function (err, content) {
    // if the error = null, then we"ve loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHead(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHead(404, { "Content-Type": "text/plain" });
      response.end("404 Error: File Not Found");
    }
  });
};

server.listen(process.env.PORT || port);
