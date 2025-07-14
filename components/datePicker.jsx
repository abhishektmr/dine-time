import DateTimePicker from "@react-native-community/datetimepicker";

export default function DatePicker({bookingDate, minDate, maxDate, handleDateSelection}) {
    return (
        <DateTimePicker
            value={bookingDate}
            mode="date"
            display="default"
            onChange={handleDateSelection}
            minimumDate={minDate}
            maximumDate={maxDate}
        />
    );
}