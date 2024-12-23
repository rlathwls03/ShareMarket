
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,  -- 고유 사용자 ID (자동 증가)
  username VARCHAR(255) UNIQUE NOT NULL,  -- 로그인에 사용될 고유 아이디 (username)
  userId VARCHAR(255) UNIQUE NOT NULL,  -- 사용자 고유 ID (login 아이디)
  password VARCHAR(255) NOT NULL,  -- 해시된 비밀번호
  email VARCHAR(255) UNIQUE NOT NULL  -- 이메일
);

GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
CREATE TABLE posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  username VARCHAR(255) NOT NULL,  -- 로그인한 사용자 이름을 저장
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE posts ADD COLUMN price INT NOT NULL DEFAULT 0; 
ALTER TABLE posts
ADD COLUMN username VARCHAR(255) NOT NULL;
DESCRIBE posts;

SHOW CREATE TABLE posts;
ALTER TABLE posts CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
DESCRIBE users;
select * from users;
select * from posts;
select * from comments;
SELECT * FROM posts 	WHERE category = '의류';
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,                -- 게시물의 ID
  username VARCHAR(255) NOT NULL,     -- 댓글 작성자
  commentText TEXT NOT NULL,          -- 댓글 내용
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- 댓글 작성 시간
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE -- 게시물 삭제 시 댓글도 삭제
);
ALTER TABLE comments
ADD COLUMN visibility ENUM('public', 'private') DEFAULT 'public';
