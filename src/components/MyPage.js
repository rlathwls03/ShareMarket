import React, { useState, useEffect } from 'react';
import './MyPage.css';

function MyPage() {
  const [userId, setUserId] = useState(''); // 사용자 ID
  const [username, setUsername] = useState(''); // 사용자 이름
  const [email, setEmail] = useState(''); // 이메일
  const [currentPassword, setCurrentPassword] = useState(''); // 현재 비밀번호
  const [newPassword, setNewPassword] = useState(''); // 새 비밀번호
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지
  const [successMessage, setSuccessMessage] = useState(''); // 성공 메시지

  useEffect(() => {
    // 사용자 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const token = sessionStorage.getItem('authToken'); // 저장된 토큰 가져오기
        const response = await fetch('http://localhost:3000/getUserInfo', {
          method: 'GET',
          headers: {
            Authorization: token, // 토큰을 헤더에 포함
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserId(data.userId);
          setUsername(data.username);
          setEmail(data.email);
        } else {
          setErrorMessage('사용자 정보를 불러오지 못했습니다.');
        }
      } catch (error) {
        setErrorMessage('서버와의 연결에 문제가 발생했습니다.');
      }
    };

    fetchUserInfo();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!username || !email || !currentPassword) {
      setErrorMessage('모든 필드를 입력해주세요.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/updateProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          username,
          email,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('정보가 성공적으로 수정되었습니다.');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        setErrorMessage(data.message || '정보 수정에 실패했습니다.');
      }
    } catch (error) {
      setErrorMessage('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className="mypage">
      <h2>마이페이지</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleUpdateProfile}>
        <div>
          <label>사용자 ID:</label>
          <input
            type="text"
            value={userId}
            disabled // 수정 불가
          />
        </div>
        <div>
          <label>사용자 이름:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="사용자 이름"
          />
        </div>
        <div>
          <label>이메일:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일"
          />
        </div>
        <div>
          <label>현재 비밀번호:</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="현재 비밀번호"
          />
        </div>
        <div>
          <label>새 비밀번호:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호"
          />
        </div>
        <button type="submit">정보 수정</button>
      </form>
    </div>
  );
}

export default MyPage;
