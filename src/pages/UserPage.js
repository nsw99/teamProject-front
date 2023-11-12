import { useState, useEffect } from "react";
import styled from "styled-components";
import { BsPencilSquare } from "react-icons/bs";
import { FaMapLocationDot } from "react-icons/fa6";
import { updateUser } from "../api/user";
import DaumPostcode from '../components/DaumPostcode';
import { useDispatch } from "react-redux";
import { asyncLogin } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { userInfo, passwordCheck, changePassowrd } from "../api/user";

const Main = styled.div`
`;

const MyPage = styled.div`
  max-width: 1295px;
  min-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: center;

  .myPages {
    margin-top: 40px;
    width: 80%;
  }

  .my-names, .my-set, .my-list {
    margin: 0 auto;
    margin-top: 30px;
    margin-bottom: 30px;
    border: 1px solid black;
    border-radius: 20px;
  }

  .my-column {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .title, .adds, .buttons {
    margin: 30px;
  }

  .title {
    flex: 0.5;
    margin-left: 50px;
    text-align: left;
  }

  .adds {
    flex: 2;
    border: 1px solid black;
    border-radius: 10px;
    text-align: center;

    &.edit-mode {
      border: 2px solid blue;
      background-color: white;
    }

    &.normal-mode {
      border: 1px solid black;
      background-color: gray;
    }
  }

  .buttons {
    flex: 0.5;
  }
`;

const AddrSetModal = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;

  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 4;
  border: 3px solid blue;
  border-radius: 20px;

  

  .inputAddr {
    width: 500px;
  }
`;


const PasswordCheckModal = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr 2fr;

  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 4;
  border: 3px solid blue;
  border-radius: 20px;
  text-align: center;

  .passwordInput {
    margin-top: 50px;
  }
`;

const PasswordChangeModal = styled.div`
  display: grid;
  grid-template-rows: 1fr 2fr 1fr;

  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 400px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 4;
  border: 3px solid blue;
  border-radius: 20px;
  text-align: center;
`;

