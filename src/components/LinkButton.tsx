import React from 'react';
import Link from 'next/link';

interface Props {
  href: string;
  children: React.ReactNode;
}

const LinkButton: React.FC<Props> = ({ href, children }) => {
  return (
    <Link
      href={href}
      className={`rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/90`}
    >
      {children}
    </Link>
  );
};

export default LinkButton;
