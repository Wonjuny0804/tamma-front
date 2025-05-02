'use client';

import { FC, useState } from 'react';
import { motion } from 'motion/react';
import Image from 'next/image';

const Navbar: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className={`fixed top-0 right-0 left-0 z-50 px-4 py-6`}>
      <motion.nav
        className={`relative flex w-full flex-row items-center justify-between rounded-lg bg-white p-4 shadow-lg transition-colors`}
      >
        <div>
          <Image src="/tamma_logo.svg" alt="Tamma Logo" width={100} height={100} />
        </div>

        <div
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex cursor-pointer flex-col gap-3 p-1"
        >
          <motion.div
            style={{ width: 22, height: 2, borderRadius: 5, backgroundColor: 'black' }}
          ></motion.div>
          <motion.div
            style={{ width: 22, height: 2, borderRadius: 5, backgroundColor: 'black' }}
          ></motion.div>
        </div>

        {isMenuOpen && (
          <div className="absolute top-16 right-4">
            <ul>
              <li>Features</li>
              <li>Benefits</li>
              <li>Pricing</li>
              <li>Contact</li>
            </ul>
          </div>
        )}
      </motion.nav>
    </div>
  );
};

export default Navbar;
