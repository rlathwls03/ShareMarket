import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetails.css';

function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null); // 게시물 정보 상태
  const [comments, setComments] = useState([]); // 댓글 상태
  const [commentText, setCommentText] = useState(''); // 댓글 입력 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [user, setUser] = useState(null); // 현재 사용자 정보 (로그인 상태)
  const [visibility, setVisibility] = useState('public'); // 댓글 공개 범위 상태 (기본값: public)
  const navigate = useNavigate(); // 네비게이션을 위한 hook 추가

  useEffect(() => {
    // 로그인 상태 확인 (예시: 세션 스토리지에서 사용자 정보 가져오기)
    const loggedUser = sessionStorage.getItem('username');
    if (loggedUser) {
      setUser({ username: loggedUser });
    } else {
      setUser("");
    }


    console.log('Logged in user:', loggedUser); // 로그인한 사용자 정보 출력

    setLoading(true);
    fetch(`http://localhost:3000/api/posts/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setPost(data.post);
        setLoading(false);
        console.log('Post data:', data.post); // 게시글 정보 출력
      })
      .catch((error) => {
        console.error('게시물 상세 정보 로딩 오류:', error);
        setLoading(false);
      });
  }, [id]);

  // 디버깅을 위한 useEffect 추가
  useEffect(() => {
    console.log('User:', user); // 로그인한 사용자 정보
    console.log('Post author:', post?.username); // 게시물 작성자 정보
  }, [user, post]); // user 또는 post가 변경될 때 실행

  // const handleAddComment = () => {
  //   if (commentText.trim()) {
  //     setComments([...comments, commentText]);
  //     setCommentText('');
  //   }
  // };

  const handleGoToPostList = () => {
    navigate('/postlist');
  };

  const handleEditPost = () => {
    navigate(`/edit/${post.id}`, { state: { username: user.username } }); // username을 state로 전달
  };

  const handleDeletePost = () => {
    if (window.confirm('게시물을 삭제하시겠습니까?')) {
      fetch(`http://localhost:3000/api/posts/${post.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user.username }), // 현재 사용자 이름 전송
      })
        .then((response) => {
          if (response.ok) {
            alert('게시물이 삭제되었습니다.');
            navigate('/postlist', { state: { deletedPostId: post.id } }); // 삭제된 게시물 ID 전달
          } else {
            response.json().then((data) => {
              alert(data.message || '게시물 삭제에 실패했습니다.');
            });
          }
        })
        .catch((error) => {
          console.error('게시물 삭제 오류:', error);
        });
    }
  };

    //댓글 추가기능
    useEffect(() => {
      fetch(`http://localhost:3000/api/posts/${id}/comments`)
        .then((response) => response.json())
        .then((data) => {
          setComments((data.comments)); // 댓글 리스트 설정
        })
        .catch((error) => {
          console.error('댓글 로딩 오류:', error);
        });
    }, [id]);

      // 댓글 내용 표시 함수
      const getCommentContent = (comment) => {
        if (comment.visibility === 'private') {
          if (user?.username === comment.username || user?.username === comment.postUsername) {
            return comment.commentText;
          } else {
            return '비밀 댓글입니다';
          }
        }
        return comment.commentText;
      };
    
    
    const handleAddComment = () => {
      if (commentText.trim()) {
        fetch(`http://localhost:3000/api/posts/${post.id}/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: user.username, // 현재 사용자 이름
            commentText, // 댓글 내용
            visibility, // 댓글 공개 범위 (공개/비공개)
          }),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error('댓글 추가 실패');
            }
          })
          .then((data) => {
            setComments([...comments, { username: user.username, commentText, visibility }]);
            setCommentText('');
          })
          .catch((error) => {
            console.error('댓글 추가 오류:', error);
          });
      }
    };
    

    const handleDeleteComment = (commentId) => {
      if (window.confirm('댓글을 삭제하시겠습니까?')) {
        fetch(`http://localhost:3000/api/posts/${post.id}/comments/${commentId}`, {
          method: 'DELETE',
        })
          .then((response) => {
            if (response.ok) {
              alert('댓글이 삭제되었습니다.');
              setComments(comments.filter((comment) => comment.id !== commentId));
            } else {
              throw new Error('댓글 삭제 실패');
            }
          })
          .catch((error) => {
            console.error('댓글 삭제 오류:', error);
          });
      }
    };
    



  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (!post) {
    return <div>해당 게시물을 찾을 수 없습니다.</div>;
  }

  const userUsername = user && user.username ? user.username.trim() : '';
  const postUsername = post && post.username ? post.username.trim() : '';




  return (
    <div className="comment-section">
      <h2>{post.title}</h2>

      <table>
        <tbody>
          <tr>
            <th>작성자</th>
            <td>{post.username}</td> {/* 작성자 정보 추가 */}
          </tr>
          <tr>
            <th>제목</th>
            <td>{post.title}</td>
          </tr>
          <tr>
            <th>설명</th>
            <td>{post.description}</td>
          </tr>
          <tr>
            <th>카테고리</th>
            <td>{post.category}</td>
          </tr>
          <tr>
            <th>금액</th>
            <td>{post.price.toLocaleString()} 원</td>
          </tr>
          <tr>
            <th>이미지</th>
            <td>
              {post.image && (
                <img
                  src={`http://localhost:3000${post.image}`}
                  alt={post.title}
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {/* 로그인한 사용자와 게시글 작성자가 동일한 경우에만 수정/삭제 버튼 표시 */}
      {userUsername.toLowerCase() === postUsername.toLowerCase() && (
        <div className="action-buttons">
          <button onClick={handleEditPost}>수정</button>
          <button onClick={handleDeletePost}>삭제</button>
        </div>
      )}


      <h3>댓글</h3>
      <ul>
  {comments.map((comment) => (
    <li key={comment.id}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ fontWeight: 'bold' }}>{comment.username}</td> {/* 작성자 */}
            <td style={{ textAlign: 'right', fontSize: '0.8em', color: 'gray' }}>
              {new Date(comment.createdAt).toLocaleString()} {/* 작성 시간 */}
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ paddingTop: '8px' }}>
              {getCommentContent(comment)} {/* 댓글 내용 */}
            </td>
          </tr>
        </tbody>
      </table>
      
      {comment.username === user.username && (
        <button onClick={() => handleDeleteComment(comment.id)}>삭제</button>
      )}
    </li>
  ))}
</ul>

{user ? (
  <div>
    <textarea
      value={commentText}
      onChange={(e) => setCommentText(e.target.value)}
      placeholder="댓글을 입력하세요"
    ></textarea>

    {/* 공개/비공개 선택 */}
    <div className="visibility-options">
      <div className="radio-option" onClick={() => setVisibility('public')}>
        <input
          type="radio"
          name="visibility"
          value="public"
          checked={visibility === 'public'}
          readOnly
        />
        <span>공개</span>
      </div>
      <div className="radio-option" onClick={() => setVisibility('private')}>
        <input
          type="radio"
          name="visibility"
          value="private"
          checked={visibility === 'private'}
          readOnly
        />
        <span>비공개</span>
      </div>
    </div>
    
    <button onClick={handleAddComment}>댓글 추가</button>
  </div>
) : (
  <p>댓글 작성은 로그인 후 가능합니다.</p>
)}
      <br />
      <button onClick={handleGoToPostList}>게시글 목록으로 가기</button>
    </div>
  );
}

export default PostDetails;
