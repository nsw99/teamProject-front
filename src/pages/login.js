import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { FaRegUser } from "react-icons/fa";
import { AiFillLock, AiOutlineClose } from "react-icons/ai";
import { styled } from "@mui/material/styles";
import { useDispatch } from "react-redux";
import { asyncLogin } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../css/modal.css";
import FindPassword from "../components/FindPassword";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';



const defaultTheme = createTheme();
const Login = () => {


  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [registrationNumberBack, setRegistrationNumberBack] = useState('');
  const [registrationNumberValid, setRegistrationNumberValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [registrationNumberFront, setRegistrationNumberFront] = useState('');
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");
  const inputWidth = "750px";
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
  const StyledTextField = styled(TextField)({
    "& label.MuiInputLabel-asterisk": {
      display: "none",
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const id = e.target.id.value;
    const password = e.target.password.value;    
    dispatch(asyncLogin({ id, password })).then((response) => {
      if (response.payload) {
        navigate('/');
        window.location.reload();
      } 
      else alert('아이디 또는 비밀번호가 틀렸습니다.');      
    });
  };


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };



  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid
        container
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <a href="/" style={{ textDecoration: "none", color: "black" }}>
          <h1>중번당</h1>
        </a>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              로그인
            </Typography>

            <Box
              component="form"
              noValidate
              onSubmit={onSubmit}
              sx={{ mt: 1 }}
            >
              <StyledTextField
                margin="normal"
                required
                fullWidth
                id="id"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FaRegUser style={{ marginRight: "8px" }} />
                    아이디
                  </div>
                }
                name="id"
                autoFocus
                InputLabelProps={{ required: false }}
              />

              <StyledTextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <AiFillLock style={{ marginRight: "8px" }} />
                    비밀번호
                  </div>
                }
                type="password"
                id="password"
                autoComplete="current-password"
                InputLabelProps={{ required: false }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{ padding: "18px" }}
              >
                로그인
              </Button>

              <Grid item>
                <Link
                  href="/register"
                  style={{ textDecoration: "none", margin: "20px" }}
                >
                  {"회원가입"}
                </Link>

                {isModalOpen && (
                  <div className="Modal">
                    <button className='close' onClick={closeModal}><AiOutlineClose/></button>
                    <div className="top-value">
                      <h2>비밀번호 재설정</h2>
                    </div>
                    <div className="top">
                      <div className="mb-3">
                        <Col sm>
                          <div>
                            <Form.Label className="label">아이디 확인</Form.Label>
                          </div>
                          <div className="idBox">
                            <input 
                            className="ids"
                            type="text" placeholder="아이디" onBlur={(e) => setId(e.target.value)}/>
                          </div>
                        </Col>
                      </div>
                    </div>
                    <div className="middle">
                      <div className="mb-3">
                          <div>
                            <Form.Label className="label">주민등록번호 확인</Form.Label>
                          </div>
                          <div>
                            <div className="registrationBox">
                              <Col sm={5}>
                                <input
                                  id="registrationNumberFirst"
                                  type="text"
                                  placeholder="앞자리"
                                  onBlur={(e) => {
                                    handleFrontChange(e);
                                  }}
                                  maxLength={6}
                                />
                              </Col>
                              <Col sm={5}>
                                <input
                                  id="registrationNumberBack"
                                  type="password"
                                  placeholder="뒷자리"
                                  onBlur={(e) => {
                                    handleBackChange(e);
                                  }}
                                  maxLength={7}
                                />
                              </Col>
                            </div>
                          </div>
                          <div>
                            {!registrationNumberValid && (
                            <p className="text-danger">올바르지 않은 주민등록 번호입니다.</p>)}
                          </div>
                      </div>
                    </div>
                    <div className="bottom">
                      <div>
                        <Form.Label className="label">이메일 확인</Form.Label>
                      </div>
                      <div>
                        <input
                          className="emails"
                          type="text"
                          placeholder="이메일을 입력해주세요"
                          onBlur={(e) => setEmail(e.target.value)}
                        />                      
                      </div>
                    </div>
                    <div className="checkButton">
                      {email && registrationNumberFront.length === 6 && registrationNumberBack.length === 7 && id && (
                        <FindPassword email={email} birthday={`${registrationNumberFront}${registrationNumberBack}`} id={id} />
                      )}
                    </div>
                  </div>
                )}
                <Link style={{ textDecoration: "none", cursor: "pointer", float: "right", marginRight:"20px"}} onClick={openModal} >비밀번호를 잊으셨나요?</Link>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;