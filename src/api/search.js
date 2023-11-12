import axios from "axios";
const instance = axios.create({
    baseURL: "http://localhost:8080/api",
});

export const getSearchResult = async (keyword) => {
    return await instance.post("public/search", keyword);
}

export const getTotalPages = async (keyword, page, sortOption) => {
  return await instance.post("public/search", { keyword, page, sortOption});
}