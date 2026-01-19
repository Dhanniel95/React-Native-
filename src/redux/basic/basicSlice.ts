import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import bookService from '../book/bookService';
import basicService from './basicService';
import { displayError } from '../../utils/display';

const initialState = {
    notiList: [],
    transportFee: 0,
    onboarded: false,
};

export const listNotifications = createAsyncThunk(
    'basic/notifications',
    async () => {
        try {
            let res = await basicService.listNotifications();
            return res?.data;
        } catch (error: any) {}
    },
);

export const getTransport = createAsyncThunk('basic/transport', async () => {
    try {
        let res = await bookService.transportInfo();
        console.log(res, 'RESS');
        if (res?.price) {
            return res.price / 100;
        } else {
            return 0;
        }
    } catch (error: any) {
        console.log(displayError(error, false), 'From Transport');
    }
});

const basicSlice = createSlice({
    name: 'basic',
    initialState,
    reducers: {
        clearNoti: state => {
            state.notiList = [];
        },
        onboardAcc: state => {
            state.onboarded = true;
        },
    },
    extraReducers(builder) {
        builder.addCase(listNotifications.fulfilled, (state, action) => {
            state.notiList = action.payload;
        });
        builder.addCase(getTransport.fulfilled, (state, action) => {
            state.transportFee = action.payload || 0;
        });
    },
});

export const { clearNoti, onboardAcc } = basicSlice.actions;

export default basicSlice.reducer;
