const mongoose = require('mongoose');
const { MONGO_CONN } = require('.');

// Connect to MongoDB
mongoose.connect(MONGO_CONN, { useNewUrlParser: true, useUnifiedTopology: true });

// Define Quiz Schema and Model
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

const Quiz = mongoose.model('Quiz', quizSchema);

// Sample Data: 10 General Knowledge Questions
const quizzes = [
  {
    quizId: 4,
    title: "Geography Quiz",
    questions: [
      {
        "question": "What is the largest desert in the world?",
        "options": ["Sahara", "Gobi", "Kalahari", "Antarctic Desert"],
        "answer": "Antarctic Desert"
      },
      {
        "question": "Which river is the longest in the world?",
        "options": ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
        "answer": "Nile River"
      },
      {
        "question": "Which country has the most islands?",
        "options": ["Sweden", "Canada", "Australia", "Norway"],
        "answer": "Sweden"
      },
      {
        "question": "What is the capital city of Australia?",
        "options": ["Sydney", "Melbourne", "Canberra", "Brisbane"],
        "answer": "Canberra"
      },
      {
        "question": "Which continent is known as the 'Dark Continent'?",
        "options": ["Africa", "Asia", "South America", "Australia"],
        "answer": "Africa"
      },
      {
        "question": "What is the smallest continent by land area?",
        "options": ["Europe", "Australia", "Antarctica", "South America"],
        "answer": "Australia"
      },
      {
        "question": "Which mountain range separates Europe from Asia?",
        "options": ["Rocky Mountains", "Andes", "Himalayas", "Ural Mountains"],
        "answer": "Ural Mountains"
      },
      {
        "question": "Which ocean is the largest by surface area?",
        "options": ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        "answer": "Pacific Ocean"
      },
      {
        "question": "Which city is known as the 'City of Canals'?",
        "options": ["Venice", "Amsterdam", "Bangkok", "London"],
        "answer": "Venice"
      },
      {
        "question": "Which country is both in Europe and Asia?",
        "options": ["Turkey", "Russia", "Egypt", "Cyprus"],
        "answer": "Turkey"
      }
    ]
  }
];

// Insert Sample Data
Quiz.insertMany(quizzes)
  .then(() => {
    console.log('Data inserted successfully');
    mongoose.connection.close();
  })
  .catch(err => {
    console.error('Error inserting data:', err);
    mongoose.connection.close();
  });
