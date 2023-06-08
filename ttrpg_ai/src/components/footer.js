import React from 'react';

const Footer = () => {
  return (
    <footer className="footer bg-light mt-auto py-3">
      <div className="container text-center">
        <span className="text-muted">© {new Date().getFullYear()} Phoenix Fabrications. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
