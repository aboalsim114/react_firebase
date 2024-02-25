import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { RouterProvider, Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import Inscription from './pages/Inscription';
import Profile from './pages/Profile';
import Protected from './components/Protected';
import Connexion from './pages/Connexion';
import Notes from './pages/Notes';
import AddNote from './pages/AddNote';
import ModifyNote from './pages/ModifyNote';
import FormAddFile from './components/FormAddFile';
import { ThemeProvider } from './context/ThemeContext';
import { Navigate } from 'react-router-dom';

const router = createBrowserRouter(

  createRoutesFromElements(

    <Route path='/' element={<App />}>
      <Route index element={<Navigate replace to="/connexion" />} />

      <Route path='inscription' element={<Inscription />} />
      <Route path='connexion' element={<Connexion />} />
      <Route element={<Protected />} >
        <Route path='/profile' element={<Profile />} />
        <Route path='/ajoute-fichier' element={<FormAddFile />} />
        <Route path='/notes' element={<Notes />} />
        <Route path='/notes/add' element={<AddNote />} />
        <Route path='/notes/modify/:id' element={<ModifyNote />} />
      </Route>
    </Route>

  )
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </>
);

