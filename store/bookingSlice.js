import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    restaurant: '',
    bookingDate: new Date().toLocaleDateString(),
    guestNumber: 2,
    slotTiming: ''
}

const bookingSlice = createSlice({
    name: "bookingSlice",
    initialState,
    reducers: {
        setAllBookingsInStore(state, action) {

        },
        setRestaurantInStore(state, action) {
            state.restaurant = action.payload.restaurant;
        },
        setBookingDateInStore(state, action) {
            state.bookingDate = action.payload.bookingDate;
        },
        setGuestNumberInStore(state, action) {
            state.guestNumber = action.payload.guestNumber;
        },
        setSlotTimingInStore(state, action) {
            state.slotTiming = action.payload.slotTiming;
        }
    }
});

export default bookingSlice.reducer;
export const{ setRestaurantInStore, setBookingDateInStore, setGuestNumberInStore, setSlotTimingInStore} = bookingSlice.actions;
