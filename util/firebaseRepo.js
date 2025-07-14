import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export async function saveinDB(collectionName, document) {
    try{
        const docRef = await addDoc(collection(db, collectionName), document);
        console.log('Booking saved with ID:', docRef.id);
        return true;
    } catch(error){
        console.log('Error adding booking: ', error);
        return false;
    }
}