import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './CastAndCrews.css';

const CastAndCrews = () => {
  const { movieId } = useParams();
  const [castList, setCastList] = useState([]);
  const [tmdbCastList, setTmdbCastList] = useState([]);
  const [newCast, setNewCast] = useState({
    name: '',
    characterName: '',
    url: '',
  });

  // Set up a base URL for axios
  axios.defaults.baseURL = 'http://localhost/movieproject-api';
  axios.defaults.headers.common['Authorization'] = `Bearer eyJ...`;

  // Fetch cast data from the backend
  useEffect(() => {
    axios
      .get(`/admin/casts/${movieId}`)
      .then((response) => {
        setCastList(response.data);
      })
      .catch((error) => {
        console.error('Error fetching casts:', error);
      });
  }, [movieId]);

  // Fetch cast and crew data from TMDB
  useEffect(() => {
    const options = {
      method: 'GET',
      headers: { accept: 'application/json' },
    };

    fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=YOUR_TMDB_API_KEY&language=en-US`,
      options
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.cast) {
          const mappedCast = data.cast.map((member) => ({
            id: member.id,
            name: member.name,
            characterName: member.character,
            url: `https://image.tmdb.org/t/p/w500${member.profile_path}`,
          }));
          setTmdbCastList(mappedCast);
        }
      })
      .catch((err) => console.error('Error fetching TMDB cast:', err));
  }, [movieId]);

  // Save selected TMDB cast member to your backend
  const handleSaveTmdbCast = (cast) => {
    const castData = {
      userId: 1,
      movieId: parseInt(movieId),
      name: cast.name,
      characterName: cast.characterName,
      url: cast.url,
    };

    axios
      .post('/admin/casts', castData)
      .then((response) => {
        alert('Cast added successfully!');
        setCastList((prevList) => [...prevList, response.data]);
      })
      .catch((error) => {
        console.error('Error saving TMDB cast:', error);
        alert('Failed to save cast. Please try again.');
      });
  };

  // Delete a cast member
  const handleDeleteCast = (id) => {
    axios
      .delete(`/admin/casts/${id}`)
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
        <h2>Saved Cast List</h2>
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

      <div className="tmdb-cast-list">
        <h2>TMDB Cast List</h2>
        {tmdbCastList.map((cast) => (
          <div key={cast.id} className="cast-item">
            <img src={cast.url} alt={cast.name} style={{ width: 250, height: 250 }} />
            <div>
              <h3>{cast.name}</h3>
              <p>Character: {cast.characterName}</p>
              <button onClick={() => handleSaveTmdbCast(cast)}>Save to Database</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CastAndCrews;
