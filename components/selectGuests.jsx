import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { Colors } from "../assets/colors";
import { setGuestNumberInStore } from "../store/bookingSlice";
import GuestNumberUpdator from "./guestNumberUpdator";

export default function SelectGuests() {
    const dispatch = useDispatch();
    const [guestNumber, setGuestNumber] = useState(2);

    function increaseGuestsCount() {
        if(guestNumber < 12) {
            setGuestNumber(currentNumber => currentNumber + 1);
            dispatch(setGuestNumberInStore({guestNumber: guestNumber + 1}));
        }
    }

    function decreaseGuestsCount() {
        if(guestNumber > 1) {
            setGuestNumber(currentNumber => currentNumber - 1);
            dispatch(setGuestNumberInStore({guestNumber: guestNumber - 1}));
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.iconAndTextContainer}>
                <Ionicons name="people" size={22} color={Colors.PRIMARY}></Ionicons>
                <Text style={styles.text}>Choose Number of Guests</Text>
            </View>
            <View style={styles.guestsContainer}>
                <GuestNumberUpdator name="remove" onPress={decreaseGuestsCount}/>
                <Text style={styles.guests}>{guestNumber}</Text>
                <GuestNumberUpdator name="add" onPress={increaseGuestsCount}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 14,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    iconAndTextContainer: {
        flexDirection: "row"
    },
    text: {
        marginLeft: 10,
        color: "white",
        fontSize: 18,
        textAlign: "center"
    },
    guestsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#474747",
        height: 40,
        width: 110,
        padding: 8,
        borderRadius: 6
    },
    guests: {
        width: 30,
        height: 24,
        textAlign: "center",
        backgroundColor: "rgba(0,0,0,0.4)",
        // marginHorizontal: 8,
        color: "white",
        fontSize: 18,
        // borderRadius: 4
    }
});