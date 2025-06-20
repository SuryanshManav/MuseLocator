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

const LocationsTable = ({ filteredLocations, setFilteredLocations }) => {
    // State for filtering and searching
    const [distance, setDistance] = useState(25);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');
    const [locations, setLocations] = useState([]); // State for locations from database
    const [favorites, setFavorites] = useState([]);
    const [userLatitude, setUserLatitude] = useState(null); // State for user's latitude
    const [userLongitude, setUserLongitude] = useState(null); // State for user's longitude
    const [isFetching, setIsFetching] = useState(true);
    const [categories, setCategories] = useState([]); //category
    const [selectedCategory, setSelectedCategory] = useState('');  //category

    const userEmail = localStorage.getItem('userEmail');

    // Fetch user's location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLatitude(position.coords.latitude);
                    setUserLongitude(position.coords.longitude);
                },
                (error) => {
                    console.error('Error fetching location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    // Fetch locations from the backend
    useEffect(() => {
        fetch('http://localhost:5001/location')
            .then(response => response.json())
            .then(data => {
                setLocations(data);
                // Extract category from the array of objects
                const extractedCategory = data.map(item => {
                    const match = item.location.match(/\(([^)]+)\)/); // Match text inside parentheses
                    return match ? match[1] : null; // Return the first match or null
                }).filter(Boolean); // Remove null values
                const uniqueCategory = Array.from(new Set(extractedCategory));
                setCategories(uniqueCategory); // Update state with extracted substrings
            })
            .catch(error => console.error('Error fetching locations:', error));
    }, []);

    // Fetch user's favorites
    useEffect(() => {
        if (userEmail) {
            fetch(`http://localhost:5001/api/users/loadUser/${userEmail}`)
                .then(res => res.json())
                .then(userData => {
                    setFavorites(userData.locations || []);
                })
                .catch(error => console.error('Error fetching favorites:', error));
        }
    }, [userEmail]);



    // Function to calculate distance between two lat/lng points
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in km
        const dLat = (lat2 - lat1) * (Math.PI / 180);
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    };

    const distances = locations.map(location => 
        calculateDistance(userLatitude, userLongitude, location.latitude, location.longitude)
    );
    
    const maxDistance = Math.ceil(Math.max(...distances) + 1);
    const minDistance = Math.min(...distances).toFixed(0);

    useEffect(() => {
        if (userLatitude === null || userLongitude === null) return; // Wait until location is fetched
        const filtered = locations.filter(location => {
            const distanceToLocation = calculateDistance(userLatitude, userLongitude, location.latitude, location.longitude);
        
            return distanceToLocation <= distance &&
                location.location.toLowerCase().includes(searchTerm.toLowerCase());
        });
        setFilteredLocations(filtered);
        setIsFetching(false);
    }, [userLatitude, userLongitude, distance, searchTerm, locations]);

    // Function to handle sorting
    const handleSort = () => {
        const sortedData = [...locations].sort((a, b) => {
            return sortOrder === 'asc'
                ? a.count - b.count
                : b.count - a.count;
        });
        setLocations(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };

    // Function to handle adding/removing favorites
    const toggleFavorite = async (venueid) => {
        if (!userEmail) {
            alert('Please log in to save favorites');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5001/api/users/updateUser/${userEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    locations: favorites.includes(venueid)
                        ? favorites.filter(id => id !== venueid)  // Remove if exists
                        : [...favorites, venueid]                 // Add if doesn't exist
                })
            });

            if (response.ok) {
                const userData = await response.json();
                setFavorites(userData.locations);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
        }
    };

    //handle category
    const handleCategory = (event) => {
        const value = event.target.value;
        setSelectedCategory(value);
        

        const newFilteredCategory = locations.filter(item => {
            console.log(value);
            const match = item.location.match(/\(([^)]+)\)/);
            return match && match[1].includes(value); 
        });
        console.log(newFilteredCategory);
        setFilteredLocations(newFilteredCategory.length > 0 ? newFilteredCategory : locations);
    };

    return (
        <main className="container mt-4" style={{ paddingTop: '70px' }}>
            <div>
                <div className="mb-3">
                    <h1>Explore What's Popping</h1>
                </div>
                <div className="row mb-3">
                    <div className="col-12 col-md-4 mb-2">
                        <p className="mb-1">Filter by Distance</p>
                        <input
                            type="range"
                            min={minDistance}
                            max={maxDistance}
                            value={distance}
                            onChange={(e) => setDistance(e.target.value)}
                            className="form-range"
                        />
                        <p className="mb-0">{distance} km</p>
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                        <p className="mb-1">Filter by Category</p>
                        <select value={selectedCategory} onChange={handleCategory} className="form-select">
                            <option value="">All</option>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-12 col-md-4 mb-2">
                        <p className="mb-1">Search Location</p>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search a location ..."
                            className="form-control"
                        />
                    </div>
                </div>

                <div style={{ marginTop: '20px' }} />

                {isFetching ? (
                    <p>Fetching Locations...</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                                <th style={{ textAlign: 'center' }}>Venue ID</th>
                                <th style={{ textAlign: 'center' }}>Location</th>
                                <th onClick={handleSort} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                    Events {sortOrder === 'asc' ? '↑' : '↓'}
                                </th>
                                <th style={{ textAlign: 'center' }}>Favorite</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLocations.map(location => (
                                <tr key={location.venueid}>
                                    <td style={{ textAlign: 'center' }}>{location.venueid}</td>
                                    <td style={{ textAlign: 'center' }}><Link
                                        to={`/location/${location.location}`}
                                        className="text-decoration-none text-primary"
                                    >
                                        {location.location}
                                    </Link></td>
                                    <td style={{ textAlign: 'center' }}>{location.count}</td>
                                    <td onClick={() => toggleFavorite(location.venueid)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                                        {favorites.includes(location.venueid) ? (
                                            <i className="fa fa-heart" style={{ color: 'red' }}></i>
                                        ) : (
                                            <i className="far fa-heart"></i>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </main>
    );
};

export default LocationsTable;
