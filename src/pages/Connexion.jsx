import React from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { Grid, Paper, Box, Avatar, Typography, TextField, Button, Link } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Navbar from "../components/Navbar"
export default function Connexion() {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email('Entrez une adresse email valide')
            .required('Le champ email est requis'),
        password: Yup.string()
            .min(6, 'Le mot de passe doit contenir au moins 6 caractères')
            .required('Le champ mot de passe est requis'),
    });

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
                if (userCredential.user) {
                    console.log(userCredential.user);
                    localStorage.setItem("user", JSON.stringify(userCredential.user));
                    navigate('/profile');
                }
            } catch (error) {
                console.error('Error signing in with email and password', error);
                formik.setFieldError('general', error.message);
            }
        },
    });

    return (
        <>
            <Navbar />
            <Grid container component="main" sx={{ height: '100vh' }}>
                <Grid item xs={false} sm={4} md={7} sx={{
                    backgroundImage: 'url(https://files.oaiusercontent.com/file-aQkTkqaTdNFgGuPbR7gn3FLP?se=2024-02-23T18%3A28%3A51Z&sp=r&sv=2021-08-06&sr=b&rscc=max-age%3D31536000%2C%20immutable&rscd=attachment%3B%20filename%3D68a5a577-dd55-4fd0-837d-62cdfa501d78.webp&sig=uGhvL%2BGxz49T5JdsFCxCkb5v8x21JUcKqsYX9hLlJSQ%3D)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            height: 'calc(100vh - 64px)',
                            justifyContent: 'center'
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'rgb(204, 10, 16)' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Connexion
                        </Typography>
                        <Box component="form" noValidate onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Adresse Email"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mot de Passe"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                error={formik.touched.password && Boolean(formik.errors.password)}
                                helperText={formik.touched.password && formik.errors.password}
                            />
                            {formik.errors.general && <Typography color="error" variant="body2">{formik.errors.general}</Typography>}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"

                                sx={{ mt: 3, mb: 2, bgcolor: 'rgb(204, 10, 16)' }}
                            >
                                Se connecter
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/inscription" variant="body2">
                                        {"Vous n'avez pas de compte? S'inscrire"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
}
