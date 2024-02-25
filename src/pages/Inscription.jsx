import React, { useState, useEffect } from 'react'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../config/firebase';
import { useNavigate, Link } from 'react-router-dom';
import { crudUser } from '../hooks/crudUser';
import {
    Container, Typography, TextField, Button,
    Box, Grid, CssBaseline, Paper
} from '@mui/material';
import Navbar from '../components/Navbar';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from '../config/firebase'

const Inscription = () => {


    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [mdp, setMdp] = useState("");
    const [repMdp, setRepMdp] = useState("");
    const [name, setName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [fileUpload, setFileUpload] = useState(null);
    const [validation, setValidation] = useState("");


    const uploadImageProfileFunction = async (uid, file) => {
        const storageRef = ref(storage, `profileImages/${uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    };


    const navigate = useNavigate();
    const { addUserDetails, uploadImageProfile } = crudUser();

    const handleForm = async (e) => {
        e.preventDefault();

        if (mdp !== repMdp) {
            setValidation("Confirmation de mot de passe incorrecte");
            return;
        }

        try {
            const response = await createUserWithEmailAndPassword(auth, email, mdp);
            setValidation("");



            //localStorage.setItem("user", JSON.stringify(response.user));

            const userDetails = {
                "name": name,
                "username": username,
            }

            if (firstName !== "") {
                userDetails["firstName"] = firstName;
            }



            await addUserDetails(response.user.uid, userDetails);



            if (fileUpload) {
                await uploadImageProfile(response.user.uid, fileUpload)
            }



            signOut(auth).then(() => {
                navigate("/connexion")
            });


            // navigate("/connexion");
        } catch (error) {
            if (error.code === "auth/email-already-in-use") {
                setValidation("email déjà utilisé")
            }
            //console.error(error);
        }


    }




    return (
        <>
            <Navbar />

            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid item xs={false} sm={6} sx={{
                    backgroundImage: 'url(https://files.oaiusercontent.com/file-aQkTkqaTdNFgGuPbR7gn3FLP?se=2024-02-23T18%3A28%3A51Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D68a5a577-dd55-4fd0-837d-62cdfa501d78.webp&sig=uGhvL%2BGxz49T5JdsFCxCkb5v8x21JUcKqsYX9hLlJSQ%3D)', // Replace with your image path
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <Grid item xs={12} sm={6} sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',

                }}>
                    <Paper elevation={6} sx={{
                        width: 'auto',
                        height: 'auto',
                        margin: (theme) => theme.spacing(8, 4),
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: (theme) => theme.spacing(2),

                    }}>
                        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                            S'inscrire
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleForm} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="username"
                                name="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />


                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de passe"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={mdp}
                                onChange={(e) => setMdp(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="confirmPassword"
                                label="Confirmez le mot de passe"
                                type="password"
                                id="confirmPassword"
                                value={repMdp}
                                onChange={(e) => setRepMdp(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Nom"
                                name="name"
                                autoComplete="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                fullWidth
                                id="firstName"
                                label="Prénom"
                                name="firstName"
                                autoComplete="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                            <TextField
                                type="file"
                                onChange={(e) => setFileUpload(e.target.files[0])}
                                inputProps={{
                                    accept: "image/*"
                                }}
                                fullWidth
                                margin="normal"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2, backgroundColor: 'red', color: 'white' }}
                            >
                                S'inscrire
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link to="/connexion" style={{ color: 'red', textDecoration: 'none' }}>
                                        Déjà inscrit ? Se connecter
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}

export default Inscription
