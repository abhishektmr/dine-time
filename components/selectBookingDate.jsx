import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";
import { Colors } from "../assets/colors";
import { setBookingDateInStore } from "../store/bookingSlice";
import CustomButton from "./customButton";
import DatePicker from "./datePicker";

export default function SelectBookingDate() {
    const dispatch = useDispatch();
    const [bookingDate, setBookingDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(minDate.getDate() + 7); // 7 days in future

    function handleDateSelection(event, date) {
        setShowDatePicker(false);
        if(event.type === 'set' && date)
            setBookingDate(date);
            dispatch(setBookingDateInStore({bookingDate: date.toLocaleDateString()}));
    }
    
    return (
        <View style={styles.dateBooking}>
            <View style={{flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <Ionicons name="calendar" size={22} color={Colors.PRIMARY}/>
                <Text style={{ color: "white", marginLeft: 10, fontSize: 18 }}>Select Booking Date </Text>
            </View> 
            <CustomButton buttonStyle={styles.dateButton} buttonText={bookingDate.toLocaleDateString()} 
                    buttonTextStyle={{ color: "white", fontSize: 18 }} onPress={() => setShowDatePicker(true)}>
            </CustomButton>
            {
                showDatePicker && <DatePicker
                    bookingDate={bookingDate}
                    minDate={minDate}
                    maxDate={maxDate}
                    handleDateSelection={handleDateSelection}>
                </DatePicker>
            }
        </View>
    );
}

const styles = StyleSheet.create({ 
    dateBooking: {
        marginTop: 6,
        padding: 2,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    dateButton: {
        height: 40,
        width: 110,
        padding: 8,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#474747",
        borderRadius: 6
    }
});