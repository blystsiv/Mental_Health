import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import Navbar from '../../components/Navbar';

const JournalDetailPage = () => {
  const { id, username } = useParams();
  const [journal, setJournal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJournal = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/journal/${username}/posts/${id}`
        );
        setJournal(response.data);
      } catch (error) {
        setError('Error fetching journal details');
      }
    };
    fetchJournal();
  }, [username, id]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-600 text-lg font-medium">{error}</div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Loading...</div>
      </div>
    );
  }

  const coverImage = journal.coverPicture
    ? `http://localhost:4000/${journal.coverPicture}`
    : 'assets/download.png';

  return (
    <>
      <Navbar />
      <div className="mt-12 min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {journal.title}
              </h1>

              <div className="relative aspect-[16/9] w-full mb-8 rounded-xl overflow-hidden">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed text-lg">
                  {journal.article}
                </p>
              </div>

              {journal.tags && journal.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800 hover:bg-indigo-200 transition-colors duration-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JournalDetailPage;
