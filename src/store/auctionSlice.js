import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPost } from "../api/addpost";

const asyncAuctionInfo = createAsyncThunk(
  "auctionSlice/asyncAuctionNo",
  async (auctionNo) => {
    const result = await getPost(auctionNo);
    // console.log(result.data);
    return result.data;
  }
);
const auctionSlice = createSlice({
  name: "auctionSlice",
  initialState: [],
  reducers: {},
  reducers: {
    auctionSave: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(asyncAuctionInfo.fulfilled, (state, action) => {
      localStorage.setItem("auction", JSON.stringify(action.payload));
      // console.log(action.payload);
      return action.payload;
    });
    builder.addCase(asyncAuctionInfo.rejected, (state, action) => {
      console.error("경매 정보를 불러오는 중 오류 발생:", action.error);
    });
  },
});
export default auctionSlice;
export { asyncAuctionInfo };
export const { auctionSave } = auctionSlice.actions;
