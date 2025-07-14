import { Text, TouchableOpacity } from "react-native";

export default function CustomButton({ buttonStyle, buttonText,  buttonTextStyle, onPress, disabled}) {
    return (
        <TouchableOpacity style={buttonStyle} onPress={onPress} disabled={disabled}>
            <Text style={buttonTextStyle}>{buttonText}</Text>
        </TouchableOpacity>
    );
}