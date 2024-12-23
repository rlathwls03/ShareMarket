import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from "./CategoryList"; // CATEGORIES 가져오기
import './NewPost.css';

function NewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState(""); 
  const [image, setImage] = useState(null);
  //const [username, setUsername] = useState(""); 
  const navigate = useNavigate();

   //로그인 체크 함수
  const checkLogin = () => {
    const token = sessionStorage.getItem('authToken');
    const username = sessionStorage.getItem('username'); // 로그인한 사용자 이름 가져오기
    if (!token || !username) {
     alert('로그인이 필요합니다! 로그인 창으로 이동합니다');
      navigate('/login'); // 로그인 페이지로 리디렉션
     //return false;
      return null;
    }
    return username;
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]); // 첨부된 파일 저장
  };

  const handleSubmit = () => {
    const username = checkLogin();
    if (!title || !description || !category || !image) {
      alert("모든 필드를 채워주세요!");
      return;
    }

    // 서버 API 호출 예제
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("price", price); 
    formData.append("image", image);
    formData.append('username', username); // 로그인한 사용자의 이름 추가

    fetch('http://localhost:3000/api/posts', {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("게시물이 성공적으로 등록되었습니다!");
        // 성공 후 폼 초기화
        setTitle("");
        setDescription("");
        setCategory("");
        setPrice("")
        setImage(null);
        const postId = data.postId; // 서버에서 반환된 게시물 ID
        navigate(`/post/${postId}`); // 게시물 상세 페이지로 이동
       
      })
      .catch((error) => {
        console.error("게시물 등록 오류:", error);
        alert("게시물 등록에 실패했습니다.");
      });
  };

  return (
    <div className="new-post">
      <h2>게시물 등록</h2>
      <div className="form">
        <label>
          제목:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="게시물 제목을 입력하세요"
          />
        </label>
        <label>
          설명:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="게시물 설명을 입력하세요"
          ></textarea>
        </label>
        <label>
          카테고리:
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">카테고리를 선택하세요</option>
            {CATEGORIES.map((category, index) => (
              <option key={index} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <label>
          금액:
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)} // 금액 입력 핸들러
            placeholder="판매 금액을 입력하세요"
          />
        </label>
        <label>
          사진 첨부:
          <input type="file" accept="image/*" onChange={handleImageUpload} />
          {image && <p>첨부된 파일: {image.name}</p>}
        </label>
        <button onClick={handleSubmit}>등록</button>
      </div>
    </div>
  );
}

export default NewPost;
