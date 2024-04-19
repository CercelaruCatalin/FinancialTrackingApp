// Import the necessary modules and define the Navbar component.

import Link from 'next/link';
import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface ButtonProps {
  form: string;
}

const AddButton: React.FC<ButtonProps> = ({ form }) => {
  return (
    <div className="fixed bottom-5 right-5 flex items-center justify-center shadow-lg bg-green-500 m-0 hover:bg-green-600 rounded-xl h-14 w-14">
      <Link href={`/${form}/`}>
        <button className="flex items-center justify-center">
          <FaPlus size={32} /> {/* Adjust the size as needed */}
        </button>
      </Link>
    </div>
  );
};

export default AddButton;
