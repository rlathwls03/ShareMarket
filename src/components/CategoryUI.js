import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "./CategoryList"; // 카테고리 목록 데이터
import "./CategoryUI.css";

function CategoryUI() {
  return (
    <div className="category-ui">
      <h2>카테고리 목록</h2>
      <ul>
        {CATEGORIES.map((category) => (
          <li key={category}>
            <Link to={`/category/${category}`}>{category}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CategoryUI;
