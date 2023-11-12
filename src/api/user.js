import axios from "axios";
const instance = axios.create({
  baseURL: "http://localhost:8080/api",
});

// 로그인
export const login = async (data) => {
  return await instance.post("/public/signin", data);
};

// token에 해당하는 사용자 불러오기 API
export const userInfo = async(token) =>{  
  return await instance.get("/user/show",{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// 사용자 정보 업데이트 API
export const updateUser = async (data) => {
  const token = localStorage.getItem("token");    
  try {
    return await instance.put("/user/updateuser", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("API 에러 발생:", error);
    throw error;
  }
};

export const getUserData = async (id) => {
  try {
    const response = await instance.get(`/user/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user data: " + error);
    throw error;
  }
};


// interest 가져오기
export const getInterest = async () => {
  return await instance.get(`/interest`);
}

// 게시글 관심 등록
export const addMyInterest = async (auctionNo) => {
  try {
    const token = localStorage.getItem("token");
    console.log(auctionNo);    
    const response = await instance.post(`/user/addList`, auctionNo, {      
      headers: {
        Authorization: `Bearer ${token}`,        
      },
    });

    return response.data;
  } catch (error) {
    // 에러 처리
    console.error("에러 발생:", error);
    throw error;
  }
};

// 게시글 관심등록 중복확인
export const interestDuplicate = async (no) =>{

  const token = localStorage.getItem("token");
  const response = await instance.post("/user/interestDuplicate", no,{
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
  return response;
}

// 관심 등록한 게시글 삭제
export const deleteCheck = async (auctionNo) => {
  console.log("관심 = " + auctionNo);
  const token = localStorage.getItem("token");
  const response = await instance.delete(`/user/checkDelete?auctionNo=${auctionNo}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log("관심 = " + response.data);
  return response.data;
};


// 관심 등록한 게시글 List 삭제
export const deleteCheckList = async (list) => {

  const token = localStorage.getItem("token");

  await instance.delete(`/user/checkDeleteList?list=${list.join(',')}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

};


// 관심 등록한 게시글 List 가져오기
export const getMyInterestList = async () => {

  try {
    const token = localStorage.getItem("token");

    const response = await instance.get(`/user/myInterestList`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // 에러 처리
    console.error('에러 발생:', error);
    throw error;
  }

};


// 비밀번호 맞는지 확인 API
export const passwordCheck = async (password) => {
  const token = localStorage.getItem("token");
  console.log(password);
  return await instance.post("/user/pwdCheck", password, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// 회원가입
export const addUser = async (data) => {
  return await instance.post("/public/create", data);
};

// 아이디 중복 확인
export const idDuplicate = async (data) => {
  return await instance.post("/public/idDuplicate", data);
}
// 닉네임 중복 확인
export const nickDuplicate = async (data) =>{
  return await instance.post("/public/nickDuplicate",data);
}

// 비밀번호 잃어버렸을때 임시 비밀번호로 업데이트
export const updatePassword = async (data) => {
  return await instance.put("/public/updatePassword", data);
}

// 사용자가 비밀번호 변경
export const changePassowrd = async (password) =>{
  const token = localStorage.getItem("token");
  return await instance.put("/user/pwdUpdate",password,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const updatePoint = async (data) =>{
  const token = localStorage.getItem("token");
  console.log(token);
  console.log(data);    
  return await instance.put("/user/point",data,{
      headers: {
          Authorization: `Bearer ${token}`,
      },
  });
}

  export const updatebuyerPoint = async (data) =>{
    const token = localStorage.getItem("token");    
    return await instance.put("/user/buyerPoint",data,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
}


