import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../assets/colors";
import logo from "../assets/images/dinetimelogo.png";
import frame from "../assets/images/Frame.png";
import AlternateUser from "../components/alternateUser";
import CustomButton from "../components/customButton";
import Separator from "../components/separator";

export default function DefaultScreen() {

    const router = useRouter();

    async function handleGuestUserPress() {
        console.log("inside handleGuestUser");
        await AsyncStorage.setItem("isGuest", "true");
        router.replace("/home");
        console.log("exiting from handleGuestUser");
    }

    async function handleSignInPress() {
        await AsyncStorage.removeItem("isGuest");
        router.replace("/login");
    }

    return <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView contentContainerStyle={{height: "100%"}}>
            <View style={styles.container}>
                <Image source={logo} style={styles.image}/>

                <View style={styles.signUpContainer}>
                    <CustomButton buttonStyle={styles.signUpButtonStyle} 
                        buttonText="Sign Up" 
                        buttonTextStyle={styles.signUpText} 
                        onPress={() => router.replace("/signup")}>
                    </CustomButton>
                </View>
                <View style={styles.guestUserContainer}>
                    <CustomButton buttonStyle={styles.guestUserButtonStyle}
                        buttonText="Guest User"
                        buttonTextStyle={styles.guestUserText}
                        onPress={handleGuestUserPress}>
                    </CustomButton>
                </View>

                <Separator separator="Or"/>

                <AlternateUser text="Already A user? " textSuffix="Sign In" onPress={handleSignInPress}/>
            </View>
            <View style={{flex: 1}}>
                <Image source={frame} style={{height: "100%", width: "100%"}} resizeMode="contain"/>
            </View>
        </ScrollView>
    </SafeAreaView> 
    
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
        width: 380,
        height: 340
    },
    signUpContainer: {
        width: "70%"
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
    guestUserContainer: {
        marginTop: 10,
        width: "70%"
    },
    guestUserButtonStyle: {
        backgroundColor: Colors.SECONDARY, 
        padding: 10, 
        borderWidth: 1, 
        borderColor: Colors.PRIMARY, 
        borderRadius: 14
    },
    guestUserText: {
        color: "white",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "bold"
    }
});