import React from 'react';
import { Paper, Box, Avatar, Typography, Chip, Grid, TextField, Button } from '@mui/material';

function UserProfile({
    userConnectedDetails,
    userConnectedEmail,
    editMode,
    handleEdit,
    handleSave,
    firstNameRef,
    nameRef
}) {
    return (
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar alt="Profile Image" src={userConnectedDetails.profileUrl} sx={{ width: 90, height: 90, mb: 2 }} />
                {!editMode ? (
                    <>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {userConnectedDetails.firstName} {userConnectedDetails.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                            {userConnectedEmail}
                        </Typography>
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
    );
}

export default UserProfile;
