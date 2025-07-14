import { StyleSheet, Text, TextInput, View } from "react-native";
import { Colors } from "../assets/colors";

export default function AuthInput({ label, textInputConfig}) {

    return (
        <View>
            <Text style={styles.text}>{label}</Text>
            <TextInput style={styles.input} {...textInputConfig}></TextInput>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        fontSize: 18,
        color: Colors.PRIMARY,
        marginBottom: 2
    },
    input: {
        color: "white",
        borderRadius: 8,
        borderWidth: .75,
        borderColor: "white"
    }
});