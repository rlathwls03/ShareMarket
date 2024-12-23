import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Link 대신 useNavigate 추가
import './SearchResults.css';

function SearchResults() {
  const [posts, setPosts] = useState([]); // 검색 결과 저장
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 메시지 관리
  const navigate = useNavigate(); // 페이지 이동을 위한 hook

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get('query') || ''; // 검색어 가져오기
  const searchOption = queryParams.get('option') || 'title'; // 검색 타입 (기본값: title)

  useEffect(() => {
    // 서버로 검색 요청 보내기
    const fetchSearchResults = async () => {
      try {
        setLoading(true); // 로딩 시작
        const response = await fetch(
          `http://localhost:3000/search?${searchOption}=${encodeURIComponent(
            searchTerm
          )}`
        );
        if (!response.ok) {
          throw new Error('검색 결과를 가져오는 데 실패했습니다.');
        }
        const data = await response.json();
        setPosts(data.posts || []); // 검색 결과 업데이트
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchSearchResults();
  }, [searchTerm, searchOption]);

  const handleRowClick = (postId) => {
    navigate(`/post/${postId}`); // 해당 게시물 상세 페이지로 이동
  };

  return (
    <div className="search-results">
      <h2>검색 결과: "{searchTerm}"</h2>
      {loading && <p>로딩 중...</p>}
      {error && <p className="error-message">오류: {error}</p>}

      {!loading && !error && posts.length > 0 ? (
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
      ) : (
        !loading && !error && <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
}

export default SearchResults;