import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import Login from './pages/Public/Login/Login';
import Register from './pages/Public/Register/Register';
import CastAndCrews from './pages/Main/Movie/Form/CastNCrews';
import PictureUpload from './pages/Main/Movie/Form/PictureUpload';
import VideoForm from './pages/Main/Movie/Form/VideoForm';
import Main from './pages/Main/Main';
import Movie from './pages/Main/Movie/Movie';
import Lists from './pages/Main/Movie/Lists/Lists';
import Form from './pages/Main/Movie/Form/Form';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />, // Add the Register route here
  },
  {
    path: '/main',
    element: <Main />,
    children: [
      {
        path: '/main/movies',
        element: <Movie />,
        children: [
          {
            path: '/main/movies',
            element: <Lists />,
          },
          {
            path: '/main/movies/form/:movieId?',
            element: <Form />,
            children: [
              {
                path: '/main/movies/form/:movieId',
                element: (
                  <h1>Change this for cast & crew CRUD functionality.</h1>
                ),
              },
              {
                path: '/main/movies/form/:movieId/cast-and-crews',
                element:
                  <CastAndCrews />,
              },
              {
                path: '/main/movies/form/:movieId/photos',
                element: 
                <PictureUpload />,
              },
              {
                path: '/main/movies/form/:movieId/videos',
                element: 
                <VideoForm />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
