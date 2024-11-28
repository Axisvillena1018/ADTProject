import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CastAndCrew = () => {
  const [castAndCrew, setCastAndCrew] = useState([]);

  useEffect(() => {
    axios.get('/api/cast-and-crew')
      .then(response => {
        setCastAndCrew(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => {
        console.error('Error fetching cast and crew:', error);
        setCastAndCrew([]); // Fallback to an empty array on error
      });
  }, []);

  return (
    <div>
      {Array.isArray(castAndCrew) && castAndCrew.length > 0 ? (
        castAndCrew.map((person) => (
          <div key={person.id}>
            <h3>{person.name}</h3>
            <p>{person.role}</p>
          </div>
        ))
      ) : (
        <p>No cast and crew available.</p>
      )}
    </div>
  );
};

export default CastAndCrew;
