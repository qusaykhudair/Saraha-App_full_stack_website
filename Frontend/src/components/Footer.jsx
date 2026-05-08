import { Link } from 'react-router-dom';
import { FaFacebook, FaGithub , FaTelegram, FaLinkedin  } from "react-icons/fa";
import { BsInstagram } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="footer-glass">
      <div className="container">
        <div className="footer-content">
          <div className="footer-info">
            <p className="footer-text">
              Development by <span className="text-gradient font-bold">Eng Qusay khudair</span>
            </p>
            <p className="footer-copyright text-secondary">
              © {new Date().getFullYear()} Saraha App. All rights reserved.
            </p>
          </div>
          
          <div className="social-links">
            <Link to="https://github.com/qusaykhudair" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <FaGithub size={20} />
            </Link>
                <Link to="https://www.facebook.com/m.qsy.khdyr" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <FaFacebook size={20} />
            </Link>
                <Link to="https://www.instagram.com/eng.qusay.khudair?igsh=MXE4cjAyMjdnbHZqdg%3D%3D" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <BsInstagram size={20} />
            </Link>
                <Link to="https://www.linkedin.com/in/eng-qusay-khudair-bb8303262" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <FaLinkedin size={20} />
            </Link>
                <Link to="https://t.me/eng_Qusay_kh" target="_blank" rel="noreferrer" className="social-icon" title="GitHub">
              <FaTelegram size={20} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
