import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../config/firebase';
import { crudUser } from '../hooks/crudUser';
import Navbar from '../components/Navbar';
import { Box, Button, Card, CardContent, Typography, Avatar, Container, Divider, Paper, TextField } from '@mui/material';
import { deepPurple, green } from '@mui/material/colors';
import { updateDoc, doc } from 'firebase/firestore';
import { collection, query, where, getDocs } from 'firebase/firestore';


const Home = () => {

  const [userConnectedDetails, setUserConnectedDetails] = useState({
    firstName: "",
    name: "",
    profileUrl: "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png"
  });
  const [userConnectedEmail, setUserConnectedEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const { getUserDetails } = crudUser();
  const firstNameRef = useRef(null);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  const [mySharedDocs, setMySharedDocs] = useState([]);
  const [userEmail, setUserEmail] = useState("");
  const nameRef = useRef(null);


  useEffect(() => {
    const getUserDetailsAsync = async (uid, email) => {
      setUserConnectedEmail(email);
      setUserConnectedDetails(await getUserDetails(uid));
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserDetailsAsync(user.uid, user.email);
      }
    });
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
  };


  const fetchSharedWithMe = async (email) => {
    const q = query(collection(db, "sharedFiles"), where("sharedWith", "==", email));
    const querySnapshot = await getDocs(q);
    setSharedWithMe(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const fetchMySharedDocs = async (uid) => {
    const q = query(collection(db, "sharedFiles"), where("ownerId", "==", uid));
    const querySnapshot = await getDocs(q);
    setMySharedDocs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };


  const handleSave = async () => {
    if (!firstNameRef.current || !nameRef.current) {
      console.error("Les champs ne sont pas correctement référencés.");
      return;
    }

    const updatedDetails = {
      firstName: firstNameRef.current.value,
      name: nameRef.current.value,
    };

    try {
      await updateDoc(doc(db, "user", auth.currentUser.uid), updatedDetails);
      alert("Profil mis à jour avec succès !");
      setEditMode(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 3 }}>
        <Paper elevation={3} sx={{ maxWidth: 600, width: '100%', overflow: 'hidden', borderRadius: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
            <Avatar alt="Profil img" src={userConnectedDetails.profileUrl} sx={{ width: 120, height: 120, mb: 3 }} />
            <Typography variant="h5" gutterBottom sx={{ color: deepPurple[900] }}>Profil Utilisateur</Typography>
            <Divider sx={{ width: '100%', mb: 3 }} />

            {editMode ? (
              <>
                <TextField label="Prénom" variant="outlined" inputRef={firstNameRef} defaultValue={userConnectedDetails.firstName} />
                <TextField label="Nom" variant="outlined" inputRef={nameRef} defaultValue={userConnectedDetails.name} sx={{ my: 2 }} />
                <TextField label="Username" variant="outlined" inputRef={nameRef} defaultValue={userConnectedDetails.username} sx={{ my: 2 }} />

                <Button onClick={handleSave} variant="contained" color="primary" sx={{ mt: 2 }}>Sauvegarder</Button>
              </>
            ) : (
              <>
                <Typography variant="body1" gutterBottom>Prénom : <Typography component="span" sx={{ fontWeight: 'bold' }}>{userConnectedDetails.firstName}</Typography></Typography>
                <Typography variant="body1" gutterBottom>Nom : <Typography component="span" sx={{ fontWeight: 'bold' }}>{userConnectedDetails.name}</Typography></Typography>
                <Typography variant="body1" gutterBottom>Username : <Typography component="span" sx={{ fontWeight: 'bold' }}>{userConnectedDetails.username}</Typography></Typography>
                <Typography variant="body1" gutterBottom>Email : <Typography component="span" sx={{ fontWeight: 'bold' }}>{userConnectedEmail}</Typography></Typography>
                <Button onClick={handleEdit} variant="contained" color="primary" sx={{ mt: 2 }}>Modifier</Button>
              </>
            )}

          </Box>
        </Paper>
      </Box>




    </>
  );
};

export default Home;
