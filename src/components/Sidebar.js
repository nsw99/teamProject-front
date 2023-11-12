import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import styled from "styled-components";
import { Link } from 'react-router-dom';


const Main = styled.div`
  position: fixed;
  top: 100px;
  right: 0;
  z-index: 4;
  display: flex;
`;

const SidToggleButton = styled.div`
  display: grid;
  justify-content: end;
  
  button {
    width: 32px;
    height: auto;
    background: #3498db;
    color: #fff;
    border: none;
    border-radius: 10px;
  }
`;

const SidToggle = styled.div`
  .openSid {
    width: 300px;
    height: 500px;
    position: absolute;
    right: 0px;
    transition: 1s;
    background-color: #f0f0f0;
    overflow: auto;
  }

  .closeSid {
    width: 300px;
    height: 500px;
    position: absolute;
    right: -376px;
    transition: 1s;
    background-color: #f0f0f0;
    overflow: auto;
  }
`;

const ItemDiv = styled.div`
  width: 150px;
  height: 170px;
  margin: 10px;

  h3 {
    margin: 0 auto;
    width: 80%;
    text-align: center;
  }

  .itemBox {
    border: 1px solid black;
    border-radius: 5px;
    margin-bottom: 10px;
    background-color: rgba(234, 234, 234);

    .imgBox {
      margin-top: 5px;
      margin-left: 5px;
      width: 140px;
      height: 140px;
      overflow: hidden;
      border-radius: 5px;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
    }
  }
`;


const Sidebar = () => {  
  const [auctionPosts, setAuctionPosts] = useState([]);

  // 사이드바 펼치기 숨기기
  const [sidOpen, setSidOpen] = useState(false);

  const toggleSid = (event) => {
    setSidOpen(sidOpen => !sidOpen);
  }

  useEffect(() => {
    const list = [];
    if(document.cookie){       
    const cookies = document.cookie.split('; ').map((el) => el.split('='));

    const auctionCookies = cookies.filter((cookie) =>
      cookie[0].startsWith('auctionPost')
    );
    
    const recentAuctionCookies = auctionCookies.slice(
      Math.max(auctionCookies.length - 3, 0)
    ); 

    for (let i = 0; i < recentAuctionCookies.length; i++) {
      const auctionPostInfo = Cookies.get(recentAuctionCookies[i][0]);
      list.push(JSON.parse(auctionPostInfo));
    }
  } 
    setAuctionPosts(list);
  }, []);
    
  return (
    <Main>
      <SidToggleButton onClick={toggleSid}>
        <button>
          최근 본 게시물
        </button>
      </SidToggleButton>
      {sidOpen && (
        <SidToggle>
          <ItemDiv>
            {auctionPosts &&
              auctionPosts.map((post, index) => (
                <div className="itemBox" key={index}>
                  <div className="imgBox">
                    <Link to={`/auctionPost/${post.auctionNo}`} onClick={toggleSid}>
                      <img src={"/upload/" + post.auctionImg.split(",", 1)} alt={post.auctionTitle}/>
                    </Link>
                  </div>
                  <h3>{post.auctionTitle}</h3>
                </div>
              ))}
          </ItemDiv>
        </SidToggle>
      )}
    </Main>
  );
};

export default Sidebar;