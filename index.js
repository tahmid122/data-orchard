const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const cors = require("cors");
const PORT = 3999;
const mongoose = require("mongoose");

//db connection
mongoose
  .connect(
    "mongodb+srv://tahmidAlam:tahmid824643@cluster0.1osvjkq.mongodb.net/usersDB"
  )
  .then(() => console.log("DB is connected"))
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

// schema

const usersSchema = new mongoose.Schema({
  id: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  profileImage: {
    type: String,
    require: true,
  },
  facebookLink: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    require: true,
  },
  bank: {
    type: Object,
    require: true,
  },
  task: {
    type: Array,
    require: true,
  },
  cv: {
    type: String,
    require: true,
  },
  about: {
    type: String,
    require: true,
  },
});

const Users = new mongoose.model("users", usersSchema);
//default setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).send("home route");
});

// Request and response for Users
app.get("/register", async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.post("/register", async (req, res) => {
  try {
    const newUser = await new Users({
      id: uuidv4(),
      email: req.body.email,
      password: req.body.password,
      name: req.body.name,
      userName: req.body.userName,
      profileImage: req.body.profileImage,
      facebookLink: req.body.facebookLink,
      phone: req.body.phone,
      bank: req.body.bank,
      task: req.body.task,
      cv: req.body.cv,
      about: req.body.about,
    });
    const user = await newUser.save();
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const password = req.body.password;
    const findUser = await Users.findOne({ email: req.body.email });
    if (findUser.password == password) {
      res.status(202).send(findUser);
    } else {
      res.status(202).send({ message: "Invalid info" });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});
//task

app.put("/task", async (req, res) => {
  try {
    const email = req.body.email;
    const projectName = req.body.projectName;
    const date = req.body.date;
    const completedTask = req.body.completedTask;
    const updateUser = await Users.findOneAndUpdate(
      { email: email },
      { $push: { task: { projectName, date, completedTask } } }
    );
    res.status(200).send(updateUser);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// invalid route
app.use((req, res, next) => {
  res.status(404).send({ messgae: "404 not found" });
});
// invalid server route
app.use((error, req, res, next) => {
  res.status(404).send({ messgae: "404 not found" });
});
app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
