import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../store/slices/authSlice';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import logoIcon from '../assets/icon_trans.png';

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setValidationError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    setValidationError('');

    // Validation
    if (formData.password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    const result = await dispatch(register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }));

    if (result.type === 'auth/register/fulfilled') {
      navigate('/dashboard'); // Changed to dashboard based on new default
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 flex items-center justify-center p-4 transition-colors">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl opacity-20 dark:opacity-10 animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50 dark:border-gray-700/50 p-8 sm:p-10 transition-colors">
            
            {/* Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center mb-6 relative group">
                     <div className="absolute inset-0 bg-primary blur-xl opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                     <img src={logoIcon} alt="Playory" className="w-20 h-20 object-contain relative z-10 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Create Account</h1>
                <p className="text-gray-500 dark:text-gray-400">Join Playory and track your journey</p>
            </div>

            {(error || validationError) && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
                <span className="block w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                {error || validationError}
            </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                Name
                </label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all"
                        placeholder="John Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                Email
                </label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 pl-1">
                Confirm Password
                </label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary dark:focus:border-primary text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
                {loading ? 'Creating account...' : 'Create Account'}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700/50 text-center">
            <p className="text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary-dark font-bold hover:underline decoration-2 underline-offset-2 transition-colors">
                Sign in
                </Link>
            </p>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
