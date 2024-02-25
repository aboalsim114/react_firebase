import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

export const createNotificationForSharedFile = async (sharedWithEmail, fileName, fileUrl) => {
    const userRef = collection(db, "user");
    const q = query(userRef, where("username", "==", sharedWithEmail));
    const querySnapshot = await getDocs(q);
    let userId = null;

    querySnapshot.forEach((doc) => {
        userId = doc.id;
    });

    if (userId) {
        const notificationRef = collection(db, "Notification");
        await addDoc(notificationRef, {
            "ID de l'Utilisateur": userId,
            "Message": `'${fileName}' a été partagé avec vous.`,
            "Statut de Lecture": false,
            "Timestamp": serverTimestamp(),
            "Titre": "Nouveau fichier partagé",
            "Type de Notification": "Partage de fichier",
            "URL Associée": fileUrl
        });
    }
};
