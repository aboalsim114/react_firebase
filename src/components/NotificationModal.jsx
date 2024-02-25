import React from 'react';
import { Modal, Box, Typography, Link, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';



const NotificationModal = ({ open, onClose, notification }) => {

    const formattedTimestamp = notification?.Timestamp
        ? new Date(notification.Timestamp.toDate()).toLocaleDateString('fr-FR')
        : 'Date inconnue';



    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        maxWidth: '500px', // Ajustement pour une largeur optimale
        bgcolor: 'var(--background-color-light)',
        color: 'var(--primary-text-color-light)',
        boxShadow: 24,
        p: 4,
        borderRadius: 2, // Coins légèrement arrondis pour un design sobre
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="notification-modal-title"
            aria-describedby="notification-modal-description"
        >
            <Box sx={modalStyle}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" component="h2">
                        {notification?.Titre || 'Notification'}
                    </Typography>
                    <IconButton onClick={onClose} size="small" sx={{ color: 'grey.600' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formattedTimestamp}
                </Typography>
                <Typography variant="body1" sx={{ my: 2 }}>
                    {notification?.Message}
                </Typography>
                {notification?.['URL Associée'] && (
                    <Link href={notification['URL Associée']} target="_blank" rel="noopener noreferrer" sx={{ display: 'flex', alignItems: 'center', mt: 2, textDecoration: 'none', color: 'primary.main' }}>
                        <VisibilityIcon sx={{ mr: 1 }} /> Voir le document
                    </Link>
                )}
            </Box>
        </Modal>
    );
};

export default NotificationModal;
