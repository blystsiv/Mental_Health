import React from 'react';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import PrivateRoute from './components/PrivateRoute';

const HomePage = lazy(() => import('./pages/HomePage'));

const ProfilePage = lazy(() => import('./pages/profile/ProfilePage'));
const ProfileUpdatePage = lazy(() =>
  import('./pages/profile/ProfileUpdatePage')
);

const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const SignupPage = lazy(() => import('./pages/auth/SignupPage'));

const AnonymousSharingPage = lazy(() =>
  import('./pages/anonymous/AnonymousSharingPage')
);
const AnonymousPostPage = lazy(() =>
  import('./pages/anonymous/AnonymousPostPage')
);
const AllAnonymousPostPage = lazy(() =>
  import('./pages/anonymous/AllAnonymousPostPage')
);

const MyJournalPage = lazy(() => import('./pages/journal/MyJournalPage'));
const CreateJournalPage = lazy(() =>
  import('./pages/journal/CreateJournalPage')
);
const UpdateJournalPage = lazy(() =>
  import('./pages/journal/UpdateJournalPage')
);
const JournalDetailPage = lazy(() =>
  import('./pages/journal/JournalDetailPage')
);

const MoodTrackPage = lazy(() => import('./pages/MoodTrackPage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));
const TherapistPage = lazy(() => import('./pages/TherapistPage'));

const NoAccessPage = lazy(() => import('./pages/NoAccessPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={'Loading...'}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/:username/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/updateprofile"
            element={
              <PrivateRoute>
                <ProfileUpdatePage />
              </PrivateRoute>
            }
          />

          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route path="/anonymoussharing" element={<AnonymousSharingPage />} />
          <Route path="/createanonymouspost" element={<AnonymousPostPage />} />
          <Route path="/allanonymousposts" element={<AllAnonymousPostPage />} />

          <Route
            path="/:username/journals"
            element={
              <PrivateRoute>
                <MyJournalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/createjournal"
            element={
              <PrivateRoute>
                <CreateJournalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/journals/:id/edit"
            element={
              <PrivateRoute>
                <UpdateJournalPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/journals/:id"
            element={
              <PrivateRoute>
                <JournalDetailPage />
              </PrivateRoute>
            }
          />

          <Route
            path="/:username/mood"
            element={
              <PrivateRoute>
                <MoodTrackPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/quiz"
            element={
              <PrivateRoute>
                <QuizPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/:username/therapist"
            element={
              <PrivateRoute>
                <TherapistPage />
              </PrivateRoute>
            }
          />

          <Route path="/unauthorizedAccess" element={<NoAccessPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
