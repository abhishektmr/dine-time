import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    restaurants: []
}
const restaurantSlice = createSlice({
    name: 'restaurants',
    initialState,
    reducers: {
        setAllRestaurants(state, action) {
            state.restaurants = action.payload.restaurants;
        }
    }
});

export default restaurantSlice.reducer;
export const { setAllRestaurants } = restaurantSlice.actions;