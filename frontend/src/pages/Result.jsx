import { useEffect, useState } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { FiCheck, FiX, FiAward, FiBarChart2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

function Result() {
  const [result, setResult] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const db = getFirestore();
  const auth = getAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const user = auth.currentUser;
        if (!user) return;

        const resultQuery = query(collection(db, 'results'), where('uid', '==', user.uid));
        const resultSnap = await getDocs(resultQuery);

        if (!resultSnap.empty) {
          const results = resultSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

          // Get latest submitted result
          const latestResult = results.sort((a, b) => b.submittedAt.seconds - a.submittedAt.seconds)[0];
          setResult(latestResult);

          const mcqQuery = query(
            collection(db, 'mcqs'),
            where('category', '==', latestResult.category)
          );
          const mcqSnap = await getDocs(mcqQuery);
          setMcqs(mcqSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculatePercentage = () => {
    if (!result || mcqs.length === 0) return 0;
    return Math.round((result.score / mcqs.length) * 100);
  };

  const getPerformanceMessage = (percentage) => {
    if (percentage >= 90) return "Outstanding! 🎉";
    if (percentage >= 70) return "Great job! 👍";
    if (percentage >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <FiAward className="text-indigo-600" />
            Exam Results
          </h1>
          <p className="text-gray-600 mt-2">Detailed analysis of your performance</p>
        </motion.div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden mb-8"
              >
                <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 p-6 text-white">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">{result.category || "Assessment"}</h2>
                      <p className="text-indigo-100">
                        {new Date(result.submittedAt.seconds * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 bg-white/20 px-4 py-2 rounded-full">
                      <span className="font-bold text-xl">{calculatePercentage()}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-full">
                        <FiCheck className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Correct Answers</p>
                        <p className="text-xl font-bold text-gray-800">
                          {result.score} / {mcqs.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <FiBarChart2 className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Performance</p>
                        <p className="text-xl font-bold text-gray-800">
                          {getPerformanceMessage(calculatePercentage())}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Question-wise Analysis */}
            {result && mcqs.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <FiCheck className="text-green-600" />
                    Detailed Question Analysis
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {mcqs.map((mcq, index) => {
                    const selectedIndex = result.answers?.[index];
                    const correctIndex = mcq.correctOption;
                    const isAnswered = selectedIndex !== undefined && selectedIndex !== null;
                    const isCorrect = isAnswered && selectedIndex === correctIndex;

                    return (
                      <motion.div
                        key={mcq.id || index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`p-6 ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {isCorrect ? <FiCheck /> : <FiX />}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-800 mb-3">
                              Q{index + 1}: {mcq.question}
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className={`p-3 rounded-lg border ${isAnswered ? (isCorrect ? 'border-green-200 bg-green-100' : 'border-red-200 bg-red-100') : 'border-gray-200 bg-gray-100'}`}>
                                <p className="text-sm font-medium text-gray-500 mb-1">Your Answer</p>
                                <p className="font-medium">
                                  {isAnswered ? mcq.options[selectedIndex] : 'Not answered'}
                                </p>
                              </div>
                              <div className="p-3 rounded-lg border border-green-200 bg-green-50">
                                <p className="text-sm font-medium text-gray-500 mb-1">Correct Answer</p>
                                <p className="font-medium text-green-800">
                                  {mcq.options[correctIndex]}
                                </p>
                              </div>
                            </div>

                            {!isCorrect && isAnswered && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <p className="text-sm font-medium text-blue-800">
                                  Explanation: {mcq.explanation || 'Review this concept for better understanding'}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

export default Result;
