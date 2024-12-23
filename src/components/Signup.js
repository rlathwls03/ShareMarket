import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 회원가입 후 리디렉션
import './Signup.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // 페이지 리디렉션

  // 회원가입 처리 함수
  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !userId || !password || !email) {
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/signup', {
        // 실제 백엔드 URL로 교체
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, userId, password, email }),
      });

      const data = await response.json();

      if (response.ok) {
        // 회원가입 성공 후 로그인 페이지로 리디렉션
        navigate('/login');
      } else {
        setErrorMessage(data.message || '회원가입에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="signup">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="사용자 이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default Signup;
