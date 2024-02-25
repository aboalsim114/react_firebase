import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { storage, db } from '../config/firebase';
import { AppBar, Box, Button, Card, CardContent, Container, CssBaseline, LinearProgress, TextField, Toolbar, Typography, Snackbar } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { green, deepPurple } from '@mui/material/colors';
import Navbar from './Navbar';
import { createNotificationForSharedFile } from '../hooks/notification';

export default function FormAddFile() {
    const [file, setFile] = useState(null);
    const [progress, setProgress] = useState(0);
    const [shareWithEmail, setShareWithEmail] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleCloseSnackbar = () => setOpenSnackbar(false);

    const handleUpload = async () => {
        if (!file) {
            alert('Veuillez sélectionner un fichier à télécharger.');
            return;
        }

        const storageRef = ref(storage, `files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) => {
            console.error("Erreur de téléchargement: ", error);
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                const fileData = {
                    url: downloadURL,
                    name: file.name,
                    sharedWith: shareWithEmail,
                    timestamp: serverTimestamp(),
                };
                const fileRef = doc(db, "sharedFiles", file.name);
                setDoc(fileRef, fileData).then(() => {
                    if (shareWithEmail) {
                        createNotificationForSharedFile(shareWithEmail, file.name, downloadURL).then(() => {
                            console.log("Notification créée avec succès.");
                        }).catch((error) => {
                            console.error("Erreur lors de la création de la notification: ", error);
                        });
                    }
                    setOpenSnackbar(true);
                    setProgress(0);
                    setFile(null);
                    setShareWithEmail('');
                }).catch((error) => {
                    console.error("Erreur lors de la sauvegarde des métadonnées: ", error);
                });
            });
        });
    };



    return (
        <>
            <Navbar />
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <CssBaseline />
                <AppBar position="static" sx={{ bgcolor: "rgb(204, 10, 16)" }}>
                    <Toolbar>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>
                            Gestion de Fichiers FireCollab
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{ my: 4 }}>
                    <Card sx={{ p: 3, bgcolor: green[50] }}>
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h5" sx={{ color: green[900] }}>
                                Télécharger un Nouveau Fichier
                            </Typography>
                            <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} sx={{ bgcolor: "rgb(204, 10, 16)", '&:hover': { bgcolor: green[800] } }}>
                                Sélectionner un fichier
                                <input type="file" hidden onChange={handleFileChange} />
                            </Button>
                            {file && <Typography>Fichier sélectionné : {file.name}</Typography>}
                            <TextField
                                label="Partager avec (username)"
                                variant="outlined"
                                fullWidth
                                value={shareWithEmail}
                                onChange={(e) => setShareWithEmail(e.target.value)}
                                sx={{ my: 2 }}
                            />
                            <Button onClick={handleUpload} variant="contained" sx={{ bgcolor: deepPurple[600], '&:hover': { bgcolor: deepPurple[800] } }}>
                                Télécharger et Partager
                            </Button>
                            {progress > 0 && <LinearProgress variant="determinate" value={progress} sx={{ width: '100%', mt: 2 }} />}
                        </CardContent>
                    </Card>
                </Box>
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    message="Fichier téléchargé et partagé avec succès !"
                />
            </Container>
        </>
    );
}
