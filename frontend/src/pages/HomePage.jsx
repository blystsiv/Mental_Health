import React from 'react';

import Wellcome from '../components/home/Wellcome';
import Topics from '../components/home/Topics';
import Features from '../components/home/Features';
import Navbar from '../components/Navbar';

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="mt-20">
        <Wellcome />
        <Topics />
        <Features />
      </div>
    </div>
  );
};

export default HomePage;
