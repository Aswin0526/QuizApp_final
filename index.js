const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const dotenv = require("dotenv")

dotenv.config();

const MONGO_CONN = process.env.MONGO_CONN
exports.MONGO_CONN = MONGO_CONN

console.log(MONGO_CONN)
const app = express();
app.use(express.json());
app.use('/', express.static(path.join(process.cwd(), './')));
app.use(cors());
mongoose.set("strictQuery", false);
mongoose.connect(MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "QuizAppUsers" })
  .then(() => console.log("Connection to QuizAppUsers Done!"))
  .catch(err => console.log(err));


const quizSchema = new mongoose.Schema({
  quizId: Number,
  title: String,
  questions: [
    {
      question: String,
      options: [String],
      answer: String
    }
  ]
});

app.get('/quiz/:id', async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const quiz = await Quiz.findOne({ quizId });
    if (!quiz) {
      return res.status(404).send('Quiz not found');
    }
    res.json(quiz);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

const Quiz = mongoose.model('Quiz', quizSchema);

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

const userModel = mongoose.model("userdetail", userSchema);

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
});

const contactModel = mongoose.model("Contactform", contactSchema);

app.post('/contact-form',(req,res)=>{
  const contactform = req.body;
  contactModel.create(contactform).then(()=>console.log('Data Registered!')).catch(err => console.log(err))
})

app.get("/api/check-email", (req, res) => {
  const email = req.params.email;

  userModel.findOne({ email: email })
    .then(user => {
      if (user) {
        res.status(200).json({ exists: true });
      } else {
        res.status(200).json({ exists: false });
      }
    })
    .catch(err => res.status(500).json({ error: err.message }));
});


app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  console.log(email,password)

  userModel.findOne({ email: email })
    .then(user => {
      console.log(user)
      if (!user) {
        res.status(401).json({ success: false, message: "Invalid email or password." });
        return;
      }

      // Compare the provided password with the hashed password stored in the database
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          res.status(500).json({ success: false, message: "Error comparing passwords." });
          return;
        }

        console.log(user.password)

        if (isMatch) {
          res.status(200).json({ success: true });
        } else {
          res.status(401).json({ success: false, message: "Invalid email or password." });
        }
      });
    })
    .catch(err => res.status(500).json({ success: false, message: err.message }));
});

app.post("/create-user", (req, res) => {
  const userData = req.body;

  // Hash password
  bcrypt.hash(userData.password, 10, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    userData.password = hashedPassword;

    userModel.create(userData)
      .then(() => {
        console.log("Data Registered");
        res.status(201).json({ message: "User created successfully" });
      })
      .catch(err => res.status(500).json({ error: err.message }));
  });
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});


app.listen(8900, () => {
  console.log('Server is listening on port 5000');
});
