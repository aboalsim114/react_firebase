import { signOut } from 'firebase/auth';
import React from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

const Home = () => {

  const navigate = useNavigate();
  const deconnect = () => {
    localStorage.removeItem("user");
    signOut(auth);
    navigate("/connexion");
  }


  console.log(auth);
  return (
    <div className="container mt-5">

      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body text-center">
              <img src="https://via.placeholder.com/150" alt="Photo de profil" className="rounded-circle mb-3" />
              <h2 className="card-title">Profil Utilisateur</h2>
              <hr />

              {/* Informations utilisateur (à remplacer par des données réelles) */}
              <div className="mb-3">
                <label className="form-label">Prénom :</label>
                <p className="form-control-static">John</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Nom :</label>
                <p className="form-control-static">Doe</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Email :</label>
                <p className="form-control-static">john.doe@example.com</p>
              </div>

              {/* Bouton de déconnexion */}
              <button onClick={deconnect} className="btn btn-danger btn-block">Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
