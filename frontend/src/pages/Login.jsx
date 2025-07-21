import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      localStorage.setItem('token', userCredential.user.accessToken || userCredential.user.uid);
     
      navigate('/home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md space-y-6 transition-all duration-300"
      >
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-blue-800">Welcome Back!</h2>
          <p className="text-gray-600 mt-2 text-sm">Login to continue to your account</p>
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. user@example.com"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 hover:shadow-lg transition duration-300"
        >
          Login
        </button>

        <p className="text-sm text-gray-500 text-center">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
