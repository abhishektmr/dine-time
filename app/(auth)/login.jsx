import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useState } from "react";
import { Alert, Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors";
import logo from "../../assets/images/dinetimelogo.png";
import frame from "../../assets/images/Frame.png";
import AlternateUser from "../../components/alternateUser";
import AuthInput from "../../components/authInput";
import CustomButton from "../../components/customButton";
import Separator from "../../components/separator";
import { auth } from "../../config/firebaseConfig";

export default function Login() {

    const [input, setInput] = useState({
        email: '',
        pwd: ''
    })

    const router = useRouter();
    const db = getFirestore();
    
    function handleInputChange(type, enteredText) {
        setInput(currentInput => {
            return (
                {
                    ...currentInput,
                    [type]: enteredText
                }
            );
        })
    }

    async function handleLogIn() {
        try {
            const userCredentials = await signInWithEmailAndPassword(auth, input.email, input.pwd);
            const user = userCredentials.user;
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if(userDoc.exists()) {
                const userData = {email: userDoc.data().email, name: userDoc.data().name};
                await AsyncStorage.setItem("userData", JSON.stringify(userData));
                await AsyncStorage.removeItem("isGuest");
                router.replace("/home");
            }
        } catch(error) {
            console.log("Sign in error ", error);
            if(error.code === "auth/invalid-credential") {
                Alert.alert("Sign in failed.",
                            "Invalid email/password.",
                            [{ text: "OK"}]
                );
            } else {
                Alert.alert("Sign in error.",
                            "Please try again in some time.",
                            [{ text: "OK"}]
                );
            }
        }    
    }

    async function handleGuestUser() {
        await AsyncStorage.setItem("isGuest", "true");
        router.replace("/home")
    }

    return (
        <SafeAreaView style={styles.safeAreaContainer}>
            <View style={{ height: "100%" }}>
    
            <View style={styles.container}>
                <Image source={logo} style={styles.image}/>
                               
                <View style={{ width: "70%", gap: 20}}>
                    <AuthInput label="Email" textInputConfig={{value: input.email, onChangeText: (enteredText) => handleInputChange("email", enteredText)}}></AuthInput>
                    <AuthInput label="Password" textInputConfig={{value: input.pwd, secureTextEntry: true, onChangeText: (enteredText) => handleInputChange("pwd", enteredText)}}></AuthInput>
                </View>
                <View style={[styles.signInContainer]}>
                    <CustomButton buttonStyle={styles.signInButtonStyle}
                        buttonText="Sign In" 
                        buttonTextStyle={styles.signInText} 
                        onPress={handleLogIn}>
                    </CustomButton>
                </View>

                <Separator separator="Or"/>

                <AlternateUser text="Use as " textSuffix="Guest User" onPress={handleGuestUser}/>
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
        justifyContent: "center",
        alignItems: "center",
        // padding: 40
    },
    image: {
        width: 200,
        height: 150
    },
    signInContainer: {
        width: "70%",
        marginTop: 50
    },
    signInButtonStyle: {
        backgroundColor: Colors.PRIMARY, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: Colors.SECONDARY, 
        borderRadius: 14
    },
    signInText: {
        textAlign: "center",
        fontSize: 16, 
        fontWeight: "bold", 
        color: "black"       
    },
});