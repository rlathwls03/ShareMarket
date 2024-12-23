import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'; // 스타일 추가

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // 최근 게시물 API 호출
    fetch('http://localhost:3000/api/home')
      .then((response) => {
        if (!response.ok) {
          throw new Error('최근 게시물을 가져오는데 실패했습니다.');
        }
        return response.json();
      })
      .then((data) => {
        setRecentPosts(data.recentPosts || []); // 응답에서 recentPosts 키 사용
      })
      .catch((err) => {
        console.error('API 호출 오류:', err.message);
        setError(err.message);
      });
  }, []);

  const handleRowClick = (postId) => {
    navigate(`/post/${postId}`);
  };

  return (
    <div className="home">
      <h1>환영합니다! ShareMarket에 오신 것을 환영합니다.</h1>
      <p>여기에서 다양한 중고 물품을 거래하세요.</p>

      {/* 게시물 목록 보기 버튼 */}
      <Link to="/postlist" className="postlist-button">
        게시물 목록 보기
      </Link>
      <hr />

      {/* 최근 게시물 표시 */}
      <h2>최근 게시물</h2>
{error ? (
  <p style={{ color: 'red' }}>{error}</p>
) : recentPosts.length === 0 ? (
  <p>최근 게시물이 없습니다.</p>
) : (
  <div className="post-grid">
    {recentPosts.map((post) => (
      <div
        key={post.id}
        className="post-card"
        onClick={() => handleRowClick(post.id)} // 카드 클릭 이벤트
      >
        <img
          src={`http://localhost:3000${post.image}`}
          alt={post.title}
          className="post-thumbnail"
        />
        <h3>{post.title}</h3>
        <p className="price">{post.price?.toLocaleString() || '가격 미정'}원</p>
      </div>
    ))}
  </div>
)}

    </div>
  );
}

export default Home;
