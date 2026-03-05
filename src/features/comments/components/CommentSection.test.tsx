// src/features/comments/components/CommentSection.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CommentSection from './CommentSection'
import type { Comment } from '../types'

// ── Mocks ─────────────────────────────────────────────────
vi.mock('../../../lib/firebase', () => ({
  db: {},
}))

vi.mock('firebase/firestore', () => ({
  doc:        vi.fn(),
  updateDoc:  vi.fn().mockResolvedValue(undefined),
  arrayUnion: vi.fn((val) => val),
}))

vi.mock('../../auth/auth.store', () => ({
  useAuthStore: () => ({ id: 'user-1', name: 'Rakshit Dave' }),
}))

const mockComments: Comment[] = [
  { id: 'c1', author: 'Alice', userId: 'u1', content: 'Great post!', createdAt: '2024-01-01' },
  { id: 'c2', author: 'Bob',   userId: 'u2', content: 'Nice work!',  createdAt: '2024-01-02' },
]

describe('CommentSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders existing comments', () => {
    render(<CommentSection comments={mockComments} postId="post-1" />)
    expect(screen.getByText('Great post!')).toBeInTheDocument()
    expect(screen.getByText('Nice work!')).toBeInTheDocument()
  })

  it('renders comment authors', () => {
    render(<CommentSection comments={mockComments} postId="post-1" />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('shows empty state when no comments', () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    expect(screen.getByText('No comments yet.')).toBeInTheDocument()
  })

  it('renders comment input field', () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument()
  })

  it('renders Reply button', () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    expect(screen.getByText('Reply')).toBeInTheDocument()
  })

  it('Reply button is disabled when input is empty', () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    expect(screen.getByText('Reply')).toBeDisabled()
  })

  it('Reply button enables when text is entered', () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    fireEvent.change(screen.getByPlaceholderText('Write a comment...'), {
      target: { value: 'My comment' },
    })
    expect(screen.getByText('Reply')).not.toBeDisabled()
  })

  it('calls updateDoc when comment submitted', async () => {
    const { updateDoc } = await import('firebase/firestore')
    render(<CommentSection comments={[]} postId="post-1" />)
    fireEvent.change(screen.getByPlaceholderText('Write a comment...'), {
      target: { value: 'Test comment' },
    })
    fireEvent.click(screen.getByText('Reply'))
    await waitFor(() => {
      expect(updateDoc).toHaveBeenCalled()
    })
  })

  it('clears input after submitting', async () => {
    render(<CommentSection comments={[]} postId="post-1" />)
    const input = screen.getByPlaceholderText('Write a comment...')
    fireEvent.change(input, { target: { value: 'Test comment' } })
    fireEvent.click(screen.getByText('Reply'))
    await waitFor(() => {
      expect(input).toHaveValue('')
    })
  })

  it('renders correct number of comments', () => {
    render(<CommentSection comments={mockComments} postId="post-1" />)
    const authors = screen.getAllByText(/Alice|Bob/)
    expect(authors).toHaveLength(2)
  })
})