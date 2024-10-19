import { db } from '../app/firebaseConfig';
import { collection, addDoc, query, getDoc, where, getDocs, doc } from 'firebase/firestore';

import Swal from 'sweetalert2';

export const fetchProfileData = async (walletAddress: string) => {
    try  
    {
        const q = query(
            collection(db, "profiles"),
            where("wallet_address", "==", walletAddress)
        );
        const qSnapshot = await getDocs(q); 

        if (!qSnapshot.empty) 
        {
        const docData = qSnapshot.docs[0].data();
        return {
            title: docData.title || '',
            caption: docData.caption || '',
            saved_items: docData.saved_items || []
        }
        // setTitle(docData.title || '');
        // setCaption(docData.caption || '');

        } else  
        {
            console.log("No profile found on this wallet address!");
            Swal.fire({
                text: "No profile found on this wallet address", 
                icon: 'warning',
            })
            return null;
        }

    } catch(error) 
    {            
        Swal.fire({
            text: 'Oops something went wrong!',  
            icon: 'error',
        })
        console.log(error);
        return null;
    }
}