import { createSlice } from "@reduxjs/toolkit";

const academyStatus = createSlice({
    name: "academy status",
    initialState: {
        items: [],
    },
    reducers: {
        addStatus: (state, action) => {
            state.items.push(action.payload);
        },
    },
});

export const {addStatus} = academyStatus.actions;
export default academyStatus.reducer;