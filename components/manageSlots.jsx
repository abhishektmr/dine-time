import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../assets/colors";
import { setSlotTimingInStore } from "../store/bookingSlice";
import { saveinDB } from "../util/firebaseRepo";
import ModalWithForm from "./modalWithForm";

export default function ManageSlots({ slots }) {
    const dispatch = useDispatch();
    const bookingData = useSelector(state => state.bookingStore);
    const [slotsVisible, setSlotsVisible] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        (async () => {
            try{
                const userDataStr = await AsyncStorage.getItem("userData");
                const parsedUserData = JSON.parse(userDataStr);
                setUserData(parsedUserData);
            } catch(error) {
                console.log("Error parsing userData obj from AsyncStorage ", error);
            }
        })();
    }, []);

    const handleSlotPress = (slot) => {
        if(selectedSlot == slot) {
            setSelectedSlot(null);
            dispatch(setSlotTimingInStore({slotTiming: null}));
        } else{
            setSelectedSlot(slot);
            dispatch(setSlotTimingInStore({slotTiming: slot}));
        }
    }

    const handleShowSlots = () => {
        setSlotsVisible(current => !current);
        setSelectedSlot(null);
    }

    const handleBookSlot = async () => {
        if(userData) {
            try {
                const bookingObj = {
                    ...bookingData,
                    "email": userData.email,
                    "name": userData.name
                }
                const success = await saveinDB("booking", bookingObj);
                if(success) {
                    Alert.alert("Table Booked Successfully!",
                    `We're ready to welcome you on ${bookingObj.bookingDate} at ${bookingObj.slotTiming}`,
                    [{text: "OK"}])
                } else {
                    Alert.alert("We're sorry we couldn't book a table for you.",
                    "Please try again later.",
                    [{text: "OK"}])
                }
            } catch(error) {
                console.error("Error in handleBookSlot ", error);
            } finally {
                handleShowSlots();
            }            
        } else {
            setShowModal(true);
            handleShowSlots();
        }
    }

    const onClose = () => {
        setShowModal(false);
    }

    return (
        <>
        <View style={{marginVertical: 14, flex: 1, flexDirection: "row", justifyContent: "space-between", gap: 14}}>
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={handleShowSlots} style={{backgroundColor: Colors.PRIMARY, borderRadius: 6, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "bold", fontSize: 20, padding: 10}}>{slotsVisible ? "Hide Slots" : "See Available Slots"}</Text>
                </TouchableOpacity>
            </View>
            {
            selectedSlot && 
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={handleBookSlot} style={{backgroundColor: Colors.PRIMARY, borderRadius: 6, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{fontWeight: "bold", fontSize: 20, padding: 10}}>Book Slot</Text>
                </TouchableOpacity>
            </View>
            }                  
        </View> 
        {
        slotsVisible && 
        <View style={styles.container}>
                    {
                        slots.map((slot, index) => {
                            return <TouchableOpacity key={index} 
                                                     style={[styles.slot, selectedSlot && selectedSlot != slot ? {opacity: 0.3} : null]} 
                                                     onPress={() => handleSlotPress(slot)}
                                                     disabled={selectedSlot == slot || selectedSlot == null ? false : true}
                                                     >
                                        <Text style={styles.text}>{slot}</Text>
                                    </TouchableOpacity>
                        })
                    }
                </View>
        }
        <ModalWithForm showModal={showModal} onClose={onClose}></ModalWithForm>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#474747",
        borderRadius: 6,
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        padding: 6
    },
    slot: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 6,
        padding: 16,
        margin: 6
    },
    text: {
        color: "white",
        fontSize: 16
    }
});