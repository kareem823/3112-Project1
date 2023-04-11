import { useEffect, useRef } from "react";
import { ListItem } from "@mui/material";
import Bubble from "./bubble";
import Triangle from "./triangle";
const UserMessage = (props) => {
 const userRef = useRef(null);

 useEffect(() => {
 userRef.current.scrollIntoView(true);
 }, []);


 return (
 <div>
 <ListItem
 ref={userRef}
 style={{
          textAlign: "left",
          marginBottom: "2vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
 >
            <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
 <Bubble user={props.user} color="rgba(65, 117, 5, 1)" />
 <Triangle color={"rgba(65, 117, 5, 1)"} />
 </div>

 </ListItem>
 <p></p>
 </div>
 );
};
export default UserMessage;
