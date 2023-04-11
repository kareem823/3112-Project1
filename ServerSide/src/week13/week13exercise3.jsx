import { useState, useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import {
  AppBar,
  Card,
  CardHeader,
  CardContent,
  Toolbar,
  Typography,
} from "@mui/material";
import theme from "./theme";
import "../App"; //"./App.css";
import UserMessageList from "./usermessagelist";
import userjson from "./users.json";

const Week13Exercise3 = () => {
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState([]);

  useEffect(() => {
    setUsers(userjson);
    setMsg(`${userjson.length} users loaded`);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar color="primary">
          <Typography variant="h6" color="inherit">
            Case 2 - Exercises
          </Typography>
        </Toolbar>
      </AppBar>
      <Card className="card">
        <div
          style={{
            marginTop: 50,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "sticky",
            top: 0,
            zIndex: 100,
            backgroundColor: "white",
          }}
        >
          <CardHeader
            title="Exercise #3"
            color="inherit"
            style={{ textAlign: "center" }}
          />
          <Typography
            color="error"
            style={{ marginBottom: "3vh", textAlign: "center" }}
          >
            {msg}
          </Typography>
        </div>
        {users ? (
          <div className="usersList">
            <UserMessageList users={users} />
          </div>
        ) : null}
      </Card>
    </ThemeProvider>
  );
};

export default Week13Exercise3;
