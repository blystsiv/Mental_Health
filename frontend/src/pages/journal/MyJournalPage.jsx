import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';

import Navbar from '../../components/Navbar';

import '../../styles/Modal.css';

const defaultCoverImagePath = '/assets/thumbnail.jpg';

const MyJournalPage = () => {
  const [journals, setJournals] = useState([]);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // State for confirmation modal
  const [journalToDelete, setJournalToDelete] = useState(null); // State to store journal to delete
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJournals = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/journal/${username}/posts`
        );
        setJournals(response.data);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching journals:', error);
      }
    };
    fetchJournals();
  }, [username]);

  const handleEdit = journalId => {
    navigate(`/${username}/journals/${journalId}/edit`);
  };

  const handleDelete = journalId => {
    setJournalToDelete(journalId); // Set the journal to delete
    setShowConfirmationModal(true); // Show confirmation modal
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:4000/journal/${username}/posts/${journalToDelete}`
      );
      // Remove the deleted journal from the state
      setJournals(journals.filter(journal => journal._id !== journalToDelete));
      // Close the confirmation modal
      setShowConfirmationModal(false);
    } catch (error) {
      console.error('Error deleting journal:', error);
    }
  };

  const closeModal = () => {
    setShowConfirmationModal(false);
  };

  return (
    <>
      <Navbar />
      <div className="bg-white pt-12 sm:pt-16 pb-12 sm:pb-16">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-3xl mx-auto mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Your Journal
            </h2>
            <Link
              to={`/${username}/createjournal`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white font-semibold text-base rounded-lg shadow-md transition-colors duration-200"
            >
              Create Journal
            </Link>
          </div>
          <div className="container mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {journals.map(journal => {
              const coverImage = journal.coverPicture
                ? `http://localhost:4000/${journal.coverPicture}`
                : defaultCoverImagePath;

              const displayTags = journal.tags ? journal.tags.slice(0, 5) : [];
              const extraCount = journal.tags
                ? journal.tags.length - displayTags.length
                : 0;

              return (
                <div
                  key={journal._id}
                  className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                >
                  <article className="p-6 flex flex-col justify-between h-full space-y-4">
                    <img
                      src={coverImage}
                      alt="Cover"
                      className="w-full h-48 object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-x-3 text-xs text-gray-500">
                        <time
                          dateTime={journal.createdAt}
                          className="text-gray-500"
                        >
                          {new Date(journal.createdAt).toLocaleDateString()}
                        </time>
                      </div>
                      <div className="group relative">
                        <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                          <Link to={`/${username}/journals/${journal._id}`}>
                            {journal.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {journal.article}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 overflow-hidden whitespace-nowrap">
                      {displayTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex flex-shrink-0 items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800"
                        >
                          {tag.length > 20 ? `${tag.slice(0, 17)}...` : tag}
                        </span>
                      ))}
                      {extraCount > 0 && (
                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-gray-200 px-3 py-0.5 text-sm font-medium text-gray-600">
                          +{extraCount}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        className="px-3 py-1 text-sm font-medium border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
                        onClick={() => handleEdit(journal._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 text-sm font-medium border border-red-500 text-red-500 rounded hover:bg-red-50 transition"
                        onClick={() => handleDelete(journal._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
        {showConfirmationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <p className="text-lg font-semibold mb-4">
                Are you sure you want to delete this journal?
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-red-600"
                  onClick={confirmDelete}
                >
                  Delete
                </button>
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MyJournalPage;
