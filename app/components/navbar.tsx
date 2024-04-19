// Import the necessary modules and define the Navbar component.

import Link from 'next/link';
import React from 'react';

interface NavbarProps {
  page: string;
}

const Navbar: React.FC<NavbarProps> = ({ page }) => {
  return (
    <div className="fixed top-0 right-0 left-20 w-full text-white shadow-lg bg-green-500 h-20 z-40">
      <div className="text-4xl font-bold p-2">
        {page}
      </div>
    </div>
  );
};

export default Navbar;
