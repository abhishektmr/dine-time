import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import { Colors } from "../assets/colors";
import { saveinDB } from "../util/firebaseRepo";
import AuthInput from "./authInput";
import CustomButton from "./customButton";

export default function ModalWithForm({ showModal, onClose}) {

    const bookingData = useSelector(state => state.bookingStore);
    const[input, setInput] = useState({
        name: {
            value: '',
            error: '',
            touched: false
        },
        phone: {
            value: '',
            error: '',
            touched: 'false'
        }
    });

    const handleInputChange = (enteredText, inputType) => {
        setInput(current => {
            return {
                ...current,
                [inputType]: {
                    ...current[inputType],
                    value: enteredText
                }
            }
        });
    }

    const handleFocus = (inputType) => {
        setInput(current => {
            return {
                ...current,
                [inputType]: {
                    ...current[inputType],
                    touched: false
                }
            }
        });
    }

    const handleBlur = (inputType) => {
        const error = validate(inputType);
        setInput(current => {
            return {
                ...current,
                [inputType]: {
                    ...current[inputType],
                    error,
                    touched: true
                }
            }
        });
    }

    const validate = (inputType) => {
        const value = input[inputType].value;

        if(!value || value.trim() === '') {
            return 'This field is required.';
        }

        if(inputType === 'name') {
            return value.trim().length < 3 ? 'Minimum 3 characters required.' : '';
        } else if(inputType === 'phone') {
            return value.trim().length < 10 || value.trim().length > 10 ? 'Not a valid phone number.' : '';
        } else {
            return '';
        }
    }

    const handleSubmit = async () => {
        try{ 
            const bookingObj = {
                ...bookingData,
                name: input.name.value,
                phone: input.phone.value
            };
            const success = await saveinDB("booking", bookingObj);
            if(success) {
                Alert.alert("Table Booked Successfully!",
                `We're ready to welcome you on ${bookingObj.bookingDate} at ${bookingObj.slotTiming}`,
                [{text: "OK"}]);
                // setInput({});
                onClose();
            } else {
                Alert.alert("We're sorry we couldn't book a table for you.",
                "Please try again later.",
                [{text: "OK"}]);
            }
        } catch(error) {
            console.error("Error in handleSubmit ", error);
        }
        
    }

    const disabled = (input.name.error != '' || !input.name.touched) || (input.phone.error != '' || !input.phone.touched);

    return (
        <Modal visible={showModal} transparent={true} animationType="slide">
                    <View style={styles.container}>
                        <View style={styles.closeContainer}>
                            <TouchableOpacity onPress={onClose} style={{ flexDirection: "row"}}>
                                <Text style={{ color: Colors.PRIMARY, fontSize: 20 }}>Close</Text>
                                <Ionicons name="close-sharp" color="white" size={24}></Ionicons> 
                            </TouchableOpacity>                       
                        </View>

                        {/* Form Begins */}  
                        <View style={styles.formContainer}>
                            <AuthInput label="Name"
                                        textInputConfig={{
                                            value: input.name.value,
                                            onChangeText: (enteredText) => handleInputChange(enteredText, 'name'),
                                            onFocus: () => handleFocus('name'),
                                            onBlur: () => handleBlur('name')
                                        }}
                                        ></AuthInput>
                            {input.name.touched && input.name.error!= '' ? <Text style={styles.error}>{input.name.error}</Text> : null}
                            <AuthInput label="Phone number"
                                        textInputConfig={{
                                            value: input.phone.value,
                                            onChangeText: (enteredText) => handleInputChange(enteredText, 'phone'),
                                            onFocus: () => handleFocus('phone'),
                                            onBlur: () => handleBlur('phone'),
                                            maxLength: 10,
                                            keyboardType: 'number-pad'
                                        }}
                                        ></AuthInput>
                            {input.phone.touched && input.phone.error!= '' ? <Text style={styles.error}>{input.phone.error}</Text> : null}
                            <CustomButton buttonStyle={[styles.buttonStyle, disabled ? {opacity: 0.5} : null]} 
                                            buttonText="Submit" 
                                            buttonTextStyle={styles.buttonTextStyle} 
                                            onPress={handleSubmit} 
                                            disabled={disabled}></CustomButton>
                        </View>
                    </View>
                </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: "#00000099",
        justifyContent: "flex-end"
    },
    closeContainer: {
        flexDirection: "row", 
        justifyContent: "flex-end", 
        backgroundColor: "#474747", 
        paddingTop: 10, 
        paddingRight: 10,
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10
    },
    formContainer: {
        backgroundColor: "#474747", 
        paddingHorizontal: 40, 
        paddingBottom: 20, 
        gap: 20
    },
    buttonStyle: {
        backgroundColor: Colors.PRIMARY,
        borderRadius: 6,
        padding: 10
    },
    buttonTextStyle: {
        fontSize: 18,
        fontWeight:"bold",
        textAlign: "center"
    },
    error: {
        color: "red",
        fontSize: 14
    }
});