import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userGamesReducer from './slices/userGamesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    userGames: userGamesReducer,
  },
});
