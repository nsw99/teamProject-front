import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { getMyInterestList, deleteCheckList } from "../api/user";

const Main = styled.div`
    position: relative;

    .h2 {
        margin-left: 100px;
        margin: 40px;
    }
`;

const Container = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;

    .checkBox {
        margin: 8px;
        position: absolute;
        width: 20px;
        height: 20px;
        z-index: 1;
    }
`;

const MyPage = styled.div`
  max-width: 1295px;
    margin: 0 auto;
    height: 1200px;

    .allMenu{
        display: flex;
        align-items: center;
        margin: 0 auto;
        max-width: 1200px;
        border: none;
        border-radius: 5px;
        background-color: skyblue;
        margin-bottom: 20px;
    
    .checks {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 120px;
        height: 40px;
        margin: 15px;
        border: 2px solid gray;
        border-radius: 10px;
        background-color: rgba(234, 234, 234);

        .checkBox {
            width: 20px;
            height: 20px;
            margin-right: 10px;
        }
    }
    
    .deleteButton {
        border-radius: 10px;
        background-color: aquamarine;
    }
  }

    .container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        justify-content: center;
        gap: 20px;
        margin: 0 auto;
        max-width: 1200px;
        

        .new-box {
            width: 200px;
            height: 300px;
            background-color: rgba(234, 234, 234);
            border: 1px solid black;
            justify-self: center;
            border-radius: 5%;
            transition: 0.5s;
            position: relative;
            cursor: pointer;

            .new-image {
                margin-top: 30px;
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
    }
`;



const InterestList = () => {

    const [andList, setAndList] = useState([]);

    const [checkItems, setCheckItems] = useState([]);
    const [checkedAuctionNos, setCheckedAutionNos] = useState([]);

    const myListAPI = async () => {
        try {
            const result = await getMyInterestList();
            setAndList(result);
            const initialCheckStates = new Array(result.length).fill(false);
            setCheckItems(initialCheckStates); // Set initial check states
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };


    // 경매 남은 시간을 1초마다 갱신
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
    

    // auctionNo를 기준으로 해당하는 상세페이지로 이동
    const openPage = (auctionNo) => {
        window.location.href = `/auctionpost/${auctionNo}`;
    };

    // 체크 박스 전체 on/off 연동 설정
    const handleCheckboxChange = (index) => {

        const newCheckItems = [...checkItems];
        newCheckItems[index] = !newCheckItems[index];
        setCheckItems(newCheckItems);

        setCheckedAutionNos(andList.filter((_, i) => newCheckItems[i]).map((item) => item.interestNo));
    };

    const allDeleteButton = () => {
        if (checkedAuctionNos.length === 0) {
            return;
        }
    
        deleteCheckList(checkedAuctionNos.map(auctionNo => parseInt(auctionNo)));
        onDeleteCheck();
    };

    const onDeleteCheck = () => {
        alert("관심등록이 해제되었습니다");
        window.location.replace("/InterestList");
    };

    useEffect(() => {
        myListAPI();
        startTimer();
    }, []);


    return (
        <Main className="main">
            <MyPage className="myPage">
                <div>
                    <h2 style={{ marginLeft: "60px", margin: "40px" }}>관심등록 List</h2>
                </div>
                <div className="allMenu">
                    <div>
                        <label className="checks">
                        <input 
                            className="checkBox" 
                            type="checkbox" 
                            onChange={(e) => {
                                // andList가 비어 있을 때는 체크박스를 체크 해제
                                if (andList.length === 0) {
                                    e.target.checked = false;
                                } else {
                                    setCheckItems(new Array(andList.length).fill(e.target.checked));
                                }
                            }}
                            checked={checkItems.length > 0 && checkItems.every((isChecked) => isChecked)}
                        />
                            전체 선택
                        </label>
                    </div>
                    <div>
                        <button className="deleteButton" onClick={allDeleteButton}>
                            등록 해제
                        </button>
                    </div>
                </div>
                <Container>
                    <div className="container">
                        {andList.map((myList, index) => (
                            <div 
                                key={myList.auction.auctionNo}
                                className="new-box"
                            >
                                <input 
                                    className="checkBox" 
                                    type="checkbox" 
                                    onChange={() => handleCheckboxChange(index)}
                                    checked={checkItems[index]}
                                />

                                <div className="new-image">
                                    <img
                                        src={"/upload/" + myList.auction.auctionImg.split(",", 1)}
                                        alt={myList.auction.auctionTitle}
                                        onClick={() => openPage(myList.auction.auctionNo)}
                                    />
                                </div>
                                <div className="new-font">
                                    <h5>{myList.auction.auctionTitle}</h5>
                                    <p className={((calculateTimeDifference(myList.auction.auctionEndDate).hours < 8) && (calculateTimeDifference(myList.auction.auctionEndDate).days === 0)) || (calculateTimeDifference(myList.auction.auctionEndDate).hours < 0) ? "p-time-short" : ""}>
                                        {calculateTimeDifference(myList.auction.auctionEndDate).days > 0 ? (`남은 시간: ${calculateTimeDifference(myList.auction.auctionEndDate).days}일`) : calculateTimeDifference(myList.auction.auctionEndDate).hours >= 0 ? (`남은 시간: ${(calculateTimeDifference(myList.auction.auctionEndDate).hours < 10 ? '0' : '')}${calculateTimeDifference(myList.auction.auctionEndDate).hours}:${(calculateTimeDifference(myList.auction.auctionEndDate).minutes < 10 ? '0' : '')}${calculateTimeDifference(myList.auction.auctionEndDate).minutes}:${(calculateTimeDifference(myList.auction.auctionEndDate).seconds < 10 ? '0' : '')}${calculateTimeDifference(myList.auction.auctionEndDate).seconds}`) : ("경매 마감")}
                                    </p>
                                    <p>
                                        현재가 : <span>{myList.auction.currentPrice}</span>원
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </MyPage>
        </Main>
        
    );
};

export default InterestList;