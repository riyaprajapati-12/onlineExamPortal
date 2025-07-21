import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { FiUser, FiLogOut, FiAward, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

function Home() {
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      navigate('/');
      
    } catch (error) {
      console.error(error.message);
     
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 py-8">
      <div className="bg-white rounded-2xl shadow-sm max-w-4xl w-full p-6 sm:p-8 md:p-10 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-full">
              <FiUser className="text-2xl text-indigo-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-800">Welcome back</h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors duration-200 p-2 rounded-full hover:bg-red-50"
            aria-label="Logout"
          >
            <FiLogOut className="text-xl" />
            <span className="sr-only sm:not-sr-only sm:text-sm">Logout</span>
          </button>
        </header>

        {/* Hero Section */}
        <div className="mb-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 leading-tight"
          >
            Ready to <span className="text-indigo-600">test your knowledge</span>?
          </motion.h1>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">
            Challenge yourself with our comprehensive exams and track your progress over time.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Link
              to="/exam"
              className="block p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-indigo-50 rounded-lg mr-4 group-hover:bg-indigo-100 transition-colors">
                  <FiClock className="text-2xl text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Start New Exam</h3>
              </div>
              <p className="text-gray-500 mb-6">
                Begin a timed assessment with questions tailored to your skill level.
              </p>
              <div className="text-indigo-600 font-medium flex items-center">
                Begin now
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group"
          >
            <Link
              to="/result"
              className="block p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-300 hover:shadow-md transition-all duration-200 h-full"
            >
              <div className="flex items-center mb-6">
                <div className="p-3 bg-green-50 rounded-lg mr-4 group-hover:bg-green-100 transition-colors">
                  <FiAward className="text-2xl text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">View Results</h3>
              </div>
              <p className="text-gray-500 mb-6">
                Review your past performance and see detailed breakdowns of your answers.
              </p>
              <div className="text-green-600 font-medium flex items-center">
                Check progress
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>Need help? Contact our support team anytime.</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;