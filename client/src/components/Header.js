/*
I/We declare that the lab work here submitted is original
except for source material explicitly acknowledged,
and that the same or closely related material has not been
previously submitted for another course.
I/We also acknowledge that I/We am aware of University policy and
regulations on honesty in academic work, and of the disciplinary
guidelines and procedures applicable to breaches of such
policy and regulations, as contained in the website.
University Guideline on Academic Honesty:
https://www.cuhk.edu.hk/policy/academichonesty/
Student Name : LIN Yi
Student ID : 1155232784
Student Name : MANAV Suryansh
Student ID : 1155156662
Student Name : MUI Ka Shun
Student ID : 1155194765
Student Name : PARK Sunghyun
Student ID : 1155167933
Student Name : RAO Penghao
Student ID : 1155191490
Class/Section : CSCI2720
Date : 2024-12-04
*/
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const Header = ({ userName, onLogout, isAdmin }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(true);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownOpen && !event.target.closest('.dropdown')) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [dropdownOpen]);

    const toggleDropdown = (e) => {
        e.stopPropagation(); // Prevent event from bubbling up
        setDropdownOpen(!dropdownOpen);
    };

    const handleLogout = () => {
        onLogout();
        setDropdownOpen(false);
    };

    const handleNavCollapse = () => {
        setIsNavCollapsed(!isNavCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <Link to="/" className="navbar-brand ms-3">
                <img src={logo} alt="Logo" style={{ width: '40px', marginRight: '10px' }} />
                Muse Locator
            </Link>
            
            <button 
                className="navbar-toggler border-0 me-3"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
                aria-controls="navbarNav"
                aria-expanded={!isNavCollapsed}
                aria-label="Toggle navigation"
                onClick={handleNavCollapse}
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
                <ul className="navbar-nav ms-auto me-3">
                    <li className="nav-item">
                        <Link className="nav-link ms-3" to="/">Locations</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link ms-3" to="/locator">Locator</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link ms-3" to="/events">Events</Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link 
                            className="nav-link d-flex align-items-center justify-content-between ms-3" 
                            to="#" 
                            onClick={toggleDropdown}
                            style={{ position: 'relative', minWidth: '120px' }}
                        >
                            <u>Hi, {userName}</u>
                            <i 
                                className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}
                                style={{ fontSize: '12px', marginLeft: '5px' }}
                            ></i>
                        </Link>
                        <ul 
                            className={`dropdown-menu dropdown-menu-end ${dropdownOpen ? 'show' : ''}`}
                            style={{
                                right: 0,
                                left: 'auto',
                                minWidth: '200px'
                            }}
                        >
                            {isAdmin && (
                                <li>
                                    <Link 
                                        className="dropdown-item" 
                                        to="/admin-dashboard"
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            setIsNavCollapsed(true);
                                        }}
                                    >
                                        Dashboard
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/bookings" className="dropdown-item">My Bookings</Link>
                            </li>
                            <li>
                                <Link to="/favorites" className="dropdown-item">My Locations</Link>
                            </li>
                            <div className="dropdown-divider"></div>
                            <li>
                                <button 
                                    className="dropdown-item" 
                                    onClick={() => {
                                        handleLogout();
                                        setIsNavCollapsed(true);
                                    }}
                                >
                                    Logout
                                </button>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Header;
