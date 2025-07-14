import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, Image, ImageBackground, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { Colors } from "../../assets/colors";
import logo from "../../assets/images/dinetimelogo.png";
import banner from "../../assets/images/homeBanner.png";
import restaurantData from "../../data/restaurants";
import { setAllRestaurants } from "../../store/restaurantSlice";

export default function Home() {
    const router = useRouter();
    const[restaurants, setRestaurants] = useState([]);
    const [userData, setUserData] = useState({});
    const dispatch = useDispatch();
    
    useEffect(() => {
        console.log("Home screen");
        // Read from DB instead
        const restaurantsData = getRestaurants();
        setRestaurants(restaurantsData);

        // Save in redux
        dispatch(setAllRestaurants({ restaurants: restaurantsData }));

        (async () => {
            const userDataFromStorage = await getUserDataFromAsyncStorage();
            setUserData(userDataFromStorage);
        })();
    }, [restaurants]);

    // Read from DB
    function getRestaurants() {
        return restaurantData;
    }

    async function getUserDataFromAsyncStorage() {
        const userDataStr = await AsyncStorage.getItem("userData");
        try{
            return JSON.parse(userDataStr);
        } catch(error) {
            console.log("Invalid JSON string ", userDataStr);
            return null;
        } 
    }

    function renderRestaurants(restaurantsWrapper) {
        const restaurant = restaurantsWrapper.item;
        return (
            <View style={styles.restaurantCardContainer}>
                <TouchableOpacity onPress={() => router.navigate(`/restaurant/${restaurant.name}`)}>
                    <Image resizeMode="cover" source={{uri: restaurant.image}} style={styles.restaurantImage}/>
                    <Text style={[styles.restaurantDetailText, {fontWeight: "bold", marginBottom: 5}]}>{restaurant.name}</Text>
                    <Text style={styles.restaurantDetailText}>{restaurant.address}</Text>
                    <Text style={styles.restaurantDetailText}>Open: {restaurant.opening} - Close: {restaurant.closing}</Text>
                </TouchableOpacity>
            </View>   
        );
    }

    return (
        <SafeAreaView style={[{ backgroundColor: Colors.SECONDARY }, Platform.OS === 'android' && {paddingBottom: 40}]}>
            <View style={{justifyContent: "center", alignItems: "center"}}>
                <View style={styles.welcomeTile}>
                    <Text style={[styles.welcomeText, {marginLeft: 10, color: Colors.PRIMARY}]}>{userData && `${userData.name}, `}</Text>
                    <Text style={styles.welcomeText}>Welcome To </Text>
                    <Image source={logo} style={styles.welcomeImage}></Image>
                </View>
            </View>
            <ScrollView style={{marginTop: 10}}>
                <ImageBackground source={banner} resizeMode="cover" style={styles.imageBackground} >
                    <BlurView intensity={100} tint="dark" style={styles.blur}>
                        <Text style={styles.blurText}>Dine with your loved ones</Text>
                    </BlurView>
                </ImageBackground>
                <Text style={styles.discountText}>Special Discount %</Text>
            {
                restaurants.length > 0 ? <FlatList
                    data={restaurants}
                    renderItem={renderRestaurants}
                    keyExtractor={restaurant => restaurant.name}
                    horizontal
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    // contentContainerStyle={{padding: 10, borderRadius: 20}}
                />: <ActivityIndicator/>
            }
                <Text style={styles.ourRestaurants}>Our Restaurants</Text>
            {
                restaurants.length > 0 ? <FlatList
                    data={restaurants}
                    renderItem={renderRestaurants}
                    keyExtractor={restaurant => restaurant.name}
                    horizontal
                    scrollEnabled={true}
                    showsHorizontalScrollIndicator={false}
                    // contentContainerStyle={{padding: 10, borderRadius: 20}}
                />: <ActivityIndicator/>
            }
            
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    welcomeTile: {
        flexDirection: "row",
        borderRadius: 6,
        padding: 20,
        width: "90%",
        backgroundColor: "#5f5f5f",
        alignItems: "center",
        justifyContent: "center"
    },
    welcomeText: {
        paddingBottom: 4,
        textAlign: "center",
        color: "white",
        fontSize: 28,
        fontWeight: "bold"
    },
    welcomeImage: {
        height: 40,
        width: 120
    },
    imageBackground: {
        width: "100%",
        height: 200,
        alignItems: "center",
        justifyContent: "center",
    },
    blur: {
        width: "100%",
        padding: 12
    },
    blurText: {
        color: "white",
        fontSize: 28,
        textAlign: "center",
        fontWeight: "bold"
    },
    discountText: {
        padding: 10,
        fontSize: 26,
        color: "white",
        fontWeight: "bold"
    },
    restaurantCardContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: "#5f5f5f",
        borderRadius: 6,
        maxHeight: 250, 
        maxWidth: 200       
    },
    restaurantImage: {
        height: 120, 
        width: 180,
        borderRadius: 6,
        marginBottom: 1
    },
    restaurantDetailText: {
        color: "white",
        fontSize: 14
    },
    ourRestaurants: {
        padding: 10,
        fontSize: 26,
        color: Colors.PRIMARY,
        fontWeight: "bold"
    },
});