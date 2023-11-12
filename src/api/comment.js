import axios from "axios";

const token = localStorage.getItem("token");

const instance = axios.create({
  baseURL: "http://localhost:8080/api/",
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const postComment = async (data) => {
  console.log(data+"댓글추가테스트");
  return await instance.post(`user/comment/${data.auctionNo}`, data);
};

export const putComment = async (data) => {
  return await instance.put("/user/comments", data);
};

export const delComment = async (id) => {
  return await instance.delete("user/comment/" + id);
};