const UserPage = () => {
  const userData = JSON.parse(localStorage.getItem("user"));

  const [isModalAddrOpen, setModalAddrOpen] = useState(false);
  const [isModal1Open, setModal1Open] = useState(false);
  const [isModal2Open, setModal2Open] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidPasswordFormat, setIsValidPasswordFormat] = useState(true);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const [myInterestList, setMyInterestList] = useState([]);

  const handleAddressSelected = (selectedAddress) => {
    const selectedAddr = selectedAddress;
  
    // 주소 업데이트
    setAddrField((prevField) => ({
      ...prevField,
      value: selectedAddr,
    }));
    setBaseAddr(selectedAddr); // 기본 주소 업데이트
    console.log(selectedAddr);
  };
  
  // 초기 필드 값 설정
  const [initialFieldValues, setInitialFieldValues] = useState({
    nick: userData?.nick || "",
    phone: userData?.phone || "",
    email: userData?.email || "",
    addr: userData?.addr || "",
  });

  // 각 필드에 대한 상태 설정
  const [nickField, setNickField] = useState({
    value: initialFieldValues.nick,
    isEditable: false,
  });
  const [phoneField, setPhoneField] = useState({
    value: initialFieldValues.phone,
    isEditable: false,
  });
  const [emailField, setEmailField] = useState({
    value: initialFieldValues.email,
    isEditable: false,
  });
  const [addrField, setAddrField] = useState({
    value: initialFieldValues.addr,
    isEditable: false,
  });

  
  // 기본 주소
  const [baseAddr, setBaseAddr] = useState("");
  // 상세 주소
  const [detailAddr, setDetailAddr] = useState("");

  // 편집 모드 전환 함수
  const toggleEditable = (field) => {
    
    switch (field) {
      case "nick":
        setNickField((prevField) => ({
          ...prevField,
          isEditable: !prevField.isEditable,
          value: !prevField.isEditable
            ? initialFieldValues.nick
            : prevField.value,
        }));
        break;
      case "phone":
        setPhoneField((prevField) => ({
          ...prevField,
          isEditable: !prevField.isEditable,
          value: !prevField.isEditable
            ? initialFieldValues.phone
            : prevField.value,
        }));
        break;
      case "email":
        setEmailField((prevField) => ({
          ...prevField,
          isEditable: !prevField.isEditable,
          value: !prevField.isEditable
            ? initialFieldValues.email
            : prevField.value,
        }));
        break;
      default:
        break;
    }
  };

  const handleInputChange = (field, e) => {
    // 입력 값 업데이트 함수
    switch (field) {
      case "nick":
        setNickField({ ...nickField, value: e.target.value });
        break;
      case "phone":
        setPhoneField({ ...phoneField, value: e.target.value });
        break;
      case "email":
        setEmailField({ ...emailField, value: e.target.value });
        break;
      case "addr":
        setAddrField({ ...addrField, value: e.target.value });
        break;
      default:
        break;
    }
  };

  // 데이터를 저장할 객체를 생성해 데이터가 비어있지 않은 경우만 백엔드로 전송
  const handleSave = async () => {
    const updatedData = {};
  
    if (nickField.value.trim() !== "") {
      updatedData.nick = nickField.value;
    }
  
    if (phoneField.value.trim() !== "") {
      updatedData.phone = phoneField.value;
    }
  
    if (emailField.value.trim() !== "" && isEmailValid(emailField.value)) {
      updatedData.email = emailField.value;
    } else if (!isEmailValid(emailField.value)) {
      // 이메일이 유효하지 않은 경우에 대한 처리
      alert("유효하지 않은 이메일 주소입니다.");
      return;
    }
  
    if (addrField.value.trim() !== "") {
      updatedData.addr = addrField.value;
    }
  
    if (Object.keys(updatedData).length > 0) {
      const response = await updateUser(updatedData);

      userData.nick = response.data.nick;
      userData.phone = response.data.phone;
      userData.email = response.data.email;
      userData.addr = response.data.addr;
      localStorage.setItem("user", JSON.stringify(userData));
      window.location.replace("/UserPage");
    }
  };
  
  // 데이터를 불러와 초기 필드값에 보냄.
  const updateUserInfo = async (user) => {
    if (user) {
      const response = await userInfo(user.token);
      const newNick = response.data.nick;
      const newPhone = response.data.phone;
      const newEmail = response.data.email;
      const newAddr = response.data.addr;

      setInitialFieldValues({
        nick: newNick,
        phone: newPhone,
        email: newEmail,
        addr: newAddr,
      });
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      updateUserInfo(savedUser);
    }
    window.scrollTo(0, 0);
  }, []);

  // 모든 필드가 비어 있는지 확인
  const isAllFieldsEmpty = () => {
    
    if (
      nickField.value.trim() === "" &&
      phoneField.value.trim() === "" &&
      emailField.value.trim() === "" &&
      addrField.value.trim() === ""
    ) {
      return true;
    }
    return false;
  };

  // 이메일 유효성 검사
  const isEmailValid = (email) => {
    const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
    return emailRegExp.test(email);
  };

  // 비밀번호 효성 검사
  const checkPassword = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    // 비밀번호 형식 유효성 검사
    const passwordRegExp = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=!])([0-9a-zA-Z@#$%^&+=!]){12,20}$/;
    const isValidPassword = passwordRegExp.test(newPassword);

    // 비밀번호 확인과 비교
    const isMatch = newPassword === confirmPassword;
    setPasswordMatch(isValidPassword && isMatch);

    // 정규표현식과 다를 경우 메시지 표시
    setIsValidPasswordFormat(isValidPassword);
  }

  // 비밀번호와 비밀번호 확인 일치 여부 확인
  const checkConfirmPassword = (e) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    setIsTyping(true);

    const isMatch = password === newConfirmPassword;
    setPasswordMatch(isTyping && isMatch);
  }

  // 관심목록 페이지로 이동
  const goInterestPage = () => {
    window.location.href = '/InterestList';
  };

  const onClick = async() =>{
    await changePassowrd({password:password});
    alert("비밀번호 변경이 완료되었습니다.");
    window.location.reload();
  }

  // 비밀번호 유효성 검사후 출력
  const checkpassword =  async(e) =>{
    e.preventDefault();
    const isPasswordValid =  await passwordCheck({password:password});  
    console.log(isPasswordValid);
    if(isPasswordValid.data===true){
      openPasswordChangeModal();
    }else{
      alert('비밀번호가 틀렸습니다!');
    }
  } 

  // 주소 검색창
  const openAddrModal = () => {
    setModalAddrOpen(true);
  };

  // 비밀번호 변경 전 확인 창
  const openPasswordChackModal = () => {
    setModal1Open(true);
  };

  // 비밀번호 변경 창
  const openPasswordChangeModal = () => {
    setModal2Open(true);
  };

  // 창 닫기
  const closeModal = () => {
    setModal1Open(false);
    setModal2Open(false);
    setModalAddrOpen(false);
  };

  return (
    <Main>
      <MyPage>
        <div className="myPages">

          {/* 수정 메뉴 */}
          <h2 style={{ marginLeft: "40px" }}>내 정보</h2>
          <div className="my-names">
            {/* 닉네임 */}
            <div className="my-column">
              <p className="title">닉네임</p>
              <input
                type="text"
                className={`adds ${
                  !nickField.isEditable ? "normal-mode" : "edit-mode"
                }`}
                readOnly={!nickField.isEditable}
                value={
                  !nickField.isEditable
                    ? initialFieldValues.nick
                    : nickField.value
                }
                onChange={(e) => handleInputChange("nick", e)}
              />
              <button className="buttons" onClick={() => toggleEditable("nick")}>
                <BsPencilSquare style={{ fontSize: "30px" }} />
                {nickField.isEditable ? "취소" : "변경"}
              </button>
            </div>

            {/* 전화번호 */}
            <div className="my-column">
              <p className="title">전화번호</p>
              <input
                type="text"
                className={`adds ${
                  !phoneField.isEditable ? "normal-mode" : "edit-mode"
                }`}
                readOnly={!phoneField.isEditable}
                value={
                  !phoneField.isEditable
                    ? initialFieldValues.phone
                    : phoneField.value
                }
                onChange={(e) => handleInputChange("phone", e)}
              />
              <button
                className="buttons"
                onClick={() => toggleEditable("phone")}
              >
                <BsPencilSquare style={{ fontSize: "30px" }} />
                {phoneField.isEditable ? "취소" : "변경"}
              </button>
            </div>

            {/* 이메일 */}
            <div className="my-column">
              <p className="title">이메일</p>
              <input
                type="text"
                className={`adds ${
                  !emailField.isEditable ? "normal-mode" : "edit-mode"
                }`}
                readOnly={!emailField.isEditable}
                value={
                  !emailField.isEditable
                    ? initialFieldValues.email
                    : emailField.value
                }
                onChange={(e) => handleInputChange("email", e)}
              />
              <button
                className="buttons"
                onClick={() => toggleEditable("email")}
              >
                <BsPencilSquare style={{ fontSize: "30px" }} />
                {emailField.isEditable ? "취소" : "변경"}
              </button>
            </div>

            {/* 주소 */}
            <div className="my-column">
              <p className="title">기본 주소</p>
              <input
                type="text"
                className={`adds edit-mode`}
                value={baseAddr || initialFieldValues.addr}
                onChange={(e) => handleInputChange("addr", e)}
              />
              <button className="buttons" onClick={openAddrModal}>
                <BsPencilSquare style={{ fontSize: "30px" }} />
                변경
              </button>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", margin: "20px" }}>
              <input
                type="button"
                value={"저장"}
                onClick={handleSave}
                style={{ fontSize: "20px" }}
                disabled={isAllFieldsEmpty()}
              />
            </div>
          </div>

          {/* 리스트 메뉴 */}
          <h2 style={{ marginLeft: "40px" }}>리스트</h2>
          <div className="my-list">
            <div className="my-column">
              <p className="title">관심목록</p>
              <p className="title"></p>
              <button className="buttons" onClick={goInterestPage}>
                <BsPencilSquare style={{ fontSize: "30px" }} /> 보러가기
              </button>
            </div>
            <div className="my-column">
              <p className="title">포인트 결제 내역</p>
              <p className="title"></p>
              <button className="buttons">
                <BsPencilSquare style={{ fontSize: "30px" }} /> 보러가기
              </button>
            </div>
          </div>
          
          {/* 관리 메뉴 */}
          <h2 style={{ marginLeft: "40px" }}>관리</h2>
          <div className="my-set">
            <div className="my-column">
              <p className="title">비밀번호 변경</p>
              <p className="title"></p>
              <button className="buttons" onClick={openPasswordChackModal}>
                <BsPencilSquare style={{ fontSize: "30px" }} /> 변경
              </button>
            </div>
          </div>
        </div>
      </MyPage>
      
      {/* 주소 변경 Modal */}
      {isModalAddrOpen && (
        <AddrSetModal>
          <div>
            <h1>주소 변경</h1>
          </div>
          <div>
            <div>
              <label>기본 주소</label>
              <div>
                <input 
                  className="inputAddr"
                  type="text" 
                  value={baseAddr}
                  onChange={(e) => setBaseAddr(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>상세 주소</label>
              <div>
                <input 
                  className="inputAddr"
                  type="text" 
                  value={detailAddr} 
                  onChange={(e) => setDetailAddr(e.target.value)}
                />
              </div>
            </div>
            <div>
              <button className="buttons" onClick={() => DaumPostcode({ onAddressSelected: handleAddressSelected })}>
                <FaMapLocationDot style={{ fontSize: "30px" }} />
                검색
              </button>
            </div>
          </div>
          <div className="div-buttons">
            <button
              className="buttons"
              onClick={() => {
                const combinedAddress = `${baseAddr}${
                  detailAddr ? '/' + detailAddr : ''
                }`;
                handleAddressSelected(combinedAddress);
                closeModal();
              }}
            >
            변경
            </button>
            <button onClick={closeModal}>취소</button>
          </div>
        </AddrSetModal>
      )}
      
      {/* 비밀번호 확인 Modal */}
      {isModal1Open && (
        <PasswordCheckModal>
            <div>
              <h1>현재 비밀번호 확인</h1>
            </div>

            <div className="passwordInput">
              <input required type="password" onChange={(e)=>{setPassword(e.target.value)}}/>              
            </div>

            <div>
              <button onClick={checkpassword}>확인</button>                            
              
              <button onClick={closeModal}>취소</button>              
            </div>
        </PasswordCheckModal>
      )}
    
      {/* 비밀번호 변경 Modal */}
      {isModal2Open && (
        <PasswordChangeModal>
          <div>
            <h1>비밀번호 변경</h1>
          </div>
          <div>
            <h3>비밀번호</h3>
            <input type="password"
              onChange={(e) => {
                setPassword(e.target.value)                
                checkPassword(e)}}/>
                {!isValidPasswordFormat && (
                  <p className="text-danger">비밀번호 형식이 올바르지 않습니다. 12~20글자 / 영문, 특수문자, 숫자 필수</p>
              )}
            <h3>비밀번호 확인</h3>
            <input 
              type="password"
              onChange={checkConfirmPassword}
            />
            {isTyping && !passwordMatch && (
              <p className="text-danger">비밀번호가 일치하지 않습니다.</p>
            )}
          </div>
          <div>
            {/* <button onClick={}>변경</button> */}
            <button onClick={onClick} >확인</button>
            <button onClick={closeModal}>취소</button>
            
          </div>
        </PasswordChangeModal>
      )}
    </Main>
    
  );
};

export default UserPage;