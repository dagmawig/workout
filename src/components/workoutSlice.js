import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    templateArr: []
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        updateTemp: (state, action)=> {
            state.templateArr = action.payload;
        }
    }
});

export const { updateTemp} = workoutSlice.actions;

export default workoutSlice.reducer;