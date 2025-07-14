import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../../assets/colors";
import { auth } from "../../config/firebaseConfig";

export default function Profile() {

    const[userData, setUserData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const userDataStr = await AsyncStorage.getItem("userData");
            try{
                setUserData(JSON.parse(userDataStr));
            } catch(error) {
                console.log("Invalid JSON string ", userDataStr);
                setUserData(null);
            }
        })();
    }, []);

    const handleLogout = async() => {
        try{
            await signOut(auth);
            await AsyncStorage.removeItem("userData");
            await AsyncStorage.removeItem("isGuest");
            setUserData(null);
            Alert.alert("Logged out", "You've been logged out successfully.")
            router.replace("/login");
        } catch(error) {

        }
        
    }

    return <View style={styles.container}>
            <Text style={{ fontSize: 24, color: Colors.PRIMARY, marginBottom: 10 }}>User Profile</Text>
            {
                userData ? <>
                                <Text style={{ fontSize: 20, color: "white", marginBottom: 20 }}>Email: {userData.email}</Text>
                                <TouchableOpacity style={{ backgroundColor: Colors.PRIMARY, borderRadius: 6 }} onPress={handleLogout}>
                                    <Text style={{ fontSize: 22, textAlign: "center", fontWeight: "bold", padding: 10}}>Logout</Text>
                                </TouchableOpacity>
                            </>
                            : <View style={{flexDirection: "row"}}>
                                <TouchableOpacity style={{ width: "100%", backgroundColor: Colors.PRIMARY, borderRadius: 6 }} onPress={() => router.navigate("/signup")}>
                                    <Text style={{ fontSize: 22, textAlign: "center", fontWeight: "bold", padding: 10}}>Sign up</Text>
                                </TouchableOpacity>
                            </View>
            }
        </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        backgroundColor: "#2b2b2b"
    }
});