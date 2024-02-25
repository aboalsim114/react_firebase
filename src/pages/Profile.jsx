import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../config/firebase';
import { crudUser } from '../hooks/crudUser';
import Navbar from '../components/Navbar';
import {
  Box,
  Button,
  Typography,
  Avatar,
  Paper,
  TextField,
  Grid,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Container,
  Chip
} from '@mui/material';
import { deepPurple, green } from '@mui/material/colors';
import { updateDoc, doc, collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';

const Home = () => {
  const [userConnectedDetails, setUserConnectedDetails] = useState({
    firstName: "",
    name: "",
    profileUrl: "https://cdn.pixabay.com/photo/2020/07/14/13/07/icon-5404125_1280.png",
    username: "",

  });
  const [userConnectedEmail, setUserConnectedEmail] = useState("");
  const [editMode, setEditMode] = useState(false);
  const { getUserDetails } = crudUser();
  const firstNameRef = useRef(null);
  const nameRef = useRef(null);
  const [sharedWithMe, setSharedWithMe] = useState([]);
  useEffect(() => {
    const fetchUserData = async () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const userRef = doc(db, "user", user.uid);
          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();
            setUserConnectedDetails(prev => ({ ...prev, ...userData }));
            if (userData.username) {
              fetchSharedWithMe(userData.username);
            }
          } else {
            console.log("No such document!");
          }
        }
      });
    };

    fetchUserData();
  }, []);
  useEffect(() => {
    const getUserDetailsAsync = async (uid, email) => {
      setUserConnectedEmail(email);
      setUserConnectedDetails(await getUserDetails(uid));
    }

    auth.onAuthStateChanged((user) => {
      if (user) {
        getUserDetailsAsync(user.uid, user.email);
        fetchSharedWithMe(user.email);
      }
    });
  }, []);

  const handleEdit = () => {
    setEditMode(!editMode);
  };

  const fetchSharedWithMe = async (username) => {
    const q = query(collection(db, "sharedFiles"), where("sharedWith", "==", username));
    const querySnapshot = await getDocs(q);
    const files = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        url: data.url,
        timestamp: new Date(data.timestamp.seconds * 1000).toLocaleDateString("fr-FR"),
      };
    });
    setSharedWithMe(files);
  };
  const handleSave = async () => {
    if (!firstNameRef.current.value || !nameRef.current.value) {
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
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* User Profile Section */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar alt="Profil img" src={userConnectedDetails.profileUrl} sx={{ width: 90, height: 90, mb: 2 }} />
            {!editMode ? (
              <>
                <Typography variant="h5" color="primary" gutterBottom>{userConnectedDetails.firstName} {userConnectedDetails.name}</Typography>
                <Typography variant="subtitle1" color="text.secondary">{userConnectedEmail}</Typography>
                <Chip label="Modifier Profil" color="primary" onClick={handleEdit} sx={{ mt: 2 }} />
              </>
            ) : (
              <Box component="form" noValidate sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="given-name"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="Prénom"
                      autoFocus
                      defaultValue={userConnectedDetails.firstName}
                      inputRef={firstNameRef}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Nom de famille"
                      name="lastName"
                      autoComplete="family-name"
                      defaultValue={userConnectedDetails.name}
                      inputRef={nameRef}
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                  onClick={handleSave}
                >
                  Sauvegarder
                </Button>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Shared Files Section */}
        <Typography variant="h6" gutterBottom component="div">
          Fichiers partagés avec moi
        </Typography>
        <Grid container spacing={3}>
          {sharedWithMe.map((file) => (
            <Grid item key={file.id} xs={12} sm={6} md={4}>
              <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {file.name}
                  </Typography>
                  <Typography color="text.secondary">
                    Partagé le {file.timestamp}
                  </Typography>
                </CardContent>
                <CardActions>
                  <IconButton size="small" href={file.url} target="_blank" aria-label="download">
                    <FileDownloadOutlinedIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Home;
