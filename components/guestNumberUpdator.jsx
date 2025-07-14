import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "../assets/colors";

export default function GuestNumberUpdator({ onPress, name }) {
    return (
        <TouchableOpacity onPress={onPress} 
                          style={[styles.outline, name==="remove" ? {borderTopLeftRadius: 6, borderBottomLeftRadius: 6} 
                                                                  : {borderTopRightRadius: 6, borderBottomRightRadius: 6}]}>
            <Ionicons name={name} size={22} color={Colors.PRIMARY}></Ionicons>
        </TouchableOpacity>
    );
}

const styles= StyleSheet.create({ 
   outline: {
        width: 30,
        backgroundColor: "rgba(0,0,0,0.4)",
        alignItems: "center",
        borderColor: Colors.PRIMARY,
        borderWidth: .8
   }
});