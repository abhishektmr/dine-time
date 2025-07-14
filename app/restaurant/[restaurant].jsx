import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Image, Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Colors } from "../../assets/colors";
import ManageSlots from "../../components/manageSlots";
import SelectBookingDate from "../../components/selectBookingDate";
import SelectGuests from "../../components/selectGuests";
import { setRestaurantInStore } from "../../store/bookingSlice";

const screenWidth = Dimensions.get('window').width;

export default function Restaurant() {

    const {restaurant} = useLocalSearchParams();
    const [currentIndex, setCurrentIndex] = useState(0);
    
    const flatListRef = useRef(null);
    const dispatch = useDispatch();
    const restaurants = useSelector(state => state.restaurantStore.restaurants);
    const matchingRestaurant = getMatchingRestaurant();
    const images = matchingRestaurant["carouselImages"];
    const address = matchingRestaurant["address"];
    const slots = matchingRestaurant["slots"];

    useEffect(() => {
        dispatch(setRestaurantInStore({restaurant}))
    }, []);
    function getMatchingRestaurant() {
        return restaurants.filter(restaurantData => restaurantData.name == restaurant)[0];
    }
    
    function showPreviousImage() {
        var scrollToIndex;
        if(currentIndex > 0) {
            scrollToIndex = currentIndex - 1;
            setCurrentIndex(scrollToIndex);
        } else {
            scrollToIndex = images.length - 1;
            setCurrentIndex(scrollToIndex);
        }
        flatListRef.current.scrollToIndex({ index: scrollToIndex, animated: true});
    }

    function showNextImage() {
        var scrollToIndex;
        if(currentIndex < images.length - 1) {
            scrollToIndex = currentIndex + 1;
            setCurrentIndex(scrollToIndex);
        } else {
            scrollToIndex = 0;
            setCurrentIndex(scrollToIndex);
        }
        flatListRef.current.scrollToIndex({ index: scrollToIndex, animated: true});
    }

    async function showDirection () {
        const url = "https://maps.app.goo.gl/hPADxeQKbKDpdXm9A";
        const supported = await Linking.canOpenURL(url);
        if(supported) {
            await Linking.openURL(url);
        } else{
            console.log("Can not open url ", url);
        }
    }

    function renderCarouselImages({ item }) {
        return (
            <View style={ styles.container }>
                 <View style={styles.leftArrow}>
                     <Ionicons onPress={showPreviousImage} name="arrow-back" size={25} color="white"/>
                </View>
                <View style={styles.rightArrow}>
                     <Ionicons onPress={showNextImage} name="arrow-forward" size={25} color="white"/>
                </View>
                <View style={styles.dotsContainer}>
                    {
                        images.map((image, index) => (<View key={index} style={[styles.dots, index==currentIndex ? {height: 9, width: 9, borderRadius: 4.5} : null]}></View>))
                    }
                </View>
                <Image source={{ uri: item }} style={styles.image}/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ backgroundColor: Colors.SECONDARY, padding: 10 }}>
            <ScrollView style={{ height: "100%" }}>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontSize: 26, color: Colors.PRIMARY }}>{restaurant}</Text>
                    <View style={{ borderBottomColor: Colors.PRIMARY, borderBottomWidth: 2 }}></View>
                    <View style={ styles.carouselContainer }>
                        <FlatList
                            ref={flatListRef}
                            data={images}
                            renderItem={renderCarouselImages}
                            keyExtractor={item => item}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            scrollEnabled={false}
                        />
                    </View>
                </View>
                <View style={styles.locationContainer}>
                    <Ionicons style={{ marginTop: 4 }} onPress={showPreviousImage} name="location-sharp" size={25} color={Colors.PRIMARY}/>
                    <Text style={styles.address}>{address}{" "} | {" "}  
                        <Text onPress={showDirection} style={styles.directions}>Get Directions</Text>
                    </Text>
                </View>
                <View style={styles.timeContainer}>
                    <Ionicons style={{ marginTop: 4 }} name="time" size={22} color={Colors.PRIMARY}/>
                    <Text style={styles.timeText}>{matchingRestaurant.opening}{" - "}{matchingRestaurant.closing}</Text>
                </View>
                <View style={styles.bookingDateAndGuests}>
                    <SelectBookingDate/>
                    <SelectGuests/>
                </View>
                <ManageSlots slots={slots}/>                
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    carouselContainer: {
        marginVertical: 10,
        maxHeight: 260,
        width: "100%"
    },
    container: {
        height: 256, 
        width: screenWidth - 20, 
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        position: "relative"  
    },
    image: {
        resizeMode: "cover",
        height: 250,
        width: screenWidth - 24,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: "black"      
    },
    rightArrow: {
        backgroundColor: "grey", 
        borderRadius: 12.5, 
        position: "absolute",
        top: "46%",
        right: 10,
        zIndex: 10
    },
    leftArrow: {
        backgroundColor: "grey", 
        borderRadius: 12.5, 
        position: "absolute",
        top: "46%",
        left: 10,
        zIndex: 10
    },
    dotsContainer: {
        zIndex: 10,
        position: "absolute",
        bottom: 15,
        left: "42%",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    dots: {
        height: 5,
        width: 5,
        borderRadius: 3,
        backgroundColor: "white",
        marginHorizontal: 2
    },
    locationContainer: {
        flexDirection: "row",
        maxWidth: "75%"        
    },
    address: {
        marginLeft: 10,
        color: "white",
        fontSize: 18
    },
    directions: {
        color: Colors.PRIMARY,
        fontStyle:"italic",
        textDecorationLine: "underline"
    },
    timeContainer: {
        padding: 2,
        flexDirection: "row",
        marginTop: 10,
        maxWidth: "75%" ,
        alignItems: "center",
    },
    timeText: {
        marginLeft: 10,
        color: "white",
        fontSize: 18
    },
    bookingDateAndGuests: {
        marginTop: 18,
        borderWidth: 1,
        borderColor: Colors.PRIMARY,
        borderRadius: 10,
        padding: 18
    }
});