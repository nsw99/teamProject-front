import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { getCategories, addPost } from "../api/addpost";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import getUserInfo from "../api/user";
// const { userObject } = getUserInfo();

// 서울시간 설정
function convertToSeoulTime(date) {
  const seoulOffset = 9 * 60; // 서울은 UTC+9
  const seoulTime = new Date(date.getTime() + seoulOffset * 60000);
  return seoulTime;
}

const Post = () => {
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [itemName, setItemName] = useState("");
  const [desc, setDesc] = useState("");
  const [sMoney, setSmoney] = useState("");
  const [eMoney, setEmoney] = useState("");
  const [gMoney, setGmoney] = useState(0);
  const [select, setSelect] = useState(1);
  const [isBuyNowChecked, setIsBuyNowChecked] = useState(false);
  const [images, setImages] = useState([]);
  const [checkNo, setCheckNo] = useState(0);
  const [attendNo, setAttendNo] = useState(0);
  const [imagePreviews, setImagePreviews] = useState([]); // 이미지 미리보기 배열
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [eMoneyError, setEMoneyError] = useState("");
  const [auctionDate, setAuctionDate] = useState(new Date());
  const [auctionEndDate, setAuctionEndDate] = useState(new Date());

  // 정보 업데이트
  const onClick = async () => {
    const formData = new FormData();
    console.log(images);
    formData.append("title", title);
    formData.append("itemName", itemName);
    formData.append("desc", desc);
    formData.append("sMoney", sMoney);
    formData.append("eMoney", Math.floor(eMoney));
    formData.append("gMoney", gMoney);
    formData.append("categoryNo", select);
    formData.append("checkNo", checkNo);
    formData.append("attendNo", attendNo);
    formData.append("nowBuy", isBuyNowChecked ? "Y" : "N"); // 즉시 구매 여부를 "Y" 또는 "N"으로 설정
    console.log(convertToSeoulTime(1));
    const seoulAuctionDate = convertToSeoulTime(auctionDate);
    const seoulAuctionEndDate = convertToSeoulTime(auctionEndDate);
    formData.append("auctionDate", seoulAuctionDate.toISOString());
    formData.append("auctionEndDate", seoulAuctionEndDate.toISOString());

    // 이미지를 FormData에 추가
    for (let i = 0; i < images.length; i++) {
      formData.append("image", images[i]);
      console.log(images[i]);
    }

    try {
      const response = await addPost(formData);
      if (response.status === 200) {
        // 업로드 성공 시 모달 열기
        setIsModalOpen(true);
      } else {
        // 업로드 실패 처리
        console.error("게시물 업로드 중 오류발생.");
      }
    } catch (error) {
      console.error("게시물 업로드 중 오류가 발생했습니다.", error);
    }
  };

  // 이미지 업로드
  const onUploadImage = (e) => {
    const selectedImages = e.target.files;
    const newImages = [...images];
    for (let i = 0; i < selectedImages.length; i++) {
      newImages.push(selectedImages[i]);
    }

    // 이미지 미리보기 배열 업데이트
    const imagePreviewsArray = Array.from(selectedImages).map((image) =>
      URL.createObjectURL(image)
    );

    setImages(newImages);
    setImagePreviews([...imagePreviews, ...imagePreviewsArray]);
  };

  // 이미지 삭제
  const removeImage = (index) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1); // 선택한 이미지 미리보기 제거

    const newImages = [...images];
    newImages.splice(index, 1); // 선택한 이미지 배열에서 제거

    setImagePreviews(newImagePreviews);
    setImages(newImages);
  };

  // 카테고리 불러오기
  const categoryAPI = async () => {
    const result = await getCategories();
    setCategories(result.data);
  };

  // 카테고리 호출
  const onChangeCategory = (e) => {
    setSelect(e.currentTarget.value);
  };

  // 최소입찰가 설정
  useEffect(() => {
    categoryAPI();
    const minBidLimit = sMoney * 0.1;
    setEmoney(minBidLimit);
  }, [sMoney]);

  return (
    <Container>
      <h1>경매글 작성</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={title}
            placeholder="제목"
            onChange={(e) => setTitle(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            value={itemName}
            placeholder="상품명"
            onChange={(e) => setItemName(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            as="textarea"
            rows={3}
            value={desc}
            placeholder="게시글 내용"
            onChange={(e) => setDesc(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            value={sMoney}
            placeholder="경매시작가격(최대 입력값 1억원)"
            onChange={(e) => setSmoney(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control
            type="number"
            value={Math.floor(eMoney)}
            placeholder="최소입찰가 (자동 설정)"
            disabled
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            label="즉시구매 사용여부"
            checked={isBuyNowChecked}
            onChange={() => setIsBuyNowChecked(!isBuyNowChecked)}
          />
        </Form.Group>
        {isBuyNowChecked && (
          <Form.Group className="mb-3">
            <Form.Control
              type="number"
              value={gMoney}
              placeholder="즉시구매가"
              onChange={(e) => setGmoney(e.target.value)}
            />
          </Form.Group>
        )}
        <Form.Select onChange={onChangeCategory} value={select}>
          {categories.map((category, index) => (
            <option value={category.categoryNo} key={index}>
              {category.categoryName}
            </option>
          ))}
        </Form.Select>
        <Form.Group className="mb-3">
          <Form.Label>이미지 업로드</Form.Label>
          <Form.Control
            type="file"
            onChange={onUploadImage}
            multiple
            accept="image/*"
          />
        </Form.Group>
        {imagePreviews.map((imagePreview, index) => (
          <div key={index}>
            <img
              src={imagePreview}
              alt={`Image ${index}`}
              style={{ maxWidth: "100px", maxHeight: "100px" }}
            />
            <button onClick={() => removeImage(index)} type="button">
              삭제
            </button>
          </div>
        ))}
        <Button
          variant="danger"
          style={{ marginTop: "20px" }}
          onClick={onClick}
          disabled={
            title === "" ||
            itemName === "" ||
            desc === "" ||
            sMoney === "" ||
            eMoney === "" ||
            (isBuyNowChecked && gMoney === "") ||
            images.length === 0
          }
        >
          저장
        </Button>
      </Form>
      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>업로드 성공</Modal.Title>
        </Modal.Header>
        <Modal.Body>게시물이 성공적으로 업로드되었습니다.</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsModalOpen(false);
              navigate("/AuctionDetail");
            }}
          >
            확인
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Post;
