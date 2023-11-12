import React from "react";
import { createContext, useState, useEffect } from "react";
import styled from "styled-components";
import { getCategories } from "../api/connection";
import { getAuctionBoard, getHotList, getNewList } from "../api/auctionBoard";
import RecentPosts from "./RecentPosts"; // 최근 본 게시물 목록
import { getListType } from "../api/auctionBoard"; // 메인 카테고리
import bestImg from "../imgs/best.png";
import newImg from "../imgs/new.png";
import { recentView } from "../api/addpost";

const Main = styled.div`
  position: relative;
`;

const Centers = styled.div`  
  max-width: 1295px;
  margin: 0 auto;
  height: 1200px;
  gap: 20px;

   .bannerCase {
    display: flex;
    align-items: center;
    justify-content: center;
   }
`;

const Banner = styled.div`
  grid-area: g-banner;  
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(189, 189, 189);
  width: 100%;
  margin-bottom: 20px;  
  img {
    width: auto;
    height: 180px;
  }
`;

const Left = styled.div`
  grid-area: g-left;
  border: 1px solid black;
`;

const NewItem = styled.div`  
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
`;

const News = styled.div`
  grid-area: g-newitem;
  
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  justify-content: center;
  gap: 20px;
  margin: 0 auto;
  max-width: 1200px;

  
  .new-box {
    width: 200px;
    height: 280px;
    background-color: rgba(234, 234, 234);
    border: 1px solid black;
    justify-self: center;
    border-radius: 5%;
    transition: 0.5s;
    position: relative;
    z-index: 1;
    cursor: pointer; 
    

    .new-image {
      margin-top: 10px;
      margin-left: 10px;
      width: 180px;
      height: 180px;
      overflow: hidden;
      border-radius: 10px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }

    .new-font {
      position: absolute;
      width: 80%;
      left: 10%;
      height: auto;
      text-align: center;
      bottom: 0;
      line-height: 1;

      h5 {
        background-color: rgba(217, 220, 253);
        border-radius: 10px;

        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      p {
        background-color: rgba(172, 180, 246);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 5px;
        height: 30px;
        border: 1px solid black;
        border-radius: 10px;
        white-space: pre;

        &.p-time-short {
          background-color: rgba(255, 70, 70);
          color: white;
        }
      }
    }
  }

  .new-box:hover {
    transform: scale(1.5);
    transform-origin: center;
    z-index: 2;
  }
  /* } */
`;

const Modal = styled.div`
  display: grid;
  grid-template-rows: 80px 1fr 50px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    "itemTitle itemTitle itemTitle" 
    "itemImg itemImg itemBoard"
    "itemLower-left . itemLower-right";


  position: fixed;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 600px;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  z-index: 3;
  border: 5px solid skyblue;
  border-radius: 20px;

  .itemTitle {
    grid-area: itemTitle;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .itemImg {
    grid-area: itemImg;
    margin: 10px;
    overflow: hidden;
    border: 2px solid skyblue;
    border-radius: 15px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
    }
  }

  .itemBoard {
    grid-area: itemBoard;
    margin-top: 20px;
    .times {
      text-align: center;
      
    }
    
    .p-time-short {
      background-color: rgba(255, 70, 70);
      color: white;
      text-align: center;
    }

    .values {
      text-align: right;
    }

    .attend {
      text-align: center;
    }
  }

  .itemBoard p {
    font-size: 20px;
    white-space: pre;
    border: 2px solid rgba(255, 205, 18);
    border-radius: 5px;
    margin-left: 15px;
    margin-right: 15px;
  }

  .itemLower-left {
    grid-area: itemLower-left;
    display: flex;
    align-items: center;
    right: 0;
    margin-left: 10px;

    .move-page {
      background: #3498db;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
    }
    .move-page:hover {
      transform: scale(1.1);
    }
  }

  

  .itemLower-right {
    grid-area: itemLower-right;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 20px;

    .close-button {
      background: #3498db;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 10px;
      box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
      transition: transform 0.2s;
    }

    .close-button:hover {
      transform: scale(1.1);
    }
  }

  

  h4 {
    text-align: center;
  }

  
`;

const Home = (props) => {
  // const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 클릭시미리보기
  const { num } = props;
  const [andList, setAndList] = useState([]);

  const [isBannerImg, setBannerImg] = useState();

  const [selectedItem, setSelectedItem] = useState(null); // 사용자가 클릭한 항목 정보를 저장
  // 남은 시간을 1초마다 갱신

  // const typeNum = getListType();

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
        // 남은 시간만 업데이트
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

    // 컴포넌트 언마운트 시 타이머 해제
    return () => {
        clearInterval(timerId);
    };
};


  useEffect(()=>{
    andListAPI();
  },[num]);

  // Header 메뉴 선택에 따라 출력되는 이미지와 게시글 변경
  const andListAPI = async () => {
    let clicks = num;
    let result = await getHotList();
    let setImg = bestImg;
    console.log(clicks);
    if (clicks === 1) {
      result = await getHotList();
      setImg = bestImg;
    } else if (clicks === 2) {
      result = await getNewList();
      setImg = newImg;
    }

    setAndList(result.data);
    setBannerImg(setImg);
  };

  useEffect(() => {
    
    startTimer();
    window.scrollTo(0, 0);
  }, []);


  // 미리보기 창 열기
  const openModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  // 미리보기 창 닫기
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // 해당 게시글 페이지로 이동
  const openPage = (auctionNo) => {
    window.location.href = `/auctionpost/${auctionNo}`;
  };

  return (
    
    <Main className="div-container">
      <Centers>
        <div className="bannerCase">
          <Banner>
            <img src={isBannerImg}/>
          </Banner>
        </div>
        <NewItem className="div-item">
          <News className="new-container">
            {andList.map((ands, index) => (
              <div
                key={ands.auctionNo}
                onClick={() => openModal(ands)}
                className="new-box"
              >
                <div className="new-image">
                  <img
                    src={"/upload/" + ands.auctionImg.split(",", 1)}
                    alt={ands.auctionTitle}
                  />
                </div>
                <div className="new-font">
                  <h5>{ands.auctionTitle}</h5>
                  {calculateTimeDifference(ands.auctionEndDate).hours >= 0 ? (
                    <p className={((calculateTimeDifference(ands.auctionEndDate).hours < 8) && (calculateTimeDifference(ands.auctionEndDate).days === 0)) || (calculateTimeDifference(ands.auctionEndDate).hours < 0) ? "p-time-short" : ""}>
                      {calculateTimeDifference(ands.auctionEndDate).days > 0 ? (
                        `남은 시간: ${calculateTimeDifference(ands.auctionEndDate).days}일`
                      ) : (
                        (calculateTimeDifference(ands.auctionEndDate).seconds <= 0) ? (
                          <span>
                            경매 마감
                          </span>
                        ) : (
                          `남은 시간: ${(calculateTimeDifference(ands.auctionEndDate).hours < 10 ? '0' : '')}${calculateTimeDifference(ands.auctionEndDate).hours}:${(calculateTimeDifference(ands.auctionEndDate).minutes < 10 ? '0' : '')}${calculateTimeDifference(ands.auctionEndDate).minutes}:${(calculateTimeDifference(ands.auctionEndDate).seconds < 10 ? '0' : '')}${calculateTimeDifference(ands.auctionEndDate).seconds}`
                        )
                      )}
                    </p>
                  ) : null}
                  <p>
                    현재가 : <span>{ands.currentPrice}</span>원
                  </p>
                </div>
              </div>
            ))}
          </News>
        </NewItem>
        

        {isModalOpen && selectedItem && (
          <Modal>
            <div className="itemTitle">
              <h2>{selectedItem.auctionTitle}</h2>
            </div>
            <div className="itemImg">
              <img src={"/upload/" + selectedItem.auctionImg.split(",", 1)} alt={selectedItem.auctionTitle}/>
            </div>
            <div className="itemBoard">
              <h4>남은 시간</h4>
              <p className={((calculateTimeDifference(selectedItem.auctionEndDate).hours < 8) && (calculateTimeDifference(selectedItem.auctionEndDate).days === 0)) || (calculateTimeDifference(selectedItem.auctionEndDate).hours < 0) ? "p-time-short" : "times"}>
                {calculateTimeDifference(selectedItem.auctionEndDate).days > 0 ? (`${calculateTimeDifference(selectedItem.auctionEndDate).days}일`) : calculateTimeDifference(selectedItem.auctionEndDate).hours >= 0 ? (`${(calculateTimeDifference(selectedItem.auctionEndDate).hours < 10 ? '0' : '')}${calculateTimeDifference(selectedItem.auctionEndDate).hours}:${(calculateTimeDifference(selectedItem.auctionEndDate).minutes < 10 ? '0' : '')}${calculateTimeDifference(selectedItem.auctionEndDate).minutes}:${(calculateTimeDifference(selectedItem.auctionEndDate).seconds < 10 ? '0' : '')}${calculateTimeDifference(selectedItem.auctionEndDate).seconds}`) : ("경매 마감")}
              </p>
              <h4>시작가</h4>
              <p className="values">
                <span>{selectedItem.auctionSMoney}</span>원
              </p>
              <h4>현재가</h4>
              <p className="values">
                <span>{selectedItem.currentPrice}</span>원
              </p>
              <h4>입찰 횟수</h4>
              <p className="attend">
                <span>{selectedItem.currentNum}</span>                
              </p>
            </div>
            <div className="itemLower-left">
              <button className="move-page" onClick={() => openPage(selectedItem.auctionNo)}>상세 페이지</button>
            </div>
            <div className="itemLower-right">
              <button className="close-button" onClick={closeModal}>닫기</button>
            </div>
            
            
          </Modal>
        )}
      </Centers>
      
      {/* <Right>

      </Right> */}
      
    </Main>


  );
};

export default Home;
