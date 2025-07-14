import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Colors } from "../../assets/colors";

export default function TabLayout() {
    return <Tabs screenOptions={{
        headerShown: false, 
        tabBarActiveTintColor: Colors.PRIMARY, 
        tabBarInactiveTintColor: Colors.dark.text,
        tabBarStyle: {
            backgroundColor: Colors.SECONDARY,
            // paddingBottom: 14,
            // height: 100
        },
        tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold"
        }
        }}>
        <Tabs.Screen name="home" options={{ 
            title: "Home", 
            tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color}></Ionicons>}}/>

        <Tabs.Screen name="history" options={{
            title: "History",
            tabBarIcon: ({color}) => <Ionicons name="time" size={24} color={color}></Ionicons>}}/>

        <Tabs.Screen name="profile" options={{
            title: "Profile",
            tabBarIcon: ({color}) => <Ionicons name="person-sharp" size={24} color={color}></Ionicons>}} />
    </Tabs>
}