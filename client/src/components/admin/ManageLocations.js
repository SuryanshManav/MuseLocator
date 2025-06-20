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
import React, { useState } from 'react';
import axios from 'axios';
import './AdminForms.css';

const ManageLocations = ({ setMessage }) => {
    const [expandedSection, setExpandedSection] = useState(null);
    
    // Location management state variables
    const [findLocationName, setFindLocationName] = useState('');
    const [listLocations, setListLocations] = useState([]);

    // Location management functions
    const handleFindLocation = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(`http://localhost:5001/api/locations/loadLocation/${findLocationName}`);
            setMessage(`Location found: ${response.data.locName}`);
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error finding location');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    const handleListLocations = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5001/api/locations/listAllLocations');
            setListLocations(response.data);
            setMessage('Locations listed successfully');
            setTimeout(() => setMessage(''), 2000);
        } catch (err) {
            console.error(err);
            setMessage('Error listing locations');
            setTimeout(() => setMessage(''), 2000);
        }
    };

    return (
        <div className="tab-content w-100">
            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'listLocations' ? null : 'listLocations')}
                >
                    <h3>
                        <i className="fas fa-list-alt me-2"></i>
                        List All Locations
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'listLocations' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'listLocations' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleListLocations} className="admin-form">
                            <div className="data-list">
                                {listLocations.map((location) => (
                                    <div key={location.venueid} className="admin-card">
                                        <p><strong>Venue ID:</strong> {location.venueid}</p>
                                        <p><strong>Location:</strong> {location.location}</p>
                                        <p><strong>Latitude:</strong> {location.latitude}</p>
                                        <p><strong>Longitude:</strong> {location.longitude}</p>
                                    </div>
                                ))}
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                List Locations
                            </button>
                        </form>
                    </div>
                )}
            </div>

            <div className="admin-section">
                <div 
                    className="admin-section-header"
                    onClick={() => setExpandedSection(expandedSection === 'findLocation' ? null : 'findLocation')}
                >
                    <h3>
                        <i className="fas fa-search me-2"></i>
                        Find Location
                    </h3>
                    <i className={`fas fa-chevron-${expandedSection === 'findLocation' ? 'up' : 'down'}`}></i>
                </div>
                {expandedSection === 'findLocation' && (
                    <div className="admin-section-content">
                        <form onSubmit={handleFindLocation} className="admin-form">
                            <div className="form-row">
                                <div className="form-col">
                                    <label htmlFor="findLocationName">Location Name</label>
                                    <input 
                                        type="text" 
                                        id="findLocationName" 
                                        value={findLocationName} 
                                        onChange={(e) => setFindLocationName(e.target.value)} 
                                        required 
                                        placeholder="Enter location name"
                                    />
                                </div>
                            </div>
                            <button type="submit" className="btn-admin btn-admin-primary">
                                Find Location
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageLocations; 
