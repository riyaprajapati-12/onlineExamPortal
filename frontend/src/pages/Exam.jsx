import { useEffect, useState, useRef } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiCheckCircle, FiXCircle, FiAward } from "react-icons/fi";

function Exam() {
  const [categories] = useState(["React", "JavaScript", "DSA"]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [user, setUser] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);
  const [isLoading, setIsLoading] = useState(false);

  const answersRef = useRef(answers);
  const questionsRef = useRef(questions);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let timer;
    if (selectedCategory && !submitted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmit(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedCategory, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const fetchQuestions = async (category) => {
    setIsLoading(true);
    try {
      const q = query(collection(db, "mcqs"), where("category", "==", category));
      const snapshot = await getDocs(q);
      const fetchedQuestions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setQuestions(fetchedQuestions);
      setAnswers({});
      setScore(0);
      setSubmitted(false);
      setTimeLeft(600);
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionClick = (qIndex, optIndex) => {
    if (submitted) return;
    setAnswers({ ...answers, [qIndex]: optIndex });
  };

  const handleSubmit = async (fromTimer = false) => {
    if (!user) {
      console.warn("No authenticated user, can't save result.");
      return;
    }
    if (submitted) return;

    setSubmitted(true);

    const qs = fromTimer ? questionsRef.current : questions;
    const ans = fromTimer ? answersRef.current : answers;

    let calculatedScore = 0;
    const selectedAnswers = [];

    qs.forEach((q, idx) => {
      const selectedIndex = ans[idx] !== undefined ? ans[idx] : null;
      selectedAnswers.push(selectedIndex);
      if (selectedIndex === q.correctOption) {
        calculatedScore += 1;
      }
    });

    setScore(calculatedScore);

    try {
      const resultData = {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        score: calculatedScore,
        category: selectedCategory,
        submittedAt: new Date(),
        answers: selectedAnswers, 
      };
      await addDoc(collection(db, "results"), resultData);
    } catch (error) {
      console.error("Error saving result:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <FiAward className="inline-block" /> MCQ Examination
          </h1>
          {selectedCategory && (
            <div className="mt-2 flex justify-between items-center">
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm">{selectedCategory}</span>
              {!submitted && (
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                  <FiClock className="inline-block" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 sm:p-8">
          {/* Category Selection */}
          {!selectedCategory && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Select a category to begin your exam</h2>
              <div className="flex flex-wrap justify-center gap-4 max-w-md mx-auto">
                {categories.map((cat, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedCategory(cat);
                      fetchQuestions(cat);
                    }}
                    className="px-6 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p>Loading questions...</p>
            </div>
          )}

          {/* Questions */}
          <AnimatePresence>
            {selectedCategory && questions.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                {questions.map((q, index) => (
                  <motion.div key={q.id} layout className="bg-gray-50 rounded-xl p-6">
                    <p className="font-medium text-lg text-gray-800 mb-4">
                      <span className="text-indigo-600 font-semibold">Q{index + 1}:</span> {q.question}
                    </p>
                    <div className="grid gap-3">
                      {q.options.map((option, optIndex) => {
                        const isSelected = answers[index] === optIndex;
                        const isCorrect = q.correctOption === optIndex;

                        let optionClasses = "p-4 rounded-lg border text-left ";
                        if (submitted) {
                          if (isSelected && isCorrect) {
                            optionClasses += "bg-green-50 border-green-200 text-green-800";
                          } else if (isSelected && !isCorrect) {
                            optionClasses += "bg-red-50 border-red-200 text-red-800";
                          } else if (isCorrect) {
                            optionClasses += "bg-green-50 border-green-200 text-green-800";
                          } else {
                            optionClasses += "bg-gray-50 border-gray-200 text-gray-600";
                          }
                        } else {
                          optionClasses += isSelected
                            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                            : "bg-white border-gray-200 hover:border-indigo-300 text-gray-700";
                        }

                        return (
                          <motion.div
                            key={optIndex}
                            whileHover={!submitted ? { scale: 1.02 } : {}}
                            whileTap={!submitted ? { scale: 0.98 } : {}}
                            className={`${optionClasses} transition-all cursor-pointer flex items-start gap-3`}
                            onClick={() => handleOptionClick(index, optIndex)}
                          >
                            {submitted && isCorrect && (
                              <FiCheckCircle className="text-green-500 mt-0.5 flex-shrink-0" />
                            )}
                            {submitted && isSelected && !isCorrect && (
                              <FiXCircle className="text-red-500 mt-0.5 flex-shrink-0" />
                            )}
                            <span>{option}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                ))}

                {/* Submit Button */}
                {!submitted && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                    <button
                      onClick={() => handleSubmit(false)}
                      className="w-full sm:w-auto mx-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                    >
                      Submit Exam
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          
        </div>
      </div>
    </div>
  );
}

export default Exam;
