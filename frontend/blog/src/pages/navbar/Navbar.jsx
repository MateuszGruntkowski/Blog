import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";
import { Shield, Crown, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  console.log(user);

  return (
    <nav className={styles.navbar}>
      <div className="container">
        <div className={styles.container}>
          <div className={styles.left}>
            <Link to="/" className={styles.brand}>
              Blog Platform
            </Link>
            {/* Admin Status Indicator */}
            {user && isAdmin() && (
              <div className={styles.adminIndicator}>
                <Crown size={16} />
                <span className={styles.adminText}>Admin View</span>
              </div>
            )}
          </div>
          <ul className={styles.nav}>
            <>
              {isAdmin() && (
                <li>
                  <Link
                    to="/categories"
                    className={`${styles.link} ${styles.adminLink}`}
                  >
                    <Settings size={16} />
                    Categories
                  </Link>
                </li>
              )}
              {isAdmin() && (
                <li>
                  <Link
                    to="/tags"
                    className={`${styles.link} ${styles.adminLink}`}
                  >
                    <Settings size={16} />
                    Tags
                  </Link>
                </li>
              )}
            </>
          </ul>
          <div className={styles.userActions}>
            {user ? (
              <>
                <Link to="/posts/drafts" className="btn btn-secondary">
                  Draft Posts
                </Link>
                <Link to="/posts/new" className="btn btn-primary">
                  New Post
                </Link>
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/auth" className="btn btn-primary">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
