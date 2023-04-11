//Kareem Idris, S#: 0881393
//probably wont need this
//socketHandlers.JS
import { port } from "./config.js";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import moment from 'moment';
import fs from "fs"

const fsp = fs.promises;
const users = new Map();
let matColours = [];


export const handleJoin = async (socket, clientData) => {
  const { name, room } = clientData;
  const existingUser = [...users.values()].some((user) => user.name === name);

  if (existingUser) {
    socket.emit("nameexists", "This name is already taken, please choose another one.");
  } else {
    users.set(socket.id, { name, room });
    socket.join(room);

    const timestamp = moment().format("h:mm a");
    const color = await getRandomColor();

    socket.emit("welcome", {
      from: "Admin",
      text: `Welcome ${name} to room ${room}`,
      timestamp,
      color,
    });

    socket.to(room).emit("someonejoined", {
      from: "Admin",
      text: `${name} has joined the room ${room}`,
      timestamp,
      color,
    });
  }
};

export const handleLeave = async (socket, io) => {
  const user = users.get(socket.id);

  if (user) {
    const { name, room } = user;
    users.delete(socket.id);

    const timestamp = moment().format("h:mm a");
    const color = await getRandomColor();
    io.to(room).emit("someoneleft", {
      from: "Admin",
      text: `${name} has left the room ${room}`,
      timestamp,
      color,
    });
  }
};

export const handleTyping = (socket, clientData) => {
  const user = users.get(socket.id);
  if (user) {
    const { room } = user;
    socket.to(room).emit("someoneistyping", {
      from: user.name,
      text: `${user.name} is typing...`,
    });
  }
};

/*
const getRandomColor = () => {
  const colorIndex = Math.floor(Math.random() * matColours.length);
  return matColours[colorIndex];
};*/

const getRandomColor = async () => {
  let rawData = await fsp.readFile("./matdes100colours.json"); // returns promise
  matColours = JSON.parse(rawData);
  const colorIndex = Math.floor(Math.random() * matColours.length);
  return matColours[colorIndex];
};


export const handleMessage = async (io, socket, clientData) => {
  const user = users.get(socket.id);
  if (user) {
    const { room } = user;
    const timestamp = moment().format("h:mm a");
    const color = await getRandomColor();
    const message = {
      from: user.name,
      text: clientData.text,
      timestamp,
      color,
    };
    io.in(room).emit("newmessage", message);
  }
};

export const handleGetRoomsAndUsers = (io) => {
  const rooms = Array.from(new Set([...users.values()].map((user) => user.room)));
  io.emit("roomsandusers", { rooms, users: [...users.values()] });
};

