import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import restaurantStore from "../store/store";

export default function RootLayout() {
    const segments = useSegments(); // gives current route segments
    const router = useRouter();
    const hasRedirectedRef = useRef(false);

    useEffect(() => {
        console.log("entered useEffect with segments ", segments);
        ( async () => {
            const userDataStr = await AsyncStorage.getItem("userData");
            const isGuestStr = await AsyncStorage.getItem("isGuest");
            console.log("userDataStr ", !!userDataStr);
            const isLoggedIn = !!userDataStr;
            const isGuest = !!isGuestStr;
            console.log("isLoggedIn ", isLoggedIn);
            console.log("isGuest ", isGuest);
        
            console.log(segments);
            const isTryingAuthGroup = segments[0] === "(auth)" || segments[0] === undefined; // You're either in auth or at the root (/ or app/index.jsx)
            // const isTryingTabGroup = segments[0] === "(tabs)" && segments[1] === "home";

            // console.log("isTryingAuthGroup ", isTryingAuthGroup);
            // console.log("isTryingTabGroup ", isTryingTabGroup);

            if (!isLoggedIn && !isGuest && !isTryingAuthGroup) {
                console.log("sending to home screen");
                router.replace("/"); // route them to home screen 
            }

            // if ((!isLoggedIn && !isTryingAuthGroup) || (isGuest && !isTryingTabGroup)) {
            //     console.log("sending to auth screen");
            //     router.replace("/"); // unauth users can't go to app screens. Route them to /index.jsx => ask them to signup/signin 
            // }
        })();
    }, [segments]);

    // useEffect(() => {
    //     if(!isReady) {
    //         return;
    //     }

    //     console.log(segments);
    //     const inAuthGroup = segments[0] === "(auth)" || segments[0] === undefined; // You're either in auth or at the root (/ or app/index.jsx)

    //     console.log("isLoggedIn from second effect ", isLoggedIn);
    //     console.log("inAuthGroup from second effect ", inAuthGroup);

    //     if (isLoggedIn && inAuthGroup) {
    //         router.replace("/home"); // logged-in users can't stay in auth/index, route them to home screen 
    //     }

    //     if (!isLoggedIn && !inAuthGroup) {
    //         router.replace("/"); // unauth users can't go to app screens. Ask them to signup/signin 
    //     }

    // }, [isReady, segments]);

    return (
        <Provider store={restaurantStore}>
            <Stack screenOptions={{ headerShown: false}}>
            </Stack>
        </Provider>
    );
    
}