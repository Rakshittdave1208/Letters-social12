import type { Post } from "../features/posts/types";
import type { Comment } from "../features/comments/types";
import { mockPosts } from "../features/posts/data/mockPosts";



const PAGE_SIZE = 5;



export async function getPosts(
  page: number
): Promise<Post[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = page * PAGE_SIZE;
      const end = start + PAGE_SIZE;

      resolve(mockPosts.slice(start, end));
    }, 600);
  });
}


export async function getPostById(
  postId: string
): Promise<Post | undefined> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      resolve(post);
    }, 500);
  });
}


export async function createPostAPI(
  post: Post
): Promise<Post> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockPosts.unshift(post); // add to top
      resolve(post);
    }, 500);
  });
}


export async function likePostAPI(
  postId: string
): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        post.likes += 1;
      }
      resolve();
    }, 400);
  });
}



export async function addCommentAPI(
  postId: string,
  comment: Comment
): Promise<Comment> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPosts.find((p) => p.id === postId);
      if (post) {
        post.comments.push(comment);
      }
      resolve(comment);
    }, 400);
  });
}