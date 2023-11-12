import React from "react";

function RecentPosts() {
  const recentPosts = JSON.parse(sessionStorage.getItem("recentPosts")) || [];

  return (
    <div>
      <h2>최근 본 게시물</h2>
      <ul>
        {recentPosts.map((postId, index) => (
          <li key={index}>{`id: ${postId}`}</li>
        ))}
      </ul>
    </div>
  );
}

export default RecentPosts;