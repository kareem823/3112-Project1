import express from "express";
import http from "http";
import { Server } from "socket.io";
import moment from 'moment';
import fs from "fs";
import { port } from "./config.js";
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Project } from "./Schema.js";


const app = express();
const server = http.createServer(app);
const io = new Server(server);


dotenv.config();

const dbUrl = process.env.DBURL;
const db = process.env.DB;

app.use(express.json());

// Dummy data
let projects = [];


io.on("connection", (socket) => {
  console.log("User connected");

  // Send all projects to the client
  Project.find().then((projects) => {
    socket.emit("projects", projects);
  }).catch((error) => {
    console.log('Error fetching projects:', error.message);
  });

  socket.on("createProject", (newProject) => {
    const project = new Project(newProject);
    project.save().then(() => {
      io.emit("createProject", project);
    }).catch((error) => {
      console.log('Error creating project:', error.message);
    });
  });

  socket.on("updateProject", (updatedProject) => {
    Project.findByIdAndUpdate(updatedProject._id, updatedProject, { new: true }).then((project) => {
      io.emit("updateProject", project);
    }).catch((error) => {
      console.log('Error updating project:', error.message);
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

const connection = mongoose.connection;

connection.once('open', () => {
  console.log(`Connected to ${db} database`);
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


/*ver1
import express from "express";
import http from "http";
import { Server } from "socket.io";
import moment from 'moment';
import fs from "fs";
import { port } from "./config.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // To parse the incoming requests with JSON payloads

const users = new Map();
const projects = new Map();

// Socket.io server
const httpServer = http.createServer(app);
   httpServer.listen(port, () => {
  console.log(`listening on port ${port}`);
  });

  function sanitizeJSON(json) {
    if (typeof json === 'string') {
      return json.replace(/<[^>]*>?/gm, '');
    }
  
    if (typeof json === 'object') {
      Object.keys(json).forEach((key) => {
        json[key] = sanitizeJSON(json[key]);
      });
    }
  
    return json;
  }
  

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  });
  

// Handle socket connection
io.on("connection", (socket) => {
  console.log("new connection established");
  
  // Listen to project creation event
  socket.on("createProject", (project) => {
    // Assign an ID to the project
    const id = moment().unix().toString();
    project.id = id;
    // Add the project to the map
    projects.set(id, project);
    // Emit the created project to all clients
    io.emit("projectCreated", project);
  });
  
  // Listen to team member addition event
  socket.on("addTeamMember", ({projectId, member}) => {
    // Find the project and add the team member to the project
    const project = projects.get(projectId);
    project.team.push(member);
    // Emit the updated project to all clients
    io.emit("teamMemberAdded", project);


    console.log("a user connected");

    // emit the "newUser" event with the user's name to all clients
    socket.on("newUser", (name) => {
      io.emit("newUser", name);
    });
  
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
  
  // Listen to sprint planning event
  socket.on("planSprint", ({projectId, sprint}) => {
    // Find the project and update the sprint
    const project = projects.get(projectId);
    project.sprints.push(sprint);
    // Emit the updated project to all clients
    io.emit("sprintPlanned", project);
  });
  
  // Listen to subtask update event
  socket.on("updateSubtask", ({projectId, sprintId, userId, subtask}) => {
    // Find the project, sprint, and user
    const project = projects.get(projectId);
    const sprint = project.sprints.find(s => s.id === sprintId);
    const user = sprint.team.find(u => u.id === userId);
    // Update the user's subtask
    const subtaskIndex = user.subtasks.findIndex(s => s.id === subtask.id);
    user.subtasks[subtaskIndex] = subtask;
    // Emit the updated project to all clients
    io.emit("subtaskUpdated", project);
  });
  
  // Listen to user story update event
  socket.on("updateUserStory", ({projectId, userStory}) => {
    // Find the project and user story
    const project = projects.get(projectId);
    const storyIndex = project.userStories.findIndex(s => s.id === userStory.id);
    // Update the user story
    project.userStories[storyIndex] = userStory;
    // Emit the updated project to all clients
    io.emit("userStoryUpdated", project);
  });
  
  // Listen to sprint completion event
  socket.on("completeSprint", ({projectId, sprintId}) => {
    // Find the project and sprint
    const project = projects.get(projectId);
    const sprintIndex = project.sprints.findIndex(s => s.id === sprintId);
    // Remove the sprint from the project
    project.sprints.splice(sprintIndex, 1);
// Emit the updated project to all clients
io.emit("sprintCompleted", project);
});

// Listen to copy user stories event
socket.on("copyUserStories", ({projectId, sprintId}) => {
// Find the project and sprint
const project = projects.get(projectId);
const sprint = project.sprints.find(s => s.id === sprintId);
// Find the incomplete user stories
const incompleteUserStories = sprint.userStories.filter(s => s.status !== "Completed");
// Add the incomplete user stories to the next sprint
const nextSprint = {...sprint, id: moment().unix().toString(), userStories: incompleteUserStories};
project.sprints.push(nextSprint);
// Emit the updated project to all clients
io.emit("userStoriesCopied", project);
});

// Listen to disconnection event
socket.on("disconnect", () => {
console.log("connection lost");
});
});
// Endpoint to retrieve all projects
app.get("/api/projects", (req, res) => {
  const projectsArray = [...projects.values()];
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sanitizeJSON(projectsArray)));
});

// Endpoint to retrieve a project by ID
app.get("/api/projects/:id", (req, res) => {
  const project = projects.get(req.params.id);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sanitizeJSON(project)));
});

// Endpoint to create a new project
app.post("/api/projects", (req, res) => {
  const project = req.body;
  // Assign an ID to the project
  const id = moment().unix().toString();
  project.id = id;
  // Add the project to the map
  projects.set(id, project);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sanitizeJSON(project)));
});

// Endpoint to update a project
app.put("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  const updatedProject = req.body;
  projects.set(projectId, updatedProject);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sanitizeJSON(updatedProject)));
});

// Endpoint to delete a project
app.delete("/api/projects/:id", (req, res) => {
  const projectId = req.params.id;
  projects.delete(projectId);
  res.setHeader('Content-Type', 'application/json');
  res.send(JSON.stringify(sanitizeJSON(projectId)));
});




export default io;
*/