import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CastAndCrews.css';

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [castList, setCastList] = useState([]);

  // Set up a base URL for axios
  axios.defaults.baseURL = 'http://localhost/movieproject-api';

  // Fetch cast data from the backend
  useEffect(() => {
    axios
      .get(`/admin/casts/${movieId}`) // Adjusted the endpoint
      .then((response) => {
        setCastList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching casts:', error);
      });
  }, [movieId]);

  // Delete a cast member
  const handleDeleteCast = (id) => {
    axios
      .delete(`/admin/casts/${id}`) // Adjusted the delete endpoint
      .then(() => {
        alert('Cast deleted successfully!');
        setCastList((prevList) => prevList.filter((cast) => cast.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting cast:', error);
        alert('Failed to delete cast. Please try again.');
      });
  };

  return (
    <div className="cast-and-crews">
      <h1>Cast & Crews for Movie ID: {movieId}</h1>

      <div className="cast-list">
        <h2>Cast List</h2>
        {castList.map((cast) => (
          <div key={cast.id} className="cast-item">
            <img src={cast.url} alt={cast.name} style={{ width: 250, height: 250 }} />
            <div>
              <h3>{cast.name}</h3>
              <p>Character: {cast.characterName}</p>
              <button onClick={() => handleDeleteCast(cast.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastAndCrews;
