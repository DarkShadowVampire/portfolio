import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>Made with <span role="img" aria-label="love">❤️</span> by Sourav Swarnakar</p>
            <p className="footer__copyright">
                &copy; {new Date().getFullYear()}; All rights reserved.
            </p>
        </footer>
    );
};

export default Footer;