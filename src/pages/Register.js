import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { addUser, nickDuplicate, idDuplicate } from '../api/user';
import { useNavigate } from 'react-router-dom';
import DaumPostcode from '../components/DaumPostcode';
import styled from "styled-components";

const MemberRegister = styled.div`
    max-width: 1295px;
    min-width: 800px;
    margin: 0 auto;
    display: flex;
    justify-content: center;

`;

const Container = styled.div`
    width: 100%;
    width: 100%;
    border: 5px solid skyblue;
    border-radius: 20px;

    h1 {
        margin: 20px;
        font-weight: bold;
    }

    
    
    .forms {
        margin: 40px;
        
        display: flex;
        flex-direction: column;
        
        .lables {
            font-weight: bold;
            margin-left: 20px;
            margin-top: 20px;
        }

        .divs {
            margin: 15px;

            

            &.v1 {
                border: 2px solid pink;
                border-radius: 20px;
            }

            &.idDiv {
                display: flex;
                align-items: center;

                .idChackButton {
                    margin-left: 20px;
                }
            }

            &.regiNumDiv {
                display: flex;
            }

            &.addrDiv {
                display: flex;
            }

            &.nickDiv {
                display: flex;
                align-items: center;
                .nickCheckButton {
                    margin-left: 20px;
                }
            }

            &.registerButtonDiv {
                display: grid;
                justify-content: end;
                
                .registerButton {
                    background: #3498db;
                    color: #fff;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 10px; /* 곡면을 만들어주는 속성 */
                    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
                    transition: transform 0.2s;
                }

                .registerButton:hover {
                    transform: scale(1.1); /* 마우스 호버 시 버튼 확대 효과 */
                }
            }
        }

        .inputs {
            border: 3px solid rgb(36, 120, 255);
            border-radius: 5px;
            width: 200px;
            height: 35px;

            &.regiNumberBack {
                margin-left: 20px;
            }
        }
    }
`;
const Register = () => {
    const [name, setName] = useState("");
    const [nickName, setNickName] = useState("");
    const [phone, setPhone] = useState("");
    const [sphone, setsPhone] = useState("");
    const [addr, setAddr] = useState("");
    const [detailaddr, setDetailAddr] = useState("");
    const [password, setPassword] = useState("");
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [registrationNumberFront, setRegistrationNumberFront] = useState('');

    const [checkId, setCheckId] = useState(false);
    const [checkNick, setCheckNick] = useState(false);
    const successRegister = useNavigate();
    const handleAddressSelected = (selectedAddress) => {
        setAddr(selectedAddress);
    };

    useEffect(() => {

        const phoneNumberFront = "0504";

        // 핸드폰 번호 뒷자리 (랜덤 8자리)
        const randomNumber = Math.floor(Math.random() * 100000000).toString().padStart(8, "0");

        // 전체 핸드폰 번호 생성
        const phoneNumber = phoneNumberFront + randomNumber;
        setsPhone(phoneNumber);
    }, []);


    const idDuplicationAPI = async () => {
        const formData = new FormData();
        formData.append("id", id);

        const response = await idDuplicate(formData);
        if (response.data.isDuplicate) {
            alert("사용가능한 아이디 입니다");
            setCheckId(true);
        } else {
            alert("가입된 사용자가 있습니다 ")
            setCheckId(false);
        }
    };
    const nickDuplicateAPI = async () => {
        const formData = new FormData();
        formData.append("nick", nickName);
        const response = await nickDuplicate(formData);
        if (response.data.isDuplicate) {
            alert("사용가능한 닉네임 입니다");
            setCheckNick(true);
        } else {
            alert("가입된 사용자가 있습니다 ")
            setCheckNick(false);
        }
    };

    const onClick = async () => {
        const userData = {
            id: id,
            password: password,
            nick: nickName,
            name: name,
            birthday: registrationNumberFront + registrationNumberBack,
            email: email,
            phone: phone,
            sphone: sphone,
            addr: addr + "/" + detailaddr,
        };
        await addUser(userData)
            .then(response => {
                if (response.data) {
                    successRegister('/');
                }
            });
    }




    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatch, setPasswordMatch] = useState(true);

    const [emailValid, setEmailValid] = useState(true);
    const [isTyping, setIsTyping] = useState(false);

    const [registrationNumberBack, setRegistrationNumberBack] = useState('');
    const [registrationNumberValid, setRegistrationNumberValid] = useState(true);
    const [isValidPasswordFormat, setIsValidPasswordFormat] = useState(true);

    // 데이터의 값이 있는지 확인
    const exisitData = name && nickName && phone && sphone && addr && detailaddr && password && id && email && registrationNumberFront && registrationNumberBack;

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

    const checkConfirmPassword = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setIsTyping(true);

        // 비밀번호와 비밀번호 확인 일치 여부 확인
        const isMatch = password === newConfirmPassword;
        setPasswordMatch(isTyping && isMatch);
    }
    // 이메일 체크 부분
    const checkEmail = (e) => {
        const email = e.target.value;
        var emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
        const isValidEmail = emailRegExp.test(email);
        setEmailValid(isValidEmail);
    }

    const handleFrontChange = (e) => {
        const newRegistrationNumberFront = e.target.value.slice(0, 7); // 최대 6글자로 제한
        setRegistrationNumberFront(newRegistrationNumberFront);

        if (newRegistrationNumberFront.length === 6) {
            // 앞자리가 6글자일 때 뒷자리로 이동
            document.getElementById('registrationNumberBack').focus();
        }
    };

    const handleBackChange = (e) => {
        const newRegistrationNumberBack = e.target.value.slice(0, 7); // 최대 7글자로 제한
        setRegistrationNumberBack(newRegistrationNumberBack);

        if (newRegistrationNumberBack.length === 7 && registrationNumberFront.length === 6) {
            setRegistrationNumberValid(true);
        } else {
            setRegistrationNumberValid(false);
        }
    };
    return (
        <MemberRegister className="main">
            <Container className="panel">
                <form className='forms'>
                    <h1>회원 가입</h1>
                    <div className="divs v1">
                        <div>
                            <label className='lables'>이름</label>
                            <div className="divs nameDiv">
                                <input className='inputs name' type="text" placeholder="이름" onChange={(e) => setName(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="divs v1">
                        <div>
                            <label className='lables'>아이디</label>
                            <div className="divs idDiv">
                                <input className='inputs id' type="text" placeholder="아이디" onChange={(e) => setId(e.target.value)} />
                                <div className='idChackButton'>
                                    <Button disabled={!id} onClick={idDuplicationAPI}>아이디 중복확인</Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="divs v1" controlId="formPlaintextPassword">
                        <div>
                            <label className='lables'>비밀번호</label>
                            <div className="divs passwordDiv">
                                <input className='inputs password' type="password" placeholder="비밀번호" onChange={(e) => { setPassword(e.target.value); checkPassword(e); }} />
                                {!isValidPasswordFormat && (
                                    <p className="text-danger">비밀번호 형식이 올바르지 않습니다. 12~20글자 / 영문, 특수문자, 숫자 필수</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="divs v1" controlId="formPlaintextPassword">
                        <div>
                            <label className='lables'>비밀번호 확인</label>
                            <div className="divs passwordChackDiv">
                                <input
                                    className='inputs passwordChack'
                                    type="password"
                                    placeholder="비밀번호 확인"
                                    onChange={checkConfirmPassword}
                                />
                                {isTyping && !passwordMatch && (
                                    <p className="text-danger">비밀번호가 일치하지 않습니다.</p>
                                )}
                            </div>
                        </div>
                    </div>


                    <div className="divs v1">
                        <div>
                            <label className='lables'>닉네임</label>
                            <div className="divs nickDiv">
                                <input className='inputs nick' type="text" placeholder="닉네임" onChange={(e) => setNickName(e.target.value)} />
                                <div className='nickCheckButton'>
                                    <Button disabled={!nickName} onClick={nickDuplicateAPI}>닉네임 중복확인</Button>
                                </div>
                            </div>
                        </div>
                    </div>





                    <div className="divs v1">
                        <label className='lables'>전화번호</label>
                        <div className="divs phoneDiv">
                            <div>
                                <input className='inputs phone' type="text" placeholder="번호" onChange={(e) => setPhone(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <div className="divs v1">
                        <label className='lables'>안심번호</label>
                        <div className="divs sucretPhoneDiv">
                            <div>
                                <input className='inputs sicretPhone' placeholder="안심번호" value={sphone} readOnly/>
                            </div>
                        </div>
                    </div>

                    <div className="divs v1">
                        <div>
                            <label className='lables'>주민번호</label>
                            <div className="divs regiNumDiv">
                                <div>
                                    <input
                                        className='inputs regiNumberFront'
                                        type="text"
                                        placeholder="앞자리"
                                        value={registrationNumberFront}
                                        onChange={(e) => {
                                            handleFrontChange(e);
                                        }}
                                    />
                                </div>

                                <div>
                                    <input
                                        className='inputs regiNumberBack'
                                        id="registrationNumberBack"
                                        type="password"
                                        placeholder="뒷자리"
                                        onChange={(e) => {
                                            handleBackChange(e);
                                        }}
                                        value={registrationNumberBack}
                                    />
                                </div>
                            </div>
                            {!registrationNumberValid && (
                                <p className="text-danger">올바르지 않은 주민등록 번호입니다.</p>
                            )}
                        </div>
                    </div>
                    <div className="divs v1" controlId="formBasicEmail">
                        <label className='lables'>E-Mail</label>
                        <div className="divs emailDiv">
                            <input
                                className='inputs email'
                                type="email"
                                placeholder="이메일"
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    checkEmail(e);
                                }}
                            />
                            {!emailValid && (
                                <p className="text-danger">올바르지 않은 이메일입니다.</p>
                            )}
                        </div>
                    </div>




                    <div className="divs v1">
                        <div>
                            <label className='lables'>주소</label>
                            <div className="divs addrDiv">
                                <div>
                                    <input className='inputs addr' type="text" placeholder="기본 주소" value={addr} onChange={(e) => setAddr(e.target.value)} />
                                </div>
                                <Button
                                    className='searchButton'
                                    onClick={() => {
                                        DaumPostcode({ onAddressSelected: handleAddressSelected });
                                    }}
                                    style={{ marginLeft: "20px", border: "1px solid red", backgroundColor: "white", color: "red" }}
                                >
                                    우편 번호 검색
                                </Button>
                            </div>
                        </div>

                        <div className="divs detailAddrDiv">
                            <div>
                                <input className='inputs detailAddr' type="text" placeholder="상세 주소" value={detailaddr} onChange={(e) => setDetailAddr(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    <br />
                    <div className="divs registerButtonDiv">
                        <Button className='registerButton' onClick={onClick} disabled={!exisitData || !passwordMatch || !emailValid || !registrationNumberValid || !checkId}>
                            회원 가입
                        </Button>
                    </div>
                </form>
            </Container>
        </MemberRegister>


    );
}

export default Register;