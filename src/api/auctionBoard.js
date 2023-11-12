import axios from "axios";
import { async } from "q";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
});

export const getAuctionBoard = async () => {
  return null;
};

// Hot 게시글로 정렬
export const getHotList = async () => {
  return await instance.get("public/auction/hot");
};

export const getList = async () => {
  return await instance.get("public/auction/sortedt");
};

// New 게시글로 정렬
export const getNewList = async () => {
  return await instance.get("public/auction/new");
};

// 카테고리 불러오기
export const getCategories = async () => {
  return await instance.get("public/category");
};


export const getPostitem = async (id) => {
  return await instance.get(`public/auction/${id}`);
};

// 댓글 불러오기
export const getComments = async (auctionNo) =>{
  return await instance.get(`public/${auctionNo}/comment`);
};


// 댓글 한개 불러오기
export const getreComments = async (commentNo, auctionNo) =>{
  return await instance.get(`public/${commentNo}/${auctionNo}/recomment`);
};

// 게시글 리스트 불러오기
export const getItem = async (page, category, sortOption) => {
  let url = `public/auction?page=${page}`;
  if (category !== null) {
    url += `&category=${category}`;
  }
  if (sortOption !== null) {
    url += `&sortOption=${sortOption}`;
  }
  return await instance.get(url);
};

