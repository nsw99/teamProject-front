import {configureStore} from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import searchSlice from "./searchSlice";
import cookieSlice from "./auctionSlice";

const store = configureStore({
    reducer: {
        user: userSlice.reducer,   
        search: searchSlice.reducer,
        auction: cookieSlice.reducer        
    }

});
export default store;


