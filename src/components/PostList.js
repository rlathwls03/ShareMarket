import React, { useState, useEffect } from 'react';
import { Link,useNavigate, useParams } from 'react-router-dom';
import './PostList.css';

function PostList() {
  const { categoryName } = useParams(); // URL에서 카테고리 이름 가져오기
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [searchTerm, setSearchTerm] = useState(""); // 검색 상태 관리
  const [searchOption, setSearchOption] = useState("title"); // 검색 항목: 'title' 또는 'author'
  const navigate = useNavigate(); // 페이지 이동을 위한 hook
  const postsPerPage = 10;

  useEffect(() => {
    fetchPosts();
  }, [currentPage, categoryName]); // currentPage 또는 categoryName 변경 시 게시글 불러오기

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm)}&option=${searchOption}`;
    }
  };
  
  const handleRowClick = (postId) => {
    navigate(`/post/${postId}`); // 해당 게시물 상세 페이지로 이동
  };

  const fetchPosts = () => {
    const url = categoryName
      ? `http://localhost:3000/api/posts?category=${encodeURIComponent(
          categoryName
        )}&page=${currentPage}&limit=${postsPerPage}`
      : `http://localhost:3000/api/posts?page=${currentPage}&limit=${postsPerPage}`;
    console.log('Fetching posts:', url);

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.posts || []);
        setTotalPosts(data.totalPosts || 0);
      })
      .catch((error) => {
        console.error('게시글 목록 로딩 오류:', error);
      });
  };

  const totalPages = Math.ceil(totalPosts / postsPerPage);

  const handlePageChange = (page) => {
      if (page < 1 || page > totalPages) {
    return; // 페이지 범위를 벗어나면 아무 작업도 하지 않음
  }
  setCurrentPage(page);
  };

  return (
    <div className="post-list">
      <div className="list-search">
        <input
          type="text"
          className="search-bar"
          placeholder="게시물을 검색하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
          onKeyPress={handleSearch} // Enter 키 이벤트 처리
        />
        </div>
        <div>
        <div className="search-options">
          <label>
            <input
              type="radio"
              value="title"
              checked={searchOption === "title"}
              onChange={() => setSearchOption("title")}
            />
            제목
          </label>
          <label>
            <input
              type="radio"
              value="author"
              checked={searchOption === "username"}
              onChange={() => setSearchOption("username")}
            />
            작성자
          </label>
        </div>
      </div>
      <h2>{categoryName ? `${categoryName} 카테고리 게시글` : '게시글 목록'}</h2>
      {posts.length === 0 ? (
        <p>게시물이 없습니다.</p>
      ) : (
        <table>
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
                onClick={() => handleRowClick(post.id)} // 행 클릭 이벤트 추가
                style={{ cursor: 'pointer' }} // 클릭 가능하게 커서 스타일 추가
              >
                <td>{index + 1}</td>
                <td>{post.username}</td>
                <td>{post.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
            )}
      <div className="pagination-buttons">
        <a
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          이전
        </a>
        {[...Array(totalPages).keys()].map((num) => (
          <a
            key={num + 1}
            onClick={() => handlePageChange(num + 1)}
            className={currentPage === num + 1 ? 'active' : ''}
          >
            {num + 1}
          </a>
        ))}
        <a
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음
        </a>
      </div>
    </div>
  );
}

export default PostList;
