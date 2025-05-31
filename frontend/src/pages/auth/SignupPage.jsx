import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { PhotoIcon } from '@heroicons/react/24/solid';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    gender: '',
    bio: '',
    age: '',
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [error, setError] = useState('');
  const [missingDetailsError, setMissingDetailsError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (profilePicture) {
      const url = URL.createObjectURL(profilePicture);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [profilePicture]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = e => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const requiredFields = [
      'username',
      'password',
      'name',
      'email',
      'gender',
      'age',
    ];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setMissingDetailsError('Please fill in all required fields.');
      return;
    }

    try {
      const formDataWithFile = new FormData();
      for (const key in formData) {
        formDataWithFile.append(key, formData[key]);
      }
      if (profilePicture) {
        formDataWithFile.append('profilePicture', profilePicture);
      }

      const response = await fetch('http://localhost:4000/auth/signup', {
        method: 'POST',
        body: formDataWithFile,
      });

      if (response.status === 409) {
        const data = await response.json();
        setError(data.msg);
        return;
      }

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // eslint-disable-next-line no-console
      console.log('Signup successful:', data);
      navigate('/login');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error signing up:', error);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  const closeModal = () => {
    setError('');
    setMissingDetailsError('');
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col justify-center align-middle">
      {(error || missingDetailsError) && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>
          <div className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
            <div className="bg-red-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-8V7a1 1 0 112 0v3a1 1 0 01-2 0zm0 4a1 1 0 112 0 1 1 0 01-2 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Error
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {error || missingDetailsError}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                onClick={closeModal}
                type="button"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <div>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow-md"
          style={{
            background: 'linear-gradient(to right, #D1D5DB, #E5E7EB, #F3F4F6)',
          }}
        >
          <div className="px-8">
            <h2 className="text-2xl font-bold text-gray-800 m-8 text-center">
              Create Your Account
            </h2>
            <div className="space-y-8">
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="file-upload"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Profile Picture
                    </label>
                    <div
                      onDragOver={e => e.preventDefault()}
                      onDragEnter={e => e.preventDefault()}
                      onDrop={e => {
                        e.preventDefault();
                        const file = e.dataTransfer.files[0];
                        if (file) {
                          setProfilePicture(file);
                        }
                      }}
                      className={
                        previewUrl
                          ? 'relative mt-2 w-32 h-32 rounded-full overflow-hidden'
                          : 'relative mt-2 flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-6 cursor-pointer'
                      }
                    >
                      <input
                        id="file-upload"
                        name="profilePicture"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <>
                          <PhotoIcon
                            className="h-12 w-12 text-gray-400"
                            aria-hidden="true"
                          />
                          <p className="mt-2 text-sm text-gray-600">
                            Drag & drop an image, or click to select
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label
                      htmlFor="username"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Username <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="text"
                          name="username"
                          id="username"
                          autoComplete="username"
                          value={formData.username}
                          onChange={handleChange}
                          required
                          placeholder="Enter username"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                        <input
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="current-password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Enter password"
                          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 sm:col-span-2">
                    <label
                      htmlFor="bio"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      About
                    </label>
                    <div className="mt-2">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        value={formData.bio}
                        onChange={handleChange}
                        placeholder="Write a few sentences about yourself"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="col-span-1">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Name <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="given-name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Full name"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Email address <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="you@example.com"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="gender"
                      className="block text-sm font-medium leading-6 text-gray-900 "
                    >
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <select
                        id="gender"
                        name="gender"
                        autoComplete="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non Binary">Non Binary</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-span-1">
                    <label
                      htmlFor="age"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Age <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-2">
                      <input
                        type="number"
                        name="age"
                        id="age"
                        min="0"
                        autoComplete="age"
                        value={formData.age}
                        onChange={handleChange}
                        required
                        placeholder="Age"
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="mt-6 flex justify-center items-center gap-x-4 bg-white py-4 px-8"
            style={{
              background:
                'linear-gradient(to right, #D1D5DB, #E5E7EB, #F3F4F6)',
            }}
          >
            <button
              onClick={handleCancel}
              type="button"
              className="rounded-md border px-4 py-2 text-base font-medium text-gray-900 shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
