import { configureStore } from "@reduxjs/toolkit";
import userInfoSlice from "./userInfoSlice";
import academyStatus from "./academyStatus";

const store = configureStore({
    reducer: {
        user: userInfoSlice,
        acadmey: academyStatus,
    }
});

export default store;