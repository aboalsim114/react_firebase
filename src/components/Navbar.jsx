import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Assurez-vous que db est exporté depuis votre fichier de config Firebase
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import NotificationModal from './NotificationModal';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Tooltip from '@mui/material/Tooltip';
import { ThemeContext } from '../context/ThemeContext';


const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [notificationMenuOpen, setNotificationMenuOpen] = useState(null);
    const { theme, toggleTheme } = useContext(ThemeContext);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setIsUserAuthenticated(!!user);
            if (user) {
                const q = query(collection(db, "Notification"), where("ID de l'Utilisateur", "==", user.uid), where("Statut de Lecture", "==", false));
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const notifications = [];
                    querySnapshot.forEach((doc) => {
                        notifications.push({ id: doc.id, ...doc.data() });
                    });
                    setNotifications(notifications);
                });
                return () => unsubscribe();
            }
        });
        return () => unsubscribeAuth();
    }, []);

    const handleNotificationClick = (notification) => {
        setSelectedNotification(notification);
        setModalOpen(true);
        markNotificationAsRead(notification.id);
    };

    const handleThemeChange = () => {
        toggleTheme();
    };

    const handleNotificationMenuClick = (event) => {
        setNotificationMenuOpen(event.currentTarget);
    };

    const handleNotificationMenuClose = () => {
        setNotificationMenuOpen(null);
    };

    const handleNotificationClose = () => {
        setAnchorEl(null);
    };

    const markNotificationAsRead = async (notificationId) => {
        const notificationRef = doc(db, "Notification", notificationId);
        await updateDoc(notificationRef, {
            "Statut de Lecture": true
        });
    };

    const deconnect = () => {
        signOut(auth).then(() => {
            navigate("/connexion");
            localStorage.removeItem("user");
        }).catch((error) => {
            console.error("Erreur de déconnexion", error);
        });
    };






    const pages = isUserAuthenticated ? [
        { name: 'profile', path: '/profile' },
        { name: 'ajouter un fichier', path: '/ajoute-fichier' },
    ] : [
        { name: 'Connexion', path: '/connexion' },
        { name: 'Inscription', path: '/inscription' },
    ];

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <AppBar position="relative" sx={{ background: 'rgb(204, 10, 16)' }}>
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                    onClick={toggleDrawer(true)}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    anchor='left'
                    open={drawerOpen}
                    onClose={toggleDrawer(false)}
                >
                    <Box
                        sx={{ width: 250, bgcolor: 'rgb(204, 10, 16)', height: '100vh', color: 'white' }}
                        role="presentation"
                        onClick={toggleDrawer(false)}
                        onKeyDown={toggleDrawer(false)}
                    >
                        <List>
                            {pages.map((page) => (
                                <ListItem button key={page.name} onClick={() => navigate(page.path)}>
                                    <ListItemText primary={page.name} />
                                </ListItem>
                            ))}
                            {isUserAuthenticated && (
                                <ListItem button onClick={deconnect}>
                                    <ListItemText primary="Déconnexion" />
                                </ListItem>
                            )}
                        </List>
                    </Box>
                </Drawer>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    FireCollab
                </Typography>
                {isUserAuthenticated && (
                    <>
                        <IconButton color="inherit" onClick={handleNotificationMenuClick}>
                            <Badge badgeContent={notifications.length} color="secondary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <Menu
                            id="menu-notification"
                            anchorEl={notificationMenuOpen}
                            keepMounted
                            open={Boolean(notificationMenuOpen)}
                            onClose={handleNotificationMenuClose}
                        >
                            {
                                notifications.length > 0 ?
                                    notifications.map((notification) => (
                                        <MenuItem key={notification.id} onClick={() => handleNotificationClick(notification)}>
                                            {notification.Message}
                                        </MenuItem>
                                    ))
                                    :
                                    <MenuItem onClick={handleNotificationMenuClose}>Aucune notification</MenuItem>
                            }
                        </Menu>

                    </>
                )}
                <Tooltip title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}>
                    <IconButton onClick={handleThemeChange} color="inherit">
                        {theme === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Tooltip>
            </Toolbar>
            <NotificationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                notification={selectedNotification}
            />

        </AppBar>
    );
}

export default Navbar;
