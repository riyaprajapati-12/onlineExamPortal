import { Link } from 'react-router-dom';
import lightbulb from '../assets/undraw_lightbulb.svg'; 

function Landing() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
      
      <div className="flex-1 flex flex-col justify-center items-start px-8 py-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4 leading-tight">
          Online Exam System 🎓
        </h1>
        <p className="text-lg text-gray-700 mb-4 max-w-md">
          Timed exams with multiple-choice questions, auto-evaluation, and instant result tracking — all in one place.
        </p>

        

      
        <div className="flex gap-4">
          <Link
            to="/login"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white border border-indigo-600 text-indigo-700 hover:bg-indigo-100 font-bold py-2 px-6 rounded-lg transition"
          >
            Register
          </Link>
        </div>
      </div>

     
      <div className="flex-1 flex items-center justify-center py-12 px-6">
        <img src={lightbulb} alt="exam idea" className="w-[300px] h-auto drop-shadow-2xl" />
      </div>
    </div>
  );
}

export default Landing;
