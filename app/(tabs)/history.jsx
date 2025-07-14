import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/colors";
import CustomButton from "../../components/customButton";
import { db } from "../../config/firebaseConfig";

export default function History() {

    const router = useRouter();
    const[loading, setLoading] = useState(true);
    const[userData, setUserData] = useState(null); 
    const[bookings, setBookings] = useState([]);

    useFocusEffect(useCallback(() => {
        let isActive = true;

        (async () => {
            if(isActive) {
                console.log("focus on");
                const userDataStr = await AsyncStorage.getItem("userData");
                var userDataObj;
                try {
                    userDataObj = JSON.parse(userDataStr);
                    setUserData(userDataObj);
                } catch(error) {
                    console.log("Error fetching userData ", error);
                }
                if(userDataObj?.email != null) {
                    console.log("bookings wala async ka usedData not null");
                    // userData exists AND userData.email is not null
                    const bookings = await getBookingsByEmail(userDataObj.email);
                    setBookings(bookings); 
                }
                setLoading(false);
            }
        })();

        return () => {
            isActive = false;
            console.log("focus off");
        }

        }, [])
    );

    // useEffect(() => {
    //     console.log("bookings wala useEffect");
    //     (async() => {
    //         console.log("bookings wala async");
    //         const userDataStr = await AsyncStorage.getItem("userData");
    //         var userDataObj;
    //         try {
    //             userDataObj = JSON.parse(userDataStr);
    //             setUserData(userDataObj);
    //         } catch(error) {
    //             console.log("Error fetching userData ", error);
    //         }
    //         if(userDataObj?.email != null) {
    //             console.log("bookings wala async ka usedData not null");
    //             // userData exists AND userData.email is not null
    //             const bookings = await getBookingsByEmail(userDataObj.email);
    //             setBookings(bookings); 
    //         }
    //         setLoading(false);
    //     })();

    //     return () => {
    //         console.log("on screen unmount bookings");
    //         // setUserData(null);
    //     }
    // }, []);

    const getBookingsByEmail = async(email) => {
        try{
            const bookingsRef = collection(db, "booking");
            const q = query(bookingsRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            const bookings = [];

            querySnapshot.forEach(doc => {
                bookings.push({ id: doc.id, ...doc.data() });
            });

            return bookings;
        } catch(error) {
            console.error("Error fetching bookings: ", error);
            return [];
        }
    }

    const closeModal = () => {
        setLoading(false);
        router.back()
    }

    const renderItem = ({ item }) => {
        return <View style={{ backgroundColor: "#474747", borderRadius: 6, padding: 8, margin: 10 }}>
            <Text style={{fontSize: 22, color: Colors.PRIMARY}}>{item.restaurant}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between"}}>
                <Text style={{ fontSize: 18, color: "white"}}>{item.bookingDate}</Text>
                <Text style={{ fontSize: 18, color: "white"}}>{item.slotTiming}</Text>
            </View>
            
        </View>
    }

    return <>
        {
            loading ? <Modal visible={loading} transparent={false}> 
                <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                    <View style={{ backgroundColor: Colors.SECONDARY, padding: 30, elevation: 24, borderRadius: 10 }}>
                        <ActivityIndicator size={50} animating={true}/>
                        <Text style={{ fontSize: 22, color: Colors.PRIMARY }}>Fetching your bookings...</Text>
                        <TouchableOpacity onPress={closeModal} style={{ marginTop: 20, alignSelf: "center", backgroundColor: Colors.PRIMARY, borderRadius: 6, elevation: 24}}>
                            <Text style={{ color: "white", size: 20, fontWeight: 'bold', padding: 10 }}>Cancel</Text>
                        </TouchableOpacity>
                    </View>                            
                </View>
                </Modal>
                :
                <SafeAreaView edges={['top']} style={{flex:1, paddingBottom:0, backgroundColor: Colors.SECONDARY}}>
                    <View style={{ flex: 1, marginTop: 20, justifyContent: "center", alignItems: "center" }}>
                {
                    userData == null ? <View>
                                        <Text style={{ color: Colors.PRIMARY, fontSize: 20, marginBottom: 20 }}>You need to login to see your bookings.</Text> 
                                         <CustomButton buttonText="Login"
                                                    buttonStyle={{alignSelf: "center", padding: 8, borderRadius: 6, backgroundColor: Colors.PRIMARY}} 
                                                    buttonTextStyle={{ color: "white", fontSize: 20}}
                                                    onPress={() => router.navigate("/login")} />
                                       </View>
                    : 
                    bookings.length > 0 ? <View style={{flex: 1, margin: 20, width: "90%", padding: 10, backgroundColor: Colors.dark.tint, borderRadius: 6 }}>
                        <FlatList
                            data={bookings}
                            renderItem={renderItem}
                            keyExtractor={booking => booking.id}
                        />
                        </View>
                        :
                        <View>
                            <Text style={{ color: Colors.PRIMARY, fontSize: 20, marginBottom: 20 }}>We're sorry,  you have no bookings.</Text>
                            <CustomButton buttonText="Book A Table Now"
                                         buttonStyle={{alignSelf: "center", padding: 8, borderRadius: 6, backgroundColor: Colors.PRIMARY}} 
                                         buttonTextStyle={{ color: "white", fontSize: 20}}
                                         onPress={() => router.navigate("/home")} />
                        </View>
                }
                </View>
                 </SafeAreaView>
                

        }
    </>
}