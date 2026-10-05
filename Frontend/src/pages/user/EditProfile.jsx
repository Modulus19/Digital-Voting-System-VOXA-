// function EditProfile() {
//   return <h1>EditProfile Page</h1>
// }

// export default EditProfile

import Input from "../../components/common/Input";


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: 'William Uri',
    email: 'williamuri@gmail.com',
    password: '',
    phoneNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your save logic here
  };

  return (
    <div className="h-[calc(100vh-64px)] py-4 px-2 sm:px-4 -mx-4 sm:-mx-6">
      <div className="h-full bg-white rounded-2xl shadow-sm border border-gray-100 relative flex flex-col items-center justify-center overflow-y-auto p-6">
        
        {/* Back to Profile Link */}
        <button 
          onClick={() => navigate('/profile')} 
          className="absolute top-6 left-6 sm:top-8 sm:left-8 text-sm font-medium text-blue-500 hover:text-blue-600 transition-colors inline-flex items-center gap-1.5"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Profile
        </button>

        {/* Content Wrapper */}
        <div className="w-full max-w-md flex flex-col items-center my-auto pt-10 pb-6">
          
          {/* Avatar Circle */}
          <div className="w-24 h-24 rounded-full bg-violet-500 flex items-center justify-center mb-3 shadow-sm">
            <span className="text-white text-2xl font-semibold tracking-wide">WU</span>
          </div>

          {/* Name & Email Subtitle */}
          <h1 className="text-lg font-semibold text-gray-900">William Uri</h1>
          <p className="text-sm text-gray-500 mb-6">williamuri@gmail.com</p>

          {/* Form Fields */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Username</label>
              {/* <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              /> */}
              <Input
  label="Username"
  name="username"
  value={formData.username}
  onChange={handleChange}
/>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Enter phone number"
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800"
              />
            </div>

            {/* Save Changes Button */}
            <button
              type="submit"
              className="w-full mt-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </form>

          {/* Log Out Link */}
          <button
            onClick={() => navigate('/login')}
            className="mt-4 text-xs font-medium text-blue-500 hover:text-blue-600 transition-colors"
          >
            Log Out
          </button>

        </div>

      </div>
    </div>
  );
}