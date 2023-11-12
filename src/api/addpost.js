import axios from "axios";
const token = localStorage.getItem("token");
// http://localhost:8080/api/
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// 카테고리 불러오기
export const getCategories = async () => {
  return await instance.get("/public/category");
};

// 최근 본 게시물
export const recentView = async () => {
  return await instance.get("/user/recentView");
};

// 게시글 추가
export const addPost = async (data) => {
  return await instance.post("/user/post", data);
};

// 게시글 조회
export const getPost = async (auctionNo) => {
  return await instance.get(`/user/auction/${auctionNo}`);
};

// 현재 가격 수정
export const updateCurrentPrice = async (auctionNo, newPrice) => {
  try {
    console.log(auctionNo);
    console.log(newPrice);
    const response = await instance.put(`/user/auction/${auctionNo}`, newPrice);
    return response.data;
  } catch (error) {
    console.error("현재 가격을 업데이트하는 중 오류 발생:", error);
    throw error;
  }
};

// 게시글 삭제
export const deletePost = async (auctionNo) => {
  try {
    const response = await instance.delete(`/user/auction/${auctionNo}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};

// 게시글 수정
export const updatePost = async (auctionNo, data) => {
  console.log(auctionNo);
  console.log(data);
  return await instance.put(`/user/auction/update/${auctionNo}`, data);
};

// 작성한 게시글 수 가져오기
export const getCountAuction = async (memberId) => {
  return await instance.get(`/public/auction/count?memberId=${memberId}`);
};

// 게시글 카테고리 번호 바꾸기
export const updatecategoryNo = async (no) => {
  return await instance.put(`/public/updateCategory?no=${no}`);
};
