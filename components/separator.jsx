import { Text, View } from "react-native";
import { Colors } from "../assets/colors";

export default function Separator({ separator }) {
    return (
        <View style={{ flexDirection: "row", margin: 20 }}>
            <View style={{ width: "20%", borderBottomWidth: 1, borderBottomColor: Colors.PRIMARY }}></View>
            <Text style={{ marginLeft: 6, marginRight: 6, color: "white", textAlign: "center" }}> {separator} </Text>
            <View style={{ width: "20%", borderBottomWidth: 1, borderBottomColor: Colors.PRIMARY }}></View>                    
        </View>
    );
}