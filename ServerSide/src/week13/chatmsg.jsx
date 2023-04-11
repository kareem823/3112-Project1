// chatmsg.jsx

import React from "react";
import "../App";

const ChatMsg = (props) => {
  return (
    <div
      className="scenario-message"
      style={{ backgroundColor: props.msg.color }}
    >
        {props.msg.from}: {props.msg.text} ({props.msg.timestamp})
    </div>
  );
};

export default ChatMsg;

