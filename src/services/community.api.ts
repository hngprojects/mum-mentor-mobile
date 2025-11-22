// src/services/community/community.api.ts

import axios from "axios";

// 👉 Replace this with your real API base URL later
const API = axios.create({
  baseURL: "https://mock-community-api.com",
});

// ---------- FEED ----------
export const fetchCommunityFeed = async (page: number = 1) => {
  // MOCK RESPONSE
  return [
    {
      id: "1",
      userName: "Sarah",
      userImage: "https://picsum.photos/200",
      caption: "Loved this moment ❤️",
      images: [
        "https://picsum.photos/500",
        "https://picsum.photos/501",
        "https://picsum.photos/502",
      ],
      createdAt: new Date().toISOString(),
    },
  ];
};

// ---------- LOAD MORE ----------
export const loadMorePosts = async (page: number) => {
  // MOCK MORE POSTS
  return [
    {
      id: Math.random().toString(),
      userName: "Debbie",
      userImage: "https://picsum.photos/203",
      caption: "Another beautiful day 🌞",
      images: ["https://picsum.photos/509"],
      createdAt: new Date().toISOString(),
    },
  ];
};

// ---------- GET POST BY ID ----------
export const getPostById = async (postId: string) => {
  // MOCK
  return {
    id: postId,
    userName: "Sarah",
    userImage: "https://picsum.photos/200",
    caption: "Full post details 🎉",
    images: [
      "https://picsum.photos/700",
      "https://picsum.photos/701",
      "https://picsum.photos/702",
    ],
    createdAt: new Date().toISOString(),
  };
};

// ---------- CREATE POST ----------
export const createPost = async ({
  caption,
  imageUrls,
}: {
  caption: string;
  imageUrls: string[];
}) => {
  // MOCK POST CREATED SUCCESSFULLY
  return {
    success: true,
    post: {
      id: Math.random().toString(),
      userName: "You",
      userImage: "https://picsum.photos/208",
      caption,
      images: imageUrls,
      createdAt: new Date().toISOString(),
    },
  };
};

// ---------- DELETE POST ----------
export const deletePost = async (postId: string) => {
  // MOCK DELETE SUCCESS
  return { success: true };
};
