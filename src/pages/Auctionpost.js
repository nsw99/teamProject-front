import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPost, updateCurrentPrice, getCountAuction,
  deletePost, updatecategoryNo
} from "../api/addpost";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import { getComments, getreComments } from "../api/auctionBoard";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addComment, updateComment, deleteComment } from "../store/commentSlice";
import { Modal } from "react-bootstrap";
import { Margin } from "@mui/icons-material";
import { userSave } from "../store/userSlice";
import { userInfo, updatebuyerPoint, deleteCheck, addMyInterest, interestDuplicate } from "../api/user";
import Cookies from "js-cookie";
import { asyncAuctionInfo } from "../store/auctionSlice";


function convertToSeoulTime(utcDateString) {
  const utcDate = new Date(utcDateString);
  const seoulOffset = 9 * 60;
  const seoulTime = new Date(utcDate.getTime() + seoulOffset * 60000);
  return seoulTime;
}

const Main = styled.div`
  margin-bottom: 100px;

  .container {
    width: 1300px;
  }

  .interestCheckButton {
    width: 150px;
    height: 40px;
    border-radius: 20px;
  }

  .checkOn {
    background-color: red;
    color: wheat;

  }
  .checkOff {

  }
`;


const Auctionpost = () => {
  const dispatch = useDispatch();
  const [auctionPost, setAuctionPost] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [newCurrentPrice, setNewCurrentPrice] = useState(0);
  const [addComments, setAddComments] = useState("");
  const { auctionNo } = useParams();
  const [comments, setComments] = useState([]);
  const [recomments, setRecomments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingComment, setEditingComment] = useState([]);
  const [sellerAuctionCount, setSellerAuctionCount] = useState(0);
  const save = localStorage.getItem("user");
  const savedUser = JSON.parse(save);
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [andList, setAndList] = useState([]);
  const [point, setPoint] = useState(0);

  const [interestData, setInterestData] = useState(null);
  const [isInterest, setInterestToggle] = useState(false);
  
  const handleDeleteComment = (comment) => {

    dispatch(deleteComment(comment.commentNo));
    window.location.reload();
  };


  //최종입찰
  const buyerPoint = async () => {
    const buyerPoint = point - auctionPost.buyerPoint;
    const formData = new FormData();
    formData.append("point", buyerPoint);
    await updatebuyerPoint(formData);
    window.location.reload();
    updatecategoryNo(auctionPost.auctionNo);
  };
  const buyerPointstart = () => {
    buyerPoint();
  };

  const updateUserInfo = async (user) => {
    if (user) {
      const response = await userInfo(user.token);

      const newPoint = response.data.point;
      if (newPoint >= 0) {
        setPoint(newPoint);
      }
    }
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      updateUserInfo(savedUser);
    }
  }, []);


  //시간
  const calculateTimeDifference = (auctionEndDate) => {
    if (!auctionEndDate) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const endDate = new Date(auctionEndDate);
    const currentDate = new Date();
    const timeDifference = endDate - currentDate;
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);

    return {
      days: daysDifference,
      hours: hoursDifference % 24,
      minutes: minutesDifference % 60,
      seconds: secondsDifference % 60,
    };
  };

  const startTimer = () => {
    const timerId = setInterval(() => {
      setAndList((prevAndList) => {
        return prevAndList.map((ands) => {
          const timeDifference = calculateTimeDifference(ands.auctionEndDate);
          return {
            ...ands,
            timeDifference,
          };
        });
      });
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  };



  useEffect(() => {
    startTimer();
  }, []);

  const handleEditComment = (comment) => {
    setIsEditing(true);
    setEditingComment(comment.content);
    setSelectedComment(comment);
  };


  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingComment("");
    setSelectedComment(null);
  };



  const loadRecomments = async (commentNo, auctionNo) => {
    try {
      const response = await getreComments(commentNo, auctionNo);
      setRecomments(response.data);
    } catch (error) {
      console.error("대댓글 데이터를 불러오는 중 오류 발생:", error);
    }
  };

  const onUpdate = (e) => {
    if (!selectedComment) {
      return;
    }

    if (editingComment.trim() === "") {
      alert("수정할 내용을 입력해주세요.");
      return;
    }

    const commentNo = selectedComment.commentNo;
    const parrentNo = selectedComment.parent;


    dispatch(
      updateComment({
        commentNo: commentNo,
        content: editingComment,
        auctionNo: auctionNo,
        parrentNo: parrentNo
      })
    );



    // 수정 후 상태 초기화
    setIsEditing(false);
    setEditingComment("");
    setSelectedComment(null);

  };


  const handleLoadRecomments = (comment) => {
    setSelectedComment(comment);
    loadRecomments(comment.commentNo, comment.auctionNo);
  };


  const fetchAuctionPost = async () => {
    const response = await getPost(auctionNo);
    setAuctionPost(response.data);
    const seoulOffset = 9 * 60;
    const expiresDate = new Date(seoulOffset * 60000);
    if (response.data) {
      Cookies.set(`auctionPost${auctionNo}`, JSON.stringify(response.data),{expires: expiresDate.getDate()+ 5 * 60 * 1000});
    }
    dispatch(asyncAuctionInfo(auctionNo));

    // 판매자의 등록 게시물 수 가져오기
    const sellerId = response.data?.memberId?.id;
    if (sellerId) {
      const sellerCountResponse = await getCountAuction(sellerId);
      setSellerAuctionCount(sellerCountResponse.data);
    }
  }

  const dupleAuctionCheck = async () => {
    const formData = new FormData();
    formData.append("auctionNo",auctionNo);
    const duple = await interestDuplicate(formData);
    setInterestToggle(duple.data);
    console.log(duple.data);
  };


  // 데이터 가져오기
  useEffect(() => {
    console.log(auctionNo);
    fetchAuctionPost();
    dupleAuctionCheck();


  }, [auctionNo]);

  useEffect(() => {
    if (auctionPost && auctionPost.auctionImg) {
      const imageUrls = auctionPost.auctionImg.split(",");
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageUrls.length);
      }, 5000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [auctionPost]);

  const clickAddComment = () => {
    if (addComments.trim() === "") {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    if (selectedComment) {
      const data = {
        content: addComments,
        auctionNo: auctionNo,
        commentParent: selectedComment.commentNo,
      };
      dispatch(addComment(data));
    } else {
      const data = { content: addComments, auctionNo: auctionNo };
      dispatch(addComment(data));
    }

    setAddComments("");
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0
        ? auctionPost.auctionImg.split(",").length - 1
        : prevIndex - 1
    );
  };


  useEffect(() => {
    const loadComments = async () => {
      try {
        if (auctionNo) {
          const response = await getComments(auctionNo);
          setComments(response.data);
        }
      } catch (error) {
        console.error("댓글 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    if (auctionPost) {
      loadComments();
    }
  }, [auctionPost]);

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      (prevIndex + 1) % auctionPost.auctionImg.split(",").length
    );
  };

  function formatSeoulTime(dateString) {
    const seoulDate = convertToSeoulTime(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return seoulDate.toLocaleDateString("ko-KR", options);
  }

  const handleImmediatePurchase = async () => {
    const gPoint = point - auctionPost.auctionGMoney;
    if (gPoint >= 0) {
      alert("즉시구매가 완료되었습니다.");
      const formData = new FormData();
      formData.append("point", gPoint);
      await updatebuyerPoint(formData);
      updatecategoryNo(auctionPost.auctionNo);
      navigate("/auctiondetail");
    } else {
      alert("포인트가 부족합니다.")
    }
  };


  // 게시물 삭제
  const handleDeletePost = async () => {
    if (window.confirm("정말로 이 게시물을 삭제하시겠습니까?")) {
      try {

        if (isInterest) {
          await interestSet(auctionNo);
        }
        const deletedAuction = await deletePost(auctionNo);
        if (deletedAuction) {
          alert("게시물이 삭제되었습니다.");
          navigate("/Auctiondetail");
        } else {
          alert("게시물 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시물 삭제 중 오류 발생:", error);
        alert("게시물 삭제에 실패했습니다.");
      }
    }
  };

  // 입찰 성공 시 팝업
  const handlePriceChangeSuccess = () => {
    setShowSuccessModal(true);
  };

  const handlePriceChange = async (e) => {
    try {
      const newPrice =
        auctionPost.currentNum === 0
          ? auctionPost.auctionSMoney + auctionPost.auctionEMoney
          : auctionPost.currentNum < 5
            ? auctionPost.currentPrice + auctionPost.auctionEMoney
            : auctionPost.currentPrice + 2 * auctionPost.auctionEMoney

      await updateCurrentPrice(auctionPost.auctionNo, {

        currentPrice: newPrice,
        id: savedUser.id

      });
      handlePriceChangeSuccess();
    } catch (error) {
      console.error("입찰 변경 실패:", error);
    }
  };


  // 관심등록 토글 버튼
  const interestToggle = () => {
    setInterestToggle(isInterest => {
      const updatedInterest = !isInterest;
  
      // 로컬 스토리지에 관심 등록 정보 저장
      localStorage.setItem('isInterest', updatedInterest.toString());
  
      return updatedInterest;
    });
  }

  // 관심등록 on/off 데이터 전송
  const interestSet = async (auctionNo) => {
    const formData = new FormData();
    formData.append("auctionNo", auctionNo); // 필드명이랑 같야아함

    if(isInterest) {
      await deleteCheck(auctionNo);
    } else {
      await addMyInterest(formData);
    }
  }

  
  useEffect(() => {
    const storedInterest = localStorage.getItem('isInterest');    
    if (storedInterest !== null) {
      setInterestToggle(storedInterest === 'true');
    }
  }, []);


  return (
    <Main>
    <div className="container">
      {auctionPost ? (
        <Card>
          <Card.Body>
            <button 
                className={ `interestCheckButton ${isInterest ? 'checkOn' : 'checkOff'}`} 
                onClick={() => {  interestToggle(); interestSet(auctionPost.auctionNo);
              }}>
              {isInterest ? '관심등록해제' : '관심등록'}            
            </button>
            <h2 className="text-center border-bottom pb-3">
              {auctionPost.auctionTitle}
            </h2>
            <Row className="justify-content-center">
              <Col xs={12} md={6} className="border-right">
                <div
                  style={{
                    width: "100%",
                    height: "300px",
                    overflow: "hidden",
                    position: "relative",
                  }}
                >
                    <img
                      src={
                        "/upload/" +
                        auctionPost.auctionImg.split(",")[currentImageIndex]
                      }
                      alt="Auction Image"
                      style={{
                        width: "auto",
                        height: "100%",
                        display: "block",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </div>
                  <div className="text-center">
                    <p>
                      이미지 {currentImageIndex + 1} /{" "}
                      {auctionPost.auctionImg.split(",").length}
                    </p>
                    <div>
                      <Button variant="primary" onClick={handlePrevImage}>
                        이전
                      </Button>
                      <Button variant="primary" onClick={handleNextImage}>
                        다음
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <p>상품명: {auctionPost.itemName}</p>
                  <p>경매 시작일: {formatSeoulTime(auctionPost.auctionDate)}</p>
                  <div>
                    {calculateTimeDifference(auctionPost.auctionEndDate).hours >= 0 ? (
                      <p className={((calculateTimeDifference(auctionPost.auctionEndDate).hours < 8) && (calculateTimeDifference(auctionPost.auctionEndDate).days === 0)) || (calculateTimeDifference(auctionPost.auctionEndDate).hours < 0) ? "p-time-short" : ""}>
                        {calculateTimeDifference(auctionPost.auctionEndDate).days > 0 ? (
                          `남은 시간: ${calculateTimeDifference(auctionPost.auctionEndDate).days}일`
                        ) : (
                          (calculateTimeDifference(auctionPost.auctionEndDate).hours === 0 && calculateTimeDifference(auctionPost.auctionEndDate).minutes === 0 && calculateTimeDifference(auctionPost.auctionEndDate).seconds === 0) ? (
                            buyerPointstart()
                          ) : (
                            `경매 종료일: ${(calculateTimeDifference(auctionPost.auctionEndDate).hours < 10 ? '0' : '')}${calculateTimeDifference(auctionPost.auctionEndDate).hours}:${(calculateTimeDifference(auctionPost.auctionEndDate).minutes < 10 ? '0' : '')}${calculateTimeDifference(auctionPost.auctionEndDate).minutes}:${(calculateTimeDifference(auctionPost.auctionEndDate).seconds < 10 ? '0' : '')}${calculateTimeDifference(auctionPost.auctionEndDate).seconds}`
                          )
                        )}
                      </p>
                    ) : null}
                  </div>
                  <Row className="border-top justify-content-center">
                    <p>판매자 정보: {auctionPost.memberId.id}</p>
                    <p>등록건수: {sellerAuctionCount}</p>
                    <p>회원 등급: {auctionPost.memberId.authority}</p>
                  </Row>
                </Col>
              </Row>
              <Row className="border-top justify-content-center">
                <Col xs={12} md={6} className="border-right">
                  <div>
                    <p>경매 시작가: {auctionPost.auctionSMoney}원</p>
                  </div>
                  <div>
                    <p>최소 입찰가: {auctionPost.auctionEMoney}원</p>
                  </div>
                  <div>
                    <p>총 입찰 횟수: {auctionPost.currentNum}</p> 
                  </div>
                  <div>
                    <p>현재 가격: {auctionPost.currentPrice}원</p>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <h4 style={{marginTop:"10px"}}>입찰하기</h4>
                  <div style={{display:"flex"}}>
                    <Form.Group>
                      <Form.Control
                        type="number"
                        style={{ width: "300px" }}
                        value={
                          auctionPost.currentNum === 0
                            ? auctionPost.auctionSMoney + auctionPost.auctionEMoney
                            : auctionPost.currentNum < 5
                              ? auctionPost.currentPrice + auctionPost.auctionEMoney
                              : auctionPost.currentPrice + 2 * auctionPost.auctionEMoney
                        }
                        onChange={(e) => setNewCurrentPrice(e.target.value)}
                      />
                    </Form.Group>
                    <Button 
                      variant="primary" 
                      onClick={handlePriceChange}
                      style={{marginLeft:"10px"}}
                    >
                      입찰
                    </Button>
                  </div>
                  
                  <div className="border-top my-3"></div>
                  <Row>
                    <Col xs={6}>
                      <p>즉시구매여부: {auctionPost.auctionNowbuy}</p>
                      <p>즉시구매가: {auctionPost.auctionGMoney}원</p>
                    </Col>
                    <Col xs={12} md={6}>
                      {auctionPost.auctionNowbuy === "Y" ? (
                        <Button
                          variant="primary"
                          onClick={handleImmediatePurchase}
                          disabled={
                            auctionPost.currentPrice >= auctionPost.auctionGMoney
                          }
                        >
                          즉시구매
                        </Button>
                      ) : (
                        <Button variant="primary" disabled>
                          즉시구매
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ) : (
          <p>Loading...</p>
        )}
        <Row className="border-top">
          <Col xs={12} md={12} className="border-right">
            {auctionPost && (
              <p className="text-right mt-3 item-desc">
                게시글 내용: {auctionPost.itemDesc}
              </p>
            )}
          </Col>
        </Row>
        <div style={{display:"flex"}}>
          <Button variant="danger" onClick={handleDeletePost}>
            게시글 삭제
          </Button>
          <Button variant="primary" onClick={() => navigate("/update")}>
            게시글 수정
          </Button>
        </div>
        
        <hr></hr>
        <style>
          {`
          .item-desc {
            border: 1px solid #ccc; /* You can adjust the border style as needed */
            padding: 10px; /* Add padding for spacing */
          }
        `}
        </style>
        <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>입찰 변경 성공</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>입찰가 변경이 성공적으로 제출되었습니다.</p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                window.location.reload();
              }}
            >
              닫기
            </Button>
          </Modal.Footer>
        </Modal>
        <div>
          {comments
            .slice()
            .sort((a, b) => a.commentNo - b.commentNo)
            .map((comment) => (
              <div key={comment.commentNo}>
                <div className="comment" key={comment.commentNo}>
                  <div style={{ marginTop: '10px' }}>
                    <span className="author" style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{comment.member.nick}</span>
                  </div>
                  <span className="content">{comment.content}</span>
                  {comment.member.id === savedUser.id && (
                    <Button variant="outline-primary" size="sm" onClick={() => handleEditComment(comment)} style={{ marginLeft: '10px' }}>
                      수정
                    </Button>
                  )}
                  {comment.member.id === savedUser.id && (
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(comment)}>
                      삭제
                    </Button>
                  )}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleLoadRecomments(comment)}
                  >
                    답글
                  </Button>
                </div>
                <hr></hr>
                {selectedComment?.commentNo === comment.commentNo && (
                  <div style={{ marginLeft: '5%' }}>
                    {recomments
                      .slice()
                      .sort((a, b) => a.commentNo - b.commentNo)
                      .map((recomment) => (
                        <div className="recomment" key={recomment.commentNo}>
                          <div className="comment">
                            <div style={{ marginTop: '10px' }}>
                              <span className="author" style={{ fontWeight: 'bold', fontSize: '14.5px' }}>{recomment.member.nick}</span>
                            </div>
                            <div style={{ marginTop: '10px' }}>
                              <span className="content">{recomment.content}</span>
                              {recomment.member.id === savedUser.id && (
                                <Button variant="outline-primary" size="sm"
                                  onClick={() => handleEditComment(recomment)}
                                  style={{ marginLeft: '10px' }}>
                                  수정
                                </Button>
                              )}
                              {recomment.member.id === savedUser.id && (
                                <Button variant="outline-danger" size="sm" onClick={() => handleDeleteComment(recomment)}>
                                  삭제
                                </Button>
                              )}

                            </div>
                            <hr></hr>
                          </div>

                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
        <Form onSubmit={clickAddComment}>
          {isEditing ? (
            <div className="mt-3">
              <Form.Group>
                <Form.Label>댓글 내용 수정</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="댓글을 수정하세요"
                  value={editingComment}
                  onChange={(e) => {
                    setEditingComment(e.target.value);
                  }}
                  style={{ resize: "none" }}
                />
              </Form.Group>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outline-danger" onClick={handleCancelEdit} size="sm">
                  수정 취소
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  size="sm"
                  onClick={() => {
                    onUpdate(selectedComment.commentNo, editingComment, selectedComment.auctionNo, selectedComment.parent)
                  }}
                >
                  수정 완료
                </Button>
              </div>
            </div>
          ) : selectedComment ? (
            <div className="mt-3">
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedComment.member.nick}님에게 답글 작성</span>
              <Form.Group>
                <Form.Label>대댓글 내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="대댓글을 입력하세요"
                  onChange={(e) => setAddComments(e.target.value)}
                  value={addComments}
                  style={{ resize: "none" }}
                />
              </Form.Group>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button variant="outline-danger" onClick={handleCancelEdit} size="sm">
                  작성 취소
                </Button>
                <Button
                  variant="outline-danger"
                  type="submit"
                  size="sm"
                  disabled={addComments.trim() === ""}
                >
                  대댓글 작성
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <span style={{ fontSize: '40px' }}>댓글 작성</span>
              <Form.Group>
                <Form.Label>댓글 내용</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="댓글을 입력하세요"
                  onChange={(e) => setAddComments(e.target.value)}
                  value={addComments}
                  style={{ resize: "none" }}
                />
              </Form.Group>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  variant="outline-danger"
                  type="submit"
                  size="sm"
                  disabled={addComments.trim() === ""}
                  style={{ marginTop: '10px' }}
                >
                  댓글 작성
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    </Main>
  );
};

export default Auctionpost;
