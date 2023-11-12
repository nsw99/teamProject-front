import emailjs from 'emailjs-com';
import { useState } from 'react';
import { updatePassword } from '../api/user';
import styled from "styled-components";
import Button from 'react-bootstrap/Button';

const Buttons = styled.div`
    .buttons {
        background: #3498db;
        color: #fff;
        border: none;
        padding: 10px 20px;
        border-radius: 10px; /* 곡면을 만들어주는 속성 */
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2); /* 그림자 효과 */
        transition: transform 0.2s;
    }

    .buttons:hover {
        transform: scale(1.1); /* 마우스 호버 시 버튼 확대 효과 */
    }
`;

const temporaryPassword = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters.charAt(randomIndex);
    }
    return password;
}
const FindPassword = ({ email, birthday, id }) => {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const password = temporaryPassword();

    const handleVerification = async (e) => {
        e.preventDefault();
        const response = await updatePassword({ id, birthday, password });
        console.log(response.data);
        if (response.data) {
            sendVerificationEmail();
        }
        else {
            alert('입력하신 정보가 잘못되었습니다.');
        }
    };

    const sendVerificationEmail = () => {
        const templateParams = {
            to_email:  email ,
            from_name: "중번당",
            message: password,
        };
        console.log(email);
        emailjs
            .send(
                'Password-Service', // 서비스 ID
                'FindPassword', // 템플릿 ID
                templateParams,
                'YrLlvxqaV48xTtjIa', // public-key
            )
            .then(() => {
                alert('이메일이 성공적으로 보내졌습니다:');
                setIsEmailSent(true);
            });
    };


    return (
        <div>
            {isEmailSent ? (
                <div>
                    <p style={{whiteSpace: "pre"}}>
                        인증 이메일이 성공적으로 발송되었습니다.
                        이메일을 확인해주세요!
                    </p>
                </div>
            ) : (
                <Buttons>
                    <Button className='buttons' onClick={handleVerification}>인증</Button>
                </Buttons>
            )}
        </div>
    );
}
export default FindPassword;
