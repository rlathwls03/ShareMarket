import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from './CategoryList'; // 카테고리 데이터 가져오기
import './CategoryDropdown.css';

function CategoryDropdown() {
  return (
    <div className="category-dropdown" role="menu">
      <button
        className="category-button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        카테고리
      </button>
      <div className="dropdown-content" role="menu">
        {CATEGORIES.map((category, index) => (
          <Link key={index} to={`/category/${category}`} role="menuitem">
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default CategoryDropdown;
