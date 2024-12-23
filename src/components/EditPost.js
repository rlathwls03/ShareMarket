import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CATEGORIES } from './CategoryList';
import './EditPost.css';

function EditPost() {
  const { id } = useParams(); // URL의 :id 값을 가져옴
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 사용자 확인
  const loggedUser = sessionStorage.getItem('username');

  useEffect(() => {
    // 게시물 데이터 가져오기
    fetch(`http://localhost:3000/api/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data.post);
        setTitle(data.post.title);
        setDescription(data.post.description);
        setCategory(data.post.category);
        setPrice(data.post.price);
        setLoading(false);
      })
      .catch((error) => {
        console.error('게시물 로딩 오류:', error);
        setLoading(false);
      });
  }, [id]);

  const handleUpdatePost = () => {
    // 게시글 수정 API 호출
    fetch(`http://localhost:3000/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        category,
        price: parseInt(price, 10),
        username: loggedUser, // 현재 로그인 사용자 전달
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert('게시물이 수정되었습니다.');
          navigate(`/post/${id}`); // 수정 후 상세 페이지로 이동
        } else {
          alert('게시물 수정에 실패했습니다.');
        }
      })
      .catch((error) => {
        console.error('게시물 수정 오류:', error);
      });
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="editPost">
      <h2>게시물 수정</h2>
      <div>
        <label>제목:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>설명:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>카테고리:</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">카테고리를 선택하세요</option>
          {CATEGORIES.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        </div>
        <div>
        <label>금액:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)} // 금액 입력 핸들러
          placeholder="금액을 입력하세요"
        />
      </div>
      <button onClick={handleUpdatePost}>수정 완료</button>
    </div>
  );
}

export default EditPost;
