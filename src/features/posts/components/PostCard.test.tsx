// src/features/posts/components/PostCard.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import PostCard from './PostCard'
import type { Post } from '../types'

// ── Mocks ─────────────────────────────────────────────────
vi.mock('../hooks/useLikePost', () => ({
  useLikePost: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}))

vi.mock('../../auth/auth.store', () => ({
  useAuthStore: () => ({
    id:   'user-1',
    name: 'Test User',
  }),
}))

vi.mock('../../bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    isBookmarked: () => false,
    toggleBookmark: vi.fn(),
  }),
}))

// ── Mock post ─────────────────────────────────────────────
const mockPost: Post = {
  id:        'post-1',
  userId:    'user-1',
  author:    'Rakshit Dave',
  content:   'Hello world this is a test post',
  createdAt: '2m ago',
  likes:     5,
  likedBy:   [],
  comments:  [],
}

function renderPostCard(post = mockPost) {
  return render(
    <MemoryRouter>
      <PostCard post={post} />
    </MemoryRouter>
  )
}

// ── Tests ─────────────────────────────────────────────────
describe('PostCard', () => {
  it('renders author name', () => {
    renderPostCard()
    expect(screen.getByText('Rakshit Dave')).toBeInTheDocument()
  })

  it('renders post content', () => {
    renderPostCard()
    expect(screen.getByText('Hello world this is a test post')).toBeInTheDocument()
  })

  it('renders like count', () => {
    renderPostCard()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('renders timestamp', () => {
    renderPostCard()
    expect(screen.getByText('2m ago')).toBeInTheDocument()
  })

  it('shows comment section when Comment button clicked', () => {
    renderPostCard()
    const commentBtn = screen.getByText('Comment')
    fireEvent.click(commentBtn)
    expect(screen.getByText('No comments yet.')).toBeInTheDocument()
  })

  it('shows liked state when user has liked', () => {
    const likedPost = { ...mockPost, likedBy: ['user-1'] }
    renderPostCard(likedPost)
    expect(screen.getByText('❤️')).toBeInTheDocument()
  })

  it('renders initials avatar from author name', () => {
    renderPostCard()
    expect(screen.getByText('RD')).toBeInTheDocument()
  })
})