import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../../components/Navbar';

const UpdateJournalPage = () => {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [tags, setTags] = useState('');
  const [coverPicture, setCoverPicture] = useState(null);
  const [error, setError] = useState('');
  const { username, id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/journal/${username}/posts/${id}`
        );
        if (response.status === 200) {
          const { title, article, tags, coverPicture } = response.data;
          setTitle(title);
          setArticle(article);
          setTags(tags.join(', ')); // Convert array to comma-separated string
          setCoverPicture(coverPicture); // Assuming coverPicture is a URL
        } else {
          setError('Failed to fetch journal details');
        }
      } catch (error) {
        console.error('Error fetching journal:', error);
        setError('Failed to fetch journal details');
      }
    };

    fetchJournal();
  }, [username, id]);

  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'article') setArticle(value);
    if (name === 'tags') setTags(value);
  };

  const handleCancel = () => {
    navigate(`/${username}/journals`);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('article', article);
      formData.append('tags', tags);
      if (coverPicture) {
        formData.append('coverPicture', coverPicture);
      }

      const formDataObject = {};
      for (const [key, value] of formData.entries()) {
        formDataObject[key] = value;
      }

      const response = await axios.put(
        `http://localhost:4000/journal/${username}/posts/${id}`,
        formDataObject
      );

      if (response.status !== 200) {
        throw new Error('Network response was not ok');
      } else {
        console.log('Journal updated successfully:', response.data);
        navigate(`/${username}/profile`);
      }
    } catch (error) {
      console.error('Error updating journal:', error);
      setError('Failed to update journal');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 mt-20">
        <div
          className="max-w-3xl w-full bg-gray-100 rounded-lg shadow-md p-8"
          style={{
            background: 'linear-gradient(to right, #D1D5DB, #E5E7EB, #F3F4F6)',
          }}
        >
          <h2 className="text-3xl font-bold leading-9 text-gray-900 text-center mb-8">
            Update your journal!
          </h2>
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={title}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Your journal title"
                />
              </div>
              <div>
                <label
                  htmlFor="article"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Your Journal
                </label>
                <textarea
                  id="article"
                  name="article"
                  rows={10}
                  value={article}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Write your journal here..."
                />
              </div>
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tags
                </label>
                <input
                  type="text"
                  name="tags"
                  id="tags"
                  value={tags}
                  onChange={handleChange}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="e.g., travel, food, lifestyle"
                />
              </div>
            </div>

            {error && <p className="text-red-500 text-center mt-4">{error}</p>}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="text-lg font-semibold leading-6 text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdateJournalPage;
