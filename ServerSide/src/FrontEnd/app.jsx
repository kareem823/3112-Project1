

import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
TextField,
FormHelperText,
Button,
Typography,
ThemeProvider,
Card,
CardHeader,
AppBar,
Toolbar,
IconButton,
Dialog,
DialogTitle,
DialogContent,
DialogContentText, DialogActions, CardContent,
RadioGroup, FormControlLabel, Radio, FormControl, FormLabel
} from "@mui/material";
import { List, ListItem, ListItemText, Box } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import "../App.css";
import ChatLogo from "../FrontEnd/ChatLogo.jpg";
import theme from "./theme.js";
//import { handleNewTeamMemberEmailChange } from "./team.js";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"]
});

const app = () => {
const [projects, setProjects] = useState([]);
const [selectedProject, setSelectedProject] = useState(null);
const [projectFormOpen, setProjectFormOpen] = useState(false);
const [teamMemberFormOpen, setTeamMemberFormOpen] = useState(false);
const [userStoryFormOpen, setUserStoryFormOpen] = useState(false);
const [subtaskFormOpen, setSubtaskFormOpen] = useState(false);
const [sprintFormOpen, setSprintFormOpen] = useState(false);
const [newProjectName, setNewProjectName] = useState("");
const [newProjectDescription, setNewProjectDescription] = useState("");
const [newTeamMemberName, setNewTeamMemberName] = useState("");
const [newUserStoryTitle, setNewUserStoryTitle] = useState("");
const [newUserStoryDescription, setNewUserStoryDescription] = useState("");
const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
const [newSubtaskDescription, setNewSubtaskDescription] = useState("");
const [newSubtaskAssignee, setNewSubtaskAssignee] = useState("");
const [newSprintName, setNewSprintName] = useState("");
const [newSprintGoal, setNewSprintGoal] = useState("");
const [newSprintStartDate, setNewSprintStartDate] = useState("");
const [newSprintEndDate, setNewSprintEndDate] = useState("");
const [newSprintStatus, setNewSprintStatus] = useState("");
const [newTeamMemberEmail, setNewTeamMemberEmail] = useState("");
const [userStoryFormMode, setUserStoryFormMode] = useState("create");
const [selectedUserStory, setSelectedUserStory] = useState(null);


useEffect(() => {
  // Load all projects from the server
  fetch("/api/projects")
    .then(res => {
      if (!res.ok) {
        throw new Error('Error fetching projects: ' + res.statusText);
      }
      return res.json();
    })
    .then(data => setProjects(data))
    .catch(error => {
      console.error(error);
      alert('An error occurred while fetching projects. Please try again later.');
    });

  // Listen to project created event
  socket.on("projectCreated", project => {
    setProjects([...projects, project]);
  });

  // Listen to team member added event
  socket.on("teamMemberAdded", project => {
    setSelectedProject(project);
  });

  // Listen to user story updated event
  socket.on("userStoryUpdated", project => {
    setSelectedProject(project);
  });

  // Listen to subtask updated event
  socket.on("subtaskUpdated", project => {
    setSelectedProject(project);
  });

  // Listen to sprint completed event
  socket.on("sprintCompleted", project => {
    setSelectedProject(project);
  });

  // Listen to user stories copied event
  socket.on("userStoriesCopied", project => {
    setSelectedProject(project);
  });
}, []);



const handleProjectFormOpen = () => {
setProjectFormOpen(true);
};

const handleProjectFormClose = () => {
setProjectFormOpen(false);
};

const handleTeamMemberFormOpen = () => {
setTeamMemberFormOpen(true);
};

const handleTeamMemberFormClose = () => {
setTeamMemberFormOpen(false);
};

const handleUserStoryFormClose = () => {
setUserStoryFormOpen(false);
};

const handleSubtaskFormClose = () => {
setSubtaskFormOpen(false);
};


const handleSprintFormClose = () => {
setSprintFormOpen(false);
};

const handleNewProjectNameChange = (event) => {
setNewProjectName(event.target.value);
};

const handleNewProjectDescriptionChange = (event) => {
setNewProjectDescription(event.target.value);
};

const handleNewTeamMemberNameChange = (event) => {
setNewTeamMemberName(event.target.value);
};

const handleNewUserStoryTitleChange = (event) => {
setNewUserStoryTitle(event.target.value);
};

const handleNewUserStoryDescriptionChange = (event) => {
setNewUserStoryDescription(event.target.value);
};

const handleNewSubtaskTitleChange = (event) => {
setNewSubtaskTitle(event.target.value);
};

const handleNewSubtaskDescriptionChange = (event) => {
setNewSubtaskDescription(event.target.value);
};

const handleNewSubtaskAssigneeChange = (event) => {
setNewSubtaskAssignee(event.target.value);
};

const handleNewSprintNameChange = ( 
event) => {
setNewSprintName(event.target.value);
};

const handleNewSprintGoalChange = (event) => {
setNewSprintGoal(event.target.value);
};

const handleNewSprintStartDateChange = (event) => {
setNewSprintStartDate(event.target.value);
};

const handleNewSprintEndDateChange = (event) => {
setNewSprintEndDate(event.target.value);
};

const handleNewSprintStatusChange = (event) => {
setNewSprintStatus(event.target.value);
};

const handleProjectCreate = () => {
const newProject = {
name: newProjectName,
description: newProjectDescription,
team: [],
sprints: [],
userStories: []
};
socket.emit("createProject", newProject);
setNewProjectName("");
setNewProjectDescription("");
handleProjectFormClose();
};


const handleTeamMemberAdd = () => {
  if (!selectedProject) {
    return;
  }

  const maxId = Math.max(
    ...selectedProject.team.map((member) => (member ? member.id : -1))
  );
  const newTeamMember = {
    name: newTeamMemberName,
    role: "",
    subtasks: []
    };
    socket.emit("addTeamMember", {projectId: selectedProject.id, member: newTeamMember});
    setNewTeamMemberName("");
    handleTeamMemberFormClose();};


const handleUserStoryUpdate = (userStory) => {
socket.emit("updateUserStory", {projectId: selectedProject.id, userStory});
};

const handleSprintPlan = () => {
const newSprint = {
name: newSprintName,
goal: newSprintGoal,
startDate: newSprintStartDate,
endDate: newSprintEndDate,
status: newSprintStatus,
team: [],
userStories: []
};
socket.emit("planSprint", {projectId: selectedProject.id, sprint: newSprint});
setNewSprintName("");
setNewSprintGoal("");
setNewSprintStartDate("");
setNewSprintEndDate("");
setNewSprintStatus("");
handleSprintFormClose();
};


/**should be in a separate folder */
const handleNewTeamMemberEmailChange = (event) => {
  setNewTeamMemberEmail(event.target.value);
};

const handleUserStoryCreate = () => {
  const newUserStory = {
    title: newUserStoryTitle,
    description: newUserStoryDescription,
    subtasks: [],
  };
  socket.emit("createUserStory", { projectId: selectedProject.id, userStory: newUserStory });
  setNewUserStoryTitle("");
  setNewUserStoryDescription("");
  handleUserStoryFormClose();
};

const handleSubtaskCreate = () => {
  const newSubtask = {
    title: newSubtaskTitle,
    description: newSubtaskDescription,
    assignee: newSubtaskAssignee,
    status: "TODO",
  };
  socket.emit("createSubtask", {
    projectId: selectedProject.id,
    userStoryId: selectedUserStory.id,
    subtask: newSubtask,
  });
  setNewSubtaskTitle("");
  setNewSubtaskDescription("");
  setNewSubtaskAssignee("");
  handleSubtaskFormClose();
};

    return (
      <ThemeProvider theme={theme}>
        <div className="App">
          <Header handleTeamMemberFormOpen={handleTeamMemberFormOpen} />
          <MainContent
            projects={projects}
            setSelectedProject={setSelectedProject}
            handleProjectFormOpen={handleProjectFormOpen}
            selectedProject={selectedProject}
          />
          <ProjectDialog
            projectFormOpen={projectFormOpen}
            handleProjectFormClose={handleProjectFormClose}
            newProjectName={newProjectName}
            handleNewProjectNameChange={handleNewProjectNameChange}
            newProjectDescription={newProjectDescription}
            handleNewProjectDescriptionChange={handleNewProjectDescriptionChange}
            handleProjectCreate={handleProjectCreate}
          />
          <TeamMemberDialog
            teamMemberFormOpen={teamMemberFormOpen}
            handleTeamMemberFormClose={handleTeamMemberFormClose}
            newTeamMemberName={newTeamMemberName}
            handleNewTeamMemberNameChange={handleNewTeamMemberNameChange}
            newTeamMemberEmail={newTeamMemberEmail}
            handleNewTeamMemberEmailChange={handleNewTeamMemberEmailChange}
            handleTeamMemberAdd={handleTeamMemberAdd}
          />
          <UserStoryDialog
            userStoryFormOpen={userStoryFormOpen}
            handleUserStoryFormClose={handleUserStoryFormClose}
            userStoryFormMode={userStoryFormMode}
            newUserStoryTitle={newUserStoryTitle}
            handleNewUserStoryTitleChange={handleNewUserStoryTitleChange}
            newUserStoryDescription={newUserStoryDescription}
            handleNewUserStoryDescriptionChange={handleNewUserStoryDescriptionChange}
            handleUserStoryCreate={handleUserStoryCreate}
            handleUserStoryUpdate={handleUserStoryUpdate}
          />
          <SubtaskDialog
            subtaskFormOpen={subtaskFormOpen}
            handleSubtaskFormClose={handleSubtaskFormClose}
            newSubtaskTitle={newSubtaskTitle}
            handleNewSubtaskTitleChange={handleNewSubtaskTitleChange}
            newSubtaskDescription={newSubtaskDescription}
            handleNewSubtaskDescriptionChange={handleNewSubtaskDescriptionChange}
            newSubtaskAssignee={newSubtaskAssignee}
            handleNewSubtaskAssigneeChange={handleNewSubtaskAssigneeChange}
            selectedProject={selectedProject}
            handleSubtaskCreate={handleSubtaskCreate}
          />
          <SprintDialog
            sprintFormOpen={sprintFormOpen}
            handleSprintFormClose={handleSprintFormClose}
            newSprintName={newSprintName}
            handleNewSprintNameChange={handleNewSprintNameChange}
            newSprintGoal={newSprintGoal}
            handleNewSprintGoalChange={handleNewSprintGoalChange}
            newSprintStartDate={newSprintStartDate}
            handleNewSprintStartDateChange={handleNewSprintStartDateChange}
            newSprintEndDate={newSprintEndDate}
            handleNewSprintEndDateChange={handleNewSprintEndDateChange}
            newSprintStatus={newSprintStatus}
            handleNewSprintStatusChange={handleNewSprintStatusChange}
            handleSprintPlan={handleSprintPlan}
          />
        </div>
      </ThemeProvider>
    );
  }
  
  export default app;