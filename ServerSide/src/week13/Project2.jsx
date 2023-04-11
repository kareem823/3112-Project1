//Kareem Idris, S#: 0881393
/*
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
//import CardContent from '@material-ui/core/CardContent';
//////////////
import { List, ListItem, ListItemText, Box } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import "../App.css";
/////////////
import ChatLogo from "../week13/ChatLogo.jpg";
import theme from "./theme.js";
import ChatMsg from "./chatmsg.jsx";

const Project2 = () => {
  const [state, setState] = useState({
    socket: null,
    chatName: "",
    roomName: "",
    status: "",
    messages: [],
    showJoinFields: true,
    showMessages: false,
    isTyping: false,
    typingMsg: "",
    typingUsers: [], 
    message: [],
    signInCompleted: false,
    showRoomsDialog: false,
    users: [],
    rooms: [],
  });

  const [error, setError] = useState(false);//lab19 error state
  const [openDialog, setOpenDialog] = useState(false);
  const [existingRooms, setExistingRooms] = useState([]);
  const [roomUsers, setRoomUsers] = useState({});

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setState((prevState) => ({ ...prevState, socket }));

    /*socket.on("getrooms", (rooms) => {
      setExistingRooms(rooms.filter(room => room !== state.roomName));
    });*/
/*
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (state.socket) {
      state.socket.on("nameexists", onExists);
      state.socket.on("welcome", addMessageToList);
      state.socket.on("someonejoined", addMessageToList);
      state.socket.on("someoneleft", addMessageToList); 
      state.socket.on("someoneistyping", onTyping);
      state.socket.on("stopped_typing", onStoppedTyping); 
      state.socket.on("newmessage", onNewMessage);
      state.socket.on("roomsandusers", onRoomsAndUsers);

      return () => {
        state.socket.off("nameexists", onExists);
        state.socket.off("welcome", addMessageToList);
        state.socket.off("someonejoined", addMessageToList);
        state.socket.off("someoneleft", addMessageToList); 
        state.socket.off("someoneistyping", onTyping);
        state.socket.off("stopped_typing", onStoppedTyping); 
        //state.socket.off("newmessage", onNewMessage);
        state.socket.off("roomsandusers", onRoomsAndUsers);

      };
    }
  }, [state.socket]);
  
  useEffect(() => {
    fetch('/api/getrooms')
      .then(res => res.json())
      .then(data => setExistingRooms(data.rooms.filter(room => room !== "main")))
      .catch(err => console.log(err));
  }, []);

  const onTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState((prevState) => ({
        ...prevState,
        typingUsers: [...prevState.typingUsers.filter((user) => user !== msg.from), msg.from],
      }));
    }
  };

  // keypress handler for message TextField

  const onMessageChange = (e) => {
    setState(prevState => ({ ...prevState, message: e.target.value }));

    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState(prevState => ({ ...prevState, isTyping: true })); // flag first byte only
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          typingUsers: prevState.typingUsers.filter((user) => user !== state.chatName),
        }));
        state.socket.emit("stopped_typing", { from: state.chatName }, (err) => {});
      }, 2000);
    }
};


  const onExists = (msg) => {
    setState({ ...state, status: msg });
    setError(true);
  };

 /* v1
const addMessageToList = (msg) => {
  setState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, msg],
    showJoinFields: false,
    showMessages: true,
  }));
};
*/
/*
const addMessageToList = (msg) => {
  setState((prevState) => ({
    ...prevState,
    message: '',
    showJoinFields: false,
    showMessages: true,
  }));
  setState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, msg],
  }));
  
};

const onNameChange = (e) => {
  setState({ ...state, chatName: e.target.value, status: "" });
};

const onRoomChange = (e) => {
  setState({ ...state, roomName: e.target.value });
};

const handleJoin = () => {
  if (state.chatName !== "" && state.roomName !== "") {
    state.socket.emit("join", {
      name: state.chatName,
      room: state.roomName,
    });

    setState((prevState) => ({
      ...prevState,
      showJoinFields: false,
      showMessages: true,
    }));
  }
};



  // Add a new function to handle stopped_typing event
  const onStoppedTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState((prevState) => ({
        ...prevState,
        typingUsers: prevState.typingUsers.filter((user) => user !== msg.from),
      }));
    }
  };

    const onNewMessage = (msg) => {
      addMessageToList(msg);
      setState((prevState) => ({
      ...prevState,
      typingMsg: "",
      isTyping: false,
      }));
      };
      
 
    const handleSendMessage = () => {
      if (state.message !== "") {
      state.socket.emit(
      "message",
      { from: state.chatName, text: state.message },
      (err) => {}
      );
      setState((prevState) => ({
      ...prevState,
      isTyping: false,
      message: "",
      }));
      }
      };

      const handleRoomSelection = (event) => {
        setState({ ...state, roomName: event.target.value });
      };
      
      /////////////////////////////////////////////////////////////////////////
      /*const handleOpenDialog = () => {
        setOpenDialog(true);
        };
        
        const handleCloseDialog = () => {
        setOpenDialog(false);
        };*/
        /*
        const renderDialog = () => {
          const roomsAndUsers = roomUsers;
        }

        const handleOpenDialog = () => {
          setState((prevState) => ({
            ...prevState,
            showDialog: true,
          }));
          state.socket.emit("roomsandusers");
        };

        const handleCloseDialog = () => {
          // Set the "showDialog" state variable to false
          setState((prevState) => ({
            ...prevState,
            showDialog: false,
          }));
        };

        const onRoomsAndUsers = (data) => {
          // Set the "roomUsers" state variable to the data received from the server
          setRoomUsers(data.users.reduce((acc, user) => {
            const { room, name } = user;
            if (!acc[room]) {
              acc[room] = [];
            }
            acc[room].push(name);
            return acc;
          }, {}));
        };

    return (
      <ThemeProvider theme={theme}>
        <AppBar position="static">
  <Toolbar>

    <Typography variant="h6" style={{ margintop:"6%", flexGrow: 1, color: theme.palette.primary.main, border: "inset", textAlign: "center" }}>
      <FormHelperText style={{ textAlign: "center", fontSize: "xx-large", color: theme.palette.secondary.contrastText}}> Chat App! - Info3139</FormHelperText>
    </Typography>
    {state.showMessages && (
      <IconButton edge="end" color="inherit" onClick={handleOpenDialog}>
  <PeopleOutline />
  
  <Dialog open={state.showDialog} onClose={handleCloseDialog}>
  <DialogTitle>Who's on</DialogTitle>
  <DialogContent>
    {Object.keys(roomUsers).map((room) => (
      <Box key={room}>
        <Typography variant="rooms">{room}</Typography>
        <List>
          {roomUsers[room].map((user) => (
            <ListItem key={user}>
              <ListItemText primary={user} />
              <PeopleOutline></PeopleOutline>  
                        </ListItem>
          ))}
        </List>
      </Box>
    ))} 
</DialogContent>
<DialogActions>
<Button onClick={handleCloseDialog}>Close</Button>
</DialogActions>

</Dialog>
</IconButton>
)}

  </Toolbar>
</AppBar>
{!state.showMessages && <img src={ChatLogo} alt="Chat Logo" style ={{  marginTop:"8%", maxWidth: 200, display: "block",  margin: "auto",}} />}
        
      <Card
        style={{ marginTop: "2%", marginBottom: "2%", textAlign: "center" }}
      >
        
        {state.showJoinFields && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <TextField
              label="Enter unique name"
              onChange={onNameChange}
              placeholder="Enter your name"
              required
              error={error} // Add error prop to TextField
              style={{
                borderColor: error ? "red" : "",
              }}
            />
            {error && (
              <FormHelperText style={{ color: "red" }}>
                This name is already taken, please choose another one.
              </FormHelperText>
            )}
              

              <FormControl component="fieldset">
  <FormLabel component="legend">Room Selection</FormLabel>
  <RadioGroup
    row
    value={state.roomName}
    onChange={handleRoomSelection}
  >
    <FormControlLabel
      value="main"
      control={<Radio />}
      label="Main Room"
    />
      <FormControlLabel
        key={state.roomName}
        value={state.roomName}
        control={<Radio />}
        label={state.roomName}
      />

    { state.rooms.map(roomName => (
      <FormControlLabel
        key={state.roomName}
        value={state.roomName}
        control={<Radio />}
        label={state.roomName}
      />
    ))}
  </RadioGroup>
</FormControl>

            <TextField
            
              label="Enter room name"
              onChange={onRoomChange}
              placeholder="Enter room name"
              required
            />

            <Button
              onClick={handleJoin}
              variant="contained"
              color="primary"
              disabled={!state.chatName || !state.roomName}
            >
              Join
            </Button>
          </div>
        )}
      <div className="scenario-container">
      {state.messages.map((message, index) => (
      <ChatMsg msg={message} key={index} />
      ))}
      </div>
      {!state.showJoinFields && (

      <TextField
      onChange={onMessageChange}
      placeholder="type something here"
      autoFocus={true}
      value={state.message}
      onKeyPress={(e) => {
      if (e.key === "Enter") {
      handleSendMessage();
      e.target.blur();
      }
      }}
      />
      )}
      <div>
      <Typography color="primary">
      {state.typingUsers.map((user) => `${user} is typing...`).join(", ")}
      </Typography>
      </div>
      </Card>
      </ThemeProvider>
      );

  };
    
  export default Project2;

*/






