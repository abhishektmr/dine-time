import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors";
import logo from "../../assets/images/dinetimelogo.png";
import frame from "../../assets/images/Frame.png";
import AlternateUser from "../../components/alternateUser";
import AuthInput from "../../components/authInput";
import CustomButton from "../../components/customButton";
import Separator from "../../components/separator";
import { auth, db } from "../../config/firebaseConfig";

export default function SignUp() {

    const router = useRouter();
        
    const [input, setInput] = useState({
        name: {
            value: '',
            error: '',
            touched: false
        },
        email: {
            value: '',
            error: '',
            touched: false
        },
        pwd: {
            value: '',
            error: '',
            touched: false
        }
    });

    const invalidInput = (input.name.error !== '' || input.name.value === '') 
                            || (input.email.error !== '' || input.email.value === '')
                            || (input.pwd.error !== '' || input.pwd.value === '');

    function handleInputChange(enteredText, inputType) {
        setInput(currentInput => {
            return {
                ...currentInput,
                [inputType]: {
                    ...currentInput[inputType],
                    value: enteredText
                }
            }
        })
    }

    function handleFocus(inputType) {
        setInput(currentInput => {
            return {
                ...currentInput,
                [inputType]: {
                    ...currentInput[inputType],
                    touched: false
                }
            }
        })
    }

    function handleBlur(inputType) {
        const error = validate(inputType);
        setInput(currentInput => {
            return {
                ...currentInput,
                [inputType]: {
                    ...currentInput[inputType],
                    error,
                    touched: true
                }
            }
        });
    }

    function validate(inputType) {
        const value = input[inputType].value;

        if(!value || value.trim() === '') {
            return 'This field is required.';
        }

        if(inputType === 'name') {
            return value.trim().length < 3 ? 'Minimum 3 characters required.' : '';
        } else if(inputType === 'email') {
            return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Invalid email format.' : '';
        } else if(inputType === 'pwd') {
            return value.trim().length < 8 ? 'Minimum 8 characters required.' : '';
        } else {
            return '';
        }
    }

    async function handleSignUp() {
        try {
            const userCredentials = await createUserWithEmailAndPassword(auth, input.email.value, input.pwd.value);
            const user = userCredentials.user;
            await setDoc(doc(db, "users", user.uid), {name: input.name.value, email: input.email.value, createdAt: new Date()});
            const userData = {name: input.name.value, email: input.email.value};
            await AsyncStorage.setItem("userData", JSON.stringify(userData));
            await AsyncStorage.removeItem("isGuest");
            router.replace("/home");
        } catch(error) {
            console.log("Error in signup", error);
            if(error.code === "auth/email-already-in-use") {
                Alert.alert("Signup Failed.", 
                            "This email is already in use. Please use a different one.",
                            [{ text: "OK" }]
                );
            } else {
                Alert.alert("Signup Error.",
                            "An unexpected error occured. Please try again later.",
                            [{ text: "OK" }]
                );
            }
        }
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={{ height: "100%" }}>
    
            <View style={styles.container}>
                <Image source={logo} style={styles.image}/>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>Let's get you started!</Text>
                </View>
                
                <View style={{ width: "70%" }}>
                    <AuthInput label="Name" 
                                textInputConfig= {{
                                    value: input.name.value,
                                    onChangeText: (text) => handleInputChange(text, "name"),
                                    onBlur: () => handleBlur("name"),
                                    onFocus: () => handleFocus('name')
                                }}
                            ></AuthInput>
                    {input.name.touched && input.name.error !== '' ? <Text style={styles.error}>{input.name.error}</Text> : null}
                    <AuthInput label="Email" 
                                textInputConfig= {{
                                    value: input.email.value,
                                    onChangeText: (text) => {handleInputChange(text, "email")},
                                    keyboardType: "email-address",
                                    onBlur: () => handleBlur("email"),
                                    onFocus: () => handleFocus('email')
                                }}
                            ></AuthInput>
                    {input.email.touched && input.email.error !== '' ? <Text style={styles.error}>{input.email.error}</Text> : null}
                    <AuthInput label="Password" 
                                textInputConfig={{
                                    value: input.pwd.value,
                                    onChangeText: (text) => handleInputChange(text, "pwd"),
                                    secureTextEntry: true,
                                    onBlur: () => handleBlur("pwd"),
                                    onFocus: () => handleFocus('pwd')
                                }}
                            ></AuthInput>
                    {input.pwd.touched && input.pwd.error !== '' ? <Text style={styles.error}>{input.pwd.error}</Text> : null}
                </View>
                <View style={[styles.signUpContainer]}>
                    <CustomButton buttonStyle={[styles.signUpButtonStyle, invalidInput ? {opacity: 0.5} : null]}
                        buttonText="Sign Up" 
                        buttonTextStyle={styles.signUpText}     
                        onPress={handleSignUp}
                        disabled={invalidInput ? true : false}>
                    </CustomButton>
                </View>

                <Separator separator="Or"/>

                <AlternateUser text="Already A user? " textSuffix="Sign In" onPress={() => router.navigate("/login")}/>
            </View>
            <View style={{flex: 1}}>
                <Image source={frame} style={{height: "100%", width: "100%"}} resizeMode="contain"/>
            </View>
            </View>
        </SafeAreaView>
    );
    
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        backgroundColor : Colors.SECONDARY
    },
    container: {
        flex: 2,
        //justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: 200,
        height: 150
    },
    textContainer: {
        marginBottom: 20
    },
    text: {
        color: "white",
        fontSize: 18,
    },
    signUpContainer: {
        width: "70%",
        marginTop: 50
    },
    signUpButtonStyle: {
        backgroundColor: Colors.PRIMARY, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: Colors.SECONDARY, 
        borderRadius: 14
    },
    signUpText: {
        textAlign: "center",
        fontSize: 16, 
        fontWeight: "bold", 
        color: "black"       
    },
    error: {
        color: "red",
        fontSize: 14
    }
});