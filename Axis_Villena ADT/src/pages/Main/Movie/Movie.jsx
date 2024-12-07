import { Outlet } from 'react-router-dom';

const Movie = () => {
  return (
    <>
       <h1 style={{ color: 'white', textAlign: 'center' }}>Welcome to Movie Dashboard</h1>
      <Outlet />
    </>
  );
};

export default Movie;
