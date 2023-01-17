import { createSlice } from "@reduxjs/toolkit";
var exercisesLocal = require('../exercisesLocal.json');

const initialState = {
    templateArr: [],
    fixTempArr: [],
    exerciseArr: exercisesLocal,
    workoutObj: {},
};

export const workoutSlice = createSlice({
    name: 'workout',
    initialState,
    reducers: {
        updateTemp: (state, action)=> {
            state.templateArr = action.payload;
        },
        updateWorkoutObj: (state, action) => {
            state.workoutObj = action.payload;
        }
    }
});

export const { updateTemp, updateWorkoutObj } = workoutSlice.actions;

export default workoutSlice.reducer;