import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import CategoryPage from "./components/CategoryPage"; // 카테고리 페이지
import CategoryDropdown from "./components/CategoryDropdown"; // 카테고리 드롭다운
import NewPost from "./components/NewPost";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MyPage from "./components/MyPage";
import PostDetails from "./components/PostDetails"; // 게시물 상세 보기
import PostList from "./components/PostList"; // 게시글 목록 페이지
import EditPost from "./components/EditPost";
import CategoryUI from './components/CategoryUI';
import "./App.css";

function App() {
  const [searchTerm, setSearchTerm] = useState(""); // 검색 상태 관리
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    const storedUsername = sessionStorage.getItem("username");
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("username");
    setIsLoggedIn(false);
    setUsername("");
  };

  const handleLogin = (username) => {
    setIsLoggedIn(true);
    setUsername(username);
  };

  const handleSearch = (event) => {
    if (event.key === "Enter" && searchTerm.trim() !== "") {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  return (
    <Router>
      <div>
        {/* 상단 네비게이션 바 */}
        <nav className="navbar">
          <div className="navbar-left">
            <Link to="/" className="home-link">
              ShareMarket
            </Link>
          </div>
          <div className="navbar-center">
            <input
              type="text"
              className="search-bar"
              placeholder="게시물을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // 검색어 업데이트
              onKeyPress={handleSearch} // Enter 키 이벤트 처리
            />
          </div>
          <div className="navbar-right">
            {isLoggedIn ? (
              <>
                <Link to="/mypage" className="button" id="menuButton">
                  마이페이지
                </Link>
                <button onClick={handleLogout} className="button">
                  로그아웃
                </button>
                <Link to="/new" className="button" id="menuButton">
                  게시물 등록
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="button" id="menuButton">
                  로그인
                </Link>
                <Link to="/signup" className="button" id="menuButton">
                  회원가입
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* 카테고리 드롭다운 */}
        <CategoryDropdown />

        {/* 라우팅 설정 */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/new" element={<NewPost />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/category/:categoryName" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/post/:id" element={<PostDetails username={username} />} />
          <Route path="/postlist" element={<PostList />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/category-ui" element={<CategoryUI />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
