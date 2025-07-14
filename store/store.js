import { configureStore } from "@reduxjs/toolkit";
import bookngReducer from "./bookingSlice";
import restaurantReducer from "./restaurantSlice";

const restaurantStore = configureStore({
    reducer: {
       restaurantStore:  restaurantReducer,
       bookingStore: bookngReducer
    }
})

export default restaurantStore;