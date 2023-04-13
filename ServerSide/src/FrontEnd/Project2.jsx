
import { useState, useEffect } from "react";
import io from "socket.io-client";
import {
  Box,
TextField,
FormHelperText,
ListItemText,
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
RadioGroup, FormControlLabel, Radio, FormControl, FormLabel,

Table,
TableHead,
TableRow,
TableCell,
TableBody,
} from "@mui/material";
//import { ThemeProvider, AppBar, Toolbar, Typography, IconButton, Box, Button, List, ListItem, ListItemText, Card, CardHeader, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { List, ListItem } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import "../App.css";
import theme from "./theme.js";
//import { handleNewTeamMemberEmailChange } from "./team.js";
import { Add } from '@mui/icons-material';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";


const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"]
});

const Assignment = () => {

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  const [newUserName, setnewUserName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");

  const [showCard, setShowCard] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [tableRows, setTableRows] = useState(6);
  const [tableColumns, setTableColumns] = useState(5);
  const [concerns, setConcerns] = useState("Enter concerns");
  
  /*
  const handleProjectUpdate = (updatedProjectTitle, updatedTableRows, updatedTableColumns, updatedConcerns) => {
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        projectTitle: updatedProjectTitle,
        tableRows: updatedTableRows,
        tableColumns: updatedTableColumns,
        concerns: updatedConcerns,
      };
  
      // Update the local state
      setSelectedProject(updatedProject);
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
  
      // Emit the updated project to the server
      socket.emit("updateProject", updatedProject);
    }
  };
  */
  const handleProjectUpdate = () => {
    if (selectedProject) {
      const updatedProject = {
        ...selectedProject,
        projectTitle: projectTitle,
        tableRows: tableRows,
        tableColumns: tableColumns,
        concerns: concerns,
        _id: selectedProject._id
      };
  
      // Update the local state
      setSelectedProject(updatedProject);
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
     // Emit the updated project to the server using socket.io
  socket.emit("updateProject", updatedProject);
  }
  };
  
  useEffect(() => {
    socket.on("projects", (projects) => {
      setProjects(projects);
  
      // If there is a selected project, update it with the latest data
      if (selectedProject) {
        const updatedProject = projects.find((project) => project.id === selectedProject.id);
        if (updatedProject) {
          setSelectedProject(updatedProject);
          setProjectTitle(updatedProject.projectTitle || "");
          setTableRows(updatedProject.tableRows || 6);
          setTableColumns(updatedProject.tableColumns || 5);
          setConcerns(updatedProject.concerns || "Enter concerns");
        }
      }
    });
  
    socket.on("updateProject", (updatedProject) => {
      const updatedProjects = projects.map((project) =>
        project.id === updatedProject.id ? updatedProject : project
      );
      setProjects(updatedProjects);
  
      // If the updated project is the selected project, update its data in the local state
      if (selectedProject && selectedProject.id === updatedProject.id) {
        setSelectedProject(updatedProject);
        setProjectTitle(updatedProject.projectTitle || "");
        setTableRows(updatedProject.tableRows || 6);
        setTableColumns(updatedProject.tableColumns || 5);
        setConcerns(updatedProject.concerns || "Enter concerns");
      }
    });
  
    return () => {
      socket.off("projects");
      socket.off("updateProject");
    };
  }, [selectedProject, projects]);
  

  
  
  const handlenewUserNameChange = (event) => {
  setnewUserName(event.target.value);
  };
  
      const [open, setOpen] = useState(false);
    
      const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
        setOpen(false);
      };
    
      const handleCreateProject = () => {
        // Create the project using the newUserName and newProjectDescription state variables
        const newProject = {
          name: newUserName,
          description: newProjectDescription,
          team: [],
          sprints: [],
          userStories: []
        };
        socket.emit("createProject", newProject);
        setnewUserName("");
        setNewProjectDescription("");
        handleClose();
      };
    

      const toggleCardVisibility = () => {
        setShowCard(!showCard);
      };
    

      const handleTitleChange = (event) => {
        const updatedTitle = event.target.value;
        setProjectTitle(updatedTitle);
        handleProjectUpdate(updatedTitle, tableRows, tableColumns, concerns);
      };
      
      const handleConcernsChange = (event) => {
        const updatedConcerns = event.target.value;
        setConcerns(updatedConcerns);
        handleProjectUpdate(projectTitle, tableRows, tableColumns, updatedConcerns);
      };
      
    
      const handleRowChange = (event) => {
        const updatedRows = parseInt(event.target.value);
        setTableRows(updatedRows);
        handleProjectUpdate(projectTitle, updatedRows, tableColumns, concerns);
      };
      
      const handleColumnChange = (event) => {
        const updatedColumns = parseInt(event.target.value);
        setTableColumns(updatedColumns);
        handleProjectUpdate(projectTitle, tableRows, updatedColumns, concerns);
      };

      const downloadAsPDF = () => {
        const table = document.getElementById("table-to-export");
        const tempTable = table.cloneNode(true);
        const inputs = tempTable.getElementsByTagName("input");
        for (let input of inputs) {
          const value = input.value;
          const parentCell = input.parentElement;
          parentCell.textContent = value;
          input.remove();
        }
        const doc = new jsPDF();
      
        // Add student name(s) and project title to the PDF
        doc.setFontSize(16);
        doc.text("Student Name(s): " + newUserName, 10, 20);
        doc.text("Project Title: " + projectTitle, 10, 30);
      
        // Use the temporary table for the PDF export
        doc.autoTable({
          html: tempTable,
          startY: 40,
          theme: 'grid',
          alternateRowColor: { r: 240, g: 240, b: 240 }
        });
        doc.save("table.pdf");
      };
      
    
      
      const exportToXLSX = (filename, table) => {
        const wb = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
        XLSX.writeFile(wb, `${filename}.xlsx`);
      };
      
      const exportToHTML = (filename, table) => {
        const tableHTML = table.outerHTML;
        const fileContent = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${filename}</title>
      </head>
      <body>
        ${tableHTML}
      </body>
      </html>`;
        const blob = new Blob([fileContent], { type: "text/html;charset=utf-8" });
        saveAs(blob, `${filename}.html`);
      };
      
      const createExportTable = (concerns) => {
        const table = document.getElementById("table-to-export").cloneNode(true);
        const inputs = table.getElementsByTagName("input");
      
        for (let input of inputs) {
          const value = input.value;
          const parentCell = input.parentElement;
          parentCell.textContent = value;
          input.remove();
        }
      
        const newRow = table.insertRow(-1);
        const newCell = newRow.insertCell(0);
        newCell.colSpan = table.rows[0].cells.length;
        newCell.innerHTML = `Concerns: ${concerns}`;
      
        return table;
      };
      
      // ... other code
      
      const downloadFiles = () => {
        const table = createExportTable(concerns);
        const filename = `${projectTitle}_table`;
      
        downloadAsPDF(filename, table);
        exportToXLSX(filename, table);
        exportToHTML(filename, table);
      };
      
      
    

      const generateTable = () => {
        const rows = [];

        for (let i = 0; i < tableRows; i++) {
          const cells = [];

          for (let j = 0; j < tableColumns; j++) {
            cells.push(
              <TableCell key={j}>
                <TextField
                  id={`cell-${i}-${j}`}
                  defaultValue={`Cell ${i + 1}-${j + 1}`}
                />
              </TableCell>
            );
          }

          rows.push(<TableRow key={i}>{cells}</TableRow>);
        }

        const columnTitles = [
          "User Stories",
          "Priority",
          "Team Members",
          "Actual Hours",
          "Estimated hours to complete"
        ];

        return (
          <div>
            <Table id="table-to-export">
              <TableHead>
                <TableRow>
                  {Array.from({ length: tableColumns }).map((_, index) => (
                    <TableCell key={index}>
                      <TextField
                        id={`column-title-${index}`}
                        defaultValue={columnTitles[index] || `Column ${index + 1}`}
                      />
                    </TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={handleProjectUpdate}>Update</Button>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </div>
        );
      };

      

      return (
        <Card>
          <CardHeader
            title="Project Manager"
            avatar={<PeopleOutline />}
            action={
              <>
                <IconButton onClick={handleOpen}>
                  <Add />
                </IconButton>
                <Dialog open={open} onClose={handleClose}>
                  <DialogTitle>Users</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Enter your name
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Name"
                      type="text"
                      fullWidth
                      value={newUserName}
                      onChange={handlenewUserNameChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleCreateProject}>Create</Button>
                  </DialogActions>
                </Dialog>

              </>
            }
          />
          <List>
            {projects.map((project) => (
              <ListItem
  key={project.id}
  button
  selected={selectedProject && selectedProject.id === project.id}
  onClick={() => {
    setSelectedProject(project);
    handleProjectUpdate();
  }}
>
  <ListItemText primary={project.name} />
</ListItem>
            ))}
            <div>
              <Button variant="contained" color="primary" onClick={toggleCardVisibility}>
                Create a new project
              </Button>
              {showCard && (
                <Card>
                  <CardContent>
                    <Typography variant="h5">
                      <TextField
                        label="Project Title"
                        value={projectTitle}
                        onChange={handleTitleChange}
                      />
                    </Typography>
                    <TextField
                      label="Rows"
                      type="number"
                      value={tableRows}
                      onChange={handleRowChange}
                      inputProps={{ min: 1 }}
                    />
                    <TextField
                      label="Columns"
                      type="number"
                      value={tableColumns}
                      onChange={handleColumnChange}
                      inputProps={{ min: 1 }}
                    />
                    {generateTable()}
                    <TextField
                      label="Enter concerns"
                      value={concerns}
                      onChange={handleConcernsChange}
                      style={{ marginTop: "1rem", width: "100%" }}
                    />
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={downloadFiles}
                      style={{ marginTop: "1rem" }}
                    >
                      Download Files
                    </Button>
                    <div style={{ marginTop: "1rem" }}>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </List>
        </Card>
      );
};
      export default Assignment;
      








