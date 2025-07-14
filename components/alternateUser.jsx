import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../assets/colors";

export default function AlternateUser({ text, textSuffix, onPress }) {

    const router = useRouter();
    return (
        <View>
            <TouchableOpacity style={{ flexDirection: "row"}} onPress={onPress}>
                <Text style={{ color: "white", fontSize:18}}>{ text }</Text>
                <Text style={{ color: Colors.PRIMARY, textDecorationLine: "underline", fontSize: 20}}>{ textSuffix }</Text>
            </TouchableOpacity>
        </View>
    );
}