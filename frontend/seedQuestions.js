// seedQuestions.js

// seedQuestions.js
import { collection, addDoc } from 'firebase/firestore';
import { db } from './src/firebase.js';  // relative path mein .js extension zaruri hai

const questions = [
  {
    category: "React",
    question: "Which hook is used to manage state in functional components?",
    options: ["useEffect", "useState", "useContext", "useReducer"],
    correctOption: 1
  },
  {
    category: "JavaScript",
    question: "Which of the following is NOT a JavaScript data type?",
    options: ["Number", "Boolean", "Character", "Undefined"],
    correctOption: 2
  },
  {
    category: "JavaScript",
    question: "What will be the output of `typeof NaN`?",
    options: ["number", "NaN", "undefined", "object"],
    correctOption: 0
  },
  {
    category: "DSA",
    question: "What data structure uses FIFO (First In First Out)?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    correctOption: 1
  },
  {
    category: "DSA",
    question: "What is the time complexity of binary search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctOption: 1
  },
  {
    category: "React",
    question: "What hook is used to perform side effects in functional components?",
    options: ["useEffect", "useState", "useMemo", "useRef"],
    correctOption: 0
  },
  {
    category: "React",
    question: "What is JSX?",
    options: [
      "A JavaScript syntax extension",
      "A CSS framework",
      "A database query language",
      "A version control system"
    ],
    correctOption: 0
  },
  {
    category: "JavaScript",
    question: "Which method is used to add elements at the end of an array?",
    options: ["push()", "pop()", "shift()", "unshift()"],
    correctOption: 0
  },
  {
    category: "JavaScript",
    question: "What does '===' operator mean in JavaScript?",
    options: [
      "Equal in value and type",
      "Equal in value only",
      "Assignment operator",
      "Not equal operator"
    ],
    correctOption: 0
  },
  {
    category: "DSA",
    question: "Which traversal method is used in a binary search tree to get sorted data?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctOption: 1
  },
  {
    category: "DSA",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n^2)", "O(n log n)", "O(n)", "O(log n)"],
    correctOption: 0
  },
  {
    category: "DSA",
    question: "Which data structure uses LIFO (Last In First Out)?",
    options: ["Queue", "Stack", "Heap", "Graph"],
    correctOption: 1
  },
  {
    category: "JavaScript",
    question: "Which keyword declares a block scoped variable?",
    options: ["var", "let", "const", "both let and const"],
    correctOption: 3
  },
  {
    category: "React",
    question: "Which of these is NOT a lifecycle method in React class components?",
    options: ["componentDidMount", "componentWillUnmount", "componentDidUpdate", "useEffect"],
    correctOption: 3
  },
  {
    category: "React",
    question: "How do you pass data from parent to child component?",
    options: ["props", "state", "context", "redux"],
    correctOption: 0
  },
  {
    category: "JavaScript",
    question: "What will `console.log(0.1 + 0.2 === 0.3)` output?",
    options: ["true", "false", "undefined", "error"],
    correctOption: 1
  },
  {
    category: "JavaScript",
    question: "Which method converts a JSON string into a JavaScript object?",
    options: ["JSON.parse()", "JSON.stringify()", "JSON.toObject()", "JSON.convert()"],
    correctOption: 0
  },
  {
    category: "DSA",
    question: "What data structure is used in breadth-first search (BFS)?",
    options: ["Stack", "Queue", "Heap", "Tree"],
    correctOption: 1
  },
  {
    category: "DSA",
    question: "What is the space complexity of Merge Sort?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctOption: 1
  },
  {
    category: "DSA",
    question: "Which sorting algorithm is known as the fastest average sorting algorithm?",
    options: ["Bubble Sort", "Insertion Sort", "QuickSort", "Selection Sort"],
    correctOption: 2
  },
  {
    category: "JavaScript",
    question: "Which of the following is a way to create a new object in JavaScript?",
    options: ["Object.create()", "new Object()", "{} literal", "All of the above"],
    correctOption: 3
  }
];

async function addQuestions() {
  for (const q of questions) {
    try {
      await addDoc(collection(db, "mcqs"), q);
      console.log("Added question:", q.question);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  }
  console.log("All questions added successfully!");
}

addQuestions();