/*
  const useStyles = makeStyles((theme) => ({
    appBar: {
      marginBottom: theme.spacing(4),
    },
    logo: {
      maxWidth: 200,
      display: "block",
      margin: "auto",
    },
    joinCard: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "10px",
    },
  }));
*/

/*
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
//import CardContent from '@material-ui/core/CardContent';
//////////////
import { List, ListItem, ListItemText, Box } from "@mui/material";
import { PeopleOutline } from "@mui/icons-material";
import "../App.css";
/////////////
import ChatLogo from "../week13/ChatLogo.jpg";
import theme from "./theme.js";
import ChatMsg from "./chatmsg.jsx";

const Project2 = () => {
  const [state, setState] = useState({
    socket: null,
    chatName: "",
    roomName: "",
    status: "",
    messages: [],
    showJoinFields: true,
    showMessages: false,
    isTyping: false,
    typingMsg: "",
    typingUsers: [], 
    message: [],
  });

  const [error, setError] = useState(false);//lab19 error state

  useEffect(() => {
    const socket = io("http://localhost:5000");
    setState((prevState) => ({ ...prevState, socket }));

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (state.socket) {
      state.socket.on("nameexists", onExists);
      state.socket.on("welcome", addMessageToList);
      state.socket.on("someonejoined", addMessageToList);
      state.socket.on("someoneleft", addMessageToList); 
      state.socket.on("someoneistyping", onTyping);
      state.socket.on("stopped_typing", onStoppedTyping); 
      state.socket.on("newmessage", onNewMessage);

      return () => {
        state.socket.off("nameexists", onExists);
        state.socket.off("welcome", addMessageToList);
        state.socket.off("someonejoined", addMessageToList);
        state.socket.off("someoneleft", addMessageToList); 
        state.socket.off("someoneistyping", onTyping);
        state.socket.off("stopped_typing", onStoppedTyping); 

      };
    }
  }, [state.socket]);

  const onTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState((prevState) => ({
        ...prevState,
        typingUsers: [...prevState.typingUsers.filter((user) => user !== msg.from), msg.from],
      }));
    }
  };

  // keypress handler for message TextField

  const onMessageChange = (e) => {
    setState(prevState => ({ ...prevState, message: e.target.value }));

    if (state.isTyping === false) {
      state.socket.emit("typing", { from: state.chatName }, (err) => {});
      setState(prevState => ({ ...prevState, isTyping: true })); // flag first byte only
      setTimeout(() => {
        setState((prevState) => ({
          ...prevState,
          typingUsers: prevState.typingUsers.filter((user) => user !== state.chatName),
        }));
        state.socket.emit("stopped_typing", { from: state.chatName }, (err) => {});
      }, 2000);
    }
};


  const onExists = (msg) => {
    setState({ ...state, status: msg });
    setError(true);
  };

  
const addMessageToList = (msg) => {
  setState((prevState) => ({
    ...prevState,
    messages: [...prevState.messages, msg],
    showJoinFields: false,
    showMessages: true,
  }));
};


const onNameChange = (e) => {
  setState({ ...state, chatName: e.target.value, status: "" });
};

const onRoomChange = (e) => {
  setState({ ...state, roomName: e.target.value });
};

const handleJoin = () => {
  state.socket.emit("join", {
    name: state.chatName,
    room: state.roomName,
  });
};

  // Add a new function to handle stopped_typing event
  const onStoppedTyping = (msg) => {
    if (msg.from !== state.chatName) {
      setState((prevState) => ({
        ...prevState,
        typingUsers: prevState.typingUsers.filter((user) => user !== msg.from),
      }));
    }
  };

    const onNewMessage = (msg) => {
      addMessageToList(msg);
      setState((prevState) => ({
      ...prevState,
      typingMsg: "",
      isTyping: false,
      }));
      };
      

    const handleSendMessage = () => {
      if (state.message !== "") {
      state.socket.emit(
      "message",
      { from: state.chatName, text: state.message },
      (err) => {}
      );
      setState((prevState) => ({
      ...prevState,
      isTyping: false,
      message: "",
      }));
      }
      };
      
            

    return (
      <ThemeProvider theme={theme}>
              <AppBar position="static">
  <Toolbar>

    <Typography variant="h6" style={{ margintop:"6%", flexGrow: 1, color: theme.palette.primary.main, border: "inset", textAlign: "center" }}>
      <FormHelperText style={{ textAlign: "center", fontSize: "xx-large", color: theme.palette.secondary.contrastText}}> Chat App! - Info3139</FormHelperText>
    </Typography>
    {state.showMessages && (
      <IconButton edge="end" color="inherit" onClick={handleOpenDialog}>
  <PeopleOutline />
  
  <Dialog open={state.showDialog} onClose={handleCloseDialog}>
  <DialogTitle>Who's on</DialogTitle>
  <DialogContent>
    {Object.keys(roomUsers).map((room) => (
      <Box key={room}>
        <Typography variant="rooms">{room}</Typography>
        <List>
          {roomUsers[room].map((user) => (
            <ListItem key={user}>
              <ListItemText primary={user} />
              <PersonIcon />
            </ListItem>
          ))}
        </List>
      </Box>
    ))} 
</DialogContent>
<DialogActions>
<Button onClick={handleCloseDialog}>Close</Button>
</DialogActions>

</Dialog>
</IconButton>
)}

  </Toolbar>
</AppBar>
      
      <Card
        style={{ marginTop: "2%", marginBottom: "2%", textAlign: "center" }}
      >
        <CardHeader         style={{ color: theme.palette.secondary.main, border: "inset", textAlign: "center" }}
 title="Info3139 - Socket IO" />
        {!state.showMessages && <img src={ChatLogo} alt="Chat Logo" style ={{  marginTop:"6%", maxWidth: 200, display: "block",  margin: "auto",}} />}

        {state.showJoinFields && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <TextField
              label="Enter unique name"
              onChange={onNameChange}
              placeholder="Enter your name"
              required
              error={error} // Add error prop to TextField
              style={{
                borderColor: error ? "red" : "",
              }}
            />
            {error && (
              <FormHelperText style={{ color: "red" }}>
                This name is already taken, please choose another one.
              </FormHelperText>
            )}
            <TextField
              label="Enter room name"
              onChange={onRoomChange}
              placeholder="Enter room name"
              required
            />
            <Button
              onClick={handleJoin}
              variant="contained"
              color="primary"
            >
              Join
            </Button>
          </div>
        )}
      <div className="scenario-container">
      Messages
      {state.messages.map((message, index) => (
      <ChatMsg msg={message} key={index} />
      ))}
      </div>
      {!state.showJoinFields && (
      <TextField
      onChange={onMessageChange}
      placeholder="type something here"
      autoFocus={true}
      value={state.message}
      onKeyPress={(e) => {
      if (e.key === "Enter") {
      handleSendMessage();
      e.target.blur();
      }
      }}
      />
      )}
      <div>
      <Typography color="primary">
      {state.typingUsers.map((user) => `${user} is typing...`).join(", ")}
      </Typography>
      </div>
      </Card>
      </ThemeProvider>
      );

  };
    
  export default Project2;
*/
