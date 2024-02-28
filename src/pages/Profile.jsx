import React, { useEffect, useState, useRef } from 'react';
import { auth, db } from '../config/firebase';
import { crudUser } from '../hooks/crudUser';
import Navbar from '../components/Navbar';
import { PieChart } from '@mui/x-charts/PieChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { DataGrid } from '@mui/x-data-grid';
import SharedFilesStatistics from '../components/profile/SharedFilesStatistics';
import SharedFilesGrid from '../components/profile/SharedFilesGrid';
import UserProfile from '../components/profile/UserProfile';
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
  Chip,
  Stack,
  useMediaQuery,
  useTheme
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

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up('md'));

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

  const dataForChart = [
    { id: 0, value: sharedWithMe.length, label: 'Fichiers partagés' },
  ];



  const columns = [
    { field: 'name', headerName: 'Nom du fichier', width: 200 },
    { field: 'timestamp', headerName: 'Partagé le', width: 150 },
    {
      field: 'download',
      headerName: 'Télécharger',
      width: 130,
      renderCell: (params) => (
        <IconButton href={params.row.url} target="_blank">
          <FileDownloadOutlinedIcon />
        </IconButton>
      ),
    },
  ];

  const rows = sharedWithMe.map((file, index) => ({
    id: index,
    name: file.name,
    timestamp: file.timestamp,
    url: file.url,
  }));


  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <UserProfile
              userConnectedDetails={userConnectedDetails}
              userConnectedEmail={userConnectedEmail}
              editMode={editMode}
              handleEdit={handleEdit}
              handleSave={handleSave}
              firstNameRef={firstNameRef}
              nameRef={nameRef}
              sx={{ flexGrow: 1 }}
            />

            <SharedFilesGrid rows={rows} columns={columns} sx={{ flexGrow: 2 }} />
          </Grid>


          <SharedFilesStatistics dataForChart={dataForChart} matches={matches} />

        </Grid>
      </Container>
    </>

  );
};

export default Home;
