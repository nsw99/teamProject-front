import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const sampleData = [
  {
    id: 1,
    question: "Q. 내가 판매하고 싶은 상품에 카테고리가 없어요",
    answer: "　A. 어떻게 하죠?",
  },
  {
    id: 2,
    question: "Q. 판매자 신고했는데 어떤 처벌이 있나요?",
    answer: "　A. 반성문 보내드림",
  },
  {
    id: 3,
    question: "Q. 노석우 짱짱맨",
    answer: "　A. 짱짱맨",
  },
  {
    id: 4,
    question: "Q. 이렇게 하면?",
    answer: "　A. 될려나",
  },
];




const styles = {
  container: {
    width: "80%",
    margin: "0 auto",
    padding: "20px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: "5px",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  list: {
    listStyleType: "none",
    padding: "0",
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    cursor: "pointer",
  },
  listItemHover: {
    backgroundColor: "#f7f7f7",
  },
  answerSection: {
    marginTop: "10px",
    fontWeight: "bold",
    backgroundColor: "#eee",
  },
  questionHeader: {
    fontSize: "1.5rem",
    marginBottom: "10px",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "1rem",
    color: "#fff",
    backgroundColor: "#007BFF",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    outline: "none",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
};

const QnAboard = () => {
  const [selectedQuestionId, setSelectedQuestionId] = useState(null);
  const navigate = useNavigate(); // useNavigate를 초기화

  const handleAskClick = () => {
    navigate("/AskPage"); // Askpage.js로 이동
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Q&A 게시판</h2>
      <ul style={styles.list}>
        {sampleData.map((item) => (
          <React.Fragment key={item.id}>
            <li
              style={styles.listItem}
              onClick={() =>
                setSelectedQuestionId(
                  selectedQuestionId === item.id ? null : item.id
                )
              }
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#f7f7f7")
              }
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "")}
            >
              {item.question}
            </li>
            {selectedQuestionId === item.id && (
              <li style={styles.answerSection}>
                <p>{item.answer}</p>
              </li>
            )}
          </React.Fragment>
        ))}
      </ul>
      <div style={styles.buttonContainer}>
        <button
          style={styles.button}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor =
              styles.button.backgroundColor)
          }
          onClick={handleAskClick}
        >
          1:1 개별 문의하기
        </button>
      </div>
    </div>
  );
};

export default QnAboard;
