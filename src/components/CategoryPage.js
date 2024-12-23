import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams(); // URL에서 카테고리 이름 가져오기
  const [posts, setPosts] = useState([]); // 게시글 데이터를 저장
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 훅

  useEffect(() => {
    // 카테고리를 기반으로 API 호출
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/api/posts?category=${encodeURIComponent(categoryName)}`
        );
        const data = await response.json();
        setPosts(data.posts || []); // 응답 데이터에서 게시글 저장
      } catch (error) {
        console.error('게시글 로딩 실패:', error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [categoryName]);

  const handlePostClick = (postId) => {
    navigate(`/post/${postId}`); // 게시물 ID를 사용해 PostDetails로 이동
  };

  return (
    <div className="category-page">
      <h2>{categoryName} 카테고리</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : posts.length > 0 ? (
        <table className="post-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>작성자</th>
              <th>게시글 제목</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr
                key={post.id}
                onClick={() => handlePostClick(post.id)} // 행 전체 클릭 시 이동
                className="clickable-row"
              >
                <td>{index + 1}</td>
                <td>{post.username}</td>
                <td>{post.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>등록된 게시물이 없습니다.</p>
      )}
    </div>
  );
}

export default CategoryPage;