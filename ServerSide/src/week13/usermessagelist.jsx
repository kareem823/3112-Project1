import { List } from "@mui/material";
import UserMessage from "./usermessage";

const UserMessageList = (props) => {
  let users = props.users.map((user, idx) => {
    return <UserMessage key={idx} user={user} />;
  });

  return <List>{users}</List>;
};

export default UserMessageList;
