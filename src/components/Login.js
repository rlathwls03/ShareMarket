import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login({ onLogin }) {
  // onLogin prop 추가
  const [userId, setUserId] = useState(''); // 사용자 이름 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태
  const navigate = useNavigate(); // 페이지 리디렉션을 위한 hook

  // 로그인 처리 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지

    const response = await fetch('http://localhost:3000/login', {
      // 백엔드 API 호출
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, password }),
    });

    const data = await response.json();

    if (response.ok) {
      sessionStorage.setItem('authToken', data.token); // 로그인 성공 시 토큰 저장
      sessionStorage.setItem('username', data.username); // 사용자명 저장
      onLogin(data.username); // 부모 컴포넌트에 로그인 정보를 알림
      alert(`${data.username}님, 환영합니다.`); // 팝업창으로 환영
      navigate('/'); // 로그인 후 홈 페이지로 이동
    } else {
      setErrorMessage(data.message || '로그인 실패');
    }
  };

  return (
    <div className="login">
      <h2>로그인</h2>
      <p>계정에 로그인하세요!</p>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)} // 사용자 입력 처리
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // 비밀번호 입력 처리
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button type="submit">로그인</button>
      </form>
      <p>
        아직 계정이 없으신가요?{' '}
        <a href="/signup" className="signup-link">
          회원가입
        </a>{' '}
        하세요.
      </p>
    </div>
  );
}

export default Login;
