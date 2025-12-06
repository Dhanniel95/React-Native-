import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    userChatRoomId: '',
    consultantChat: {} as any,
    usersOnline: [],
};

export const saveChatId = createAsyncThunk(
    'chat/roomId',
    async (id: string) => {
        try {
            return id;
        } catch (error: any) {
            return '';
        }
    },
);

export const consultantChatting = createAsyncThunk(
    'chat/consultantChat',
    async (data: any) => {
        try {
            return data;
        } catch (error: any) {
            return '';
        }
    },
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        updateOnlineUsers: (state, action) => {
            state.usersOnline = action.payload;
        },
    },
    extraReducers(builder) {
        builder.addCase(saveChatId.fulfilled, (state, action) => {
            state.userChatRoomId = action.payload;
        });
        builder.addCase(consultantChatting.fulfilled, (state, action) => {
            state.consultantChat = action.payload;
        });
    },
});

export const { updateOnlineUsers } = chatSlice.actions;

export default chatSlice.reducer;
