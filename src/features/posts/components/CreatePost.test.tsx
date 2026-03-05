// src/features/posts/components/CreatePost.test.tsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import CreatePost from './CreatePost'

// ── Mocks ─────────────────────────────────────────────────
const mockMutateAsync = vi.fn()

vi.mock('../hooks/useCreatePost', () => ({
  useCreatePost: () => ({
    mutateAsync: mockMutateAsync,
    isPending: false,
  }),
}))

vi.mock('../../auth/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'user-1', name: 'Rakshit Dave', email: 'test@test.com', photoURL: null },
  }),
}))

vi.mock('../../../components/ui/Toast', () => ({
  useToast: () => ({
    toast: { success: vi.fn(), error: vi.fn() },
  }),
}))

// ── Tests ─────────────────────────────────────────────────
describe('CreatePost', () => {
  it('renders textarea placeholder', () => {
    render(<CreatePost />)
    expect(screen.getByPlaceholderText("What's on your mind?")).toBeInTheDocument()
  })

  it('shows Post button', () => {
    render(<CreatePost />)
    fireEvent.focus(screen.getByPlaceholderText("What's on your mind?"))
    expect(screen.getByText('Post')).toBeInTheDocument()
  })

  it('Post button is disabled when empty', () => {
    render(<CreatePost />)
    fireEvent.focus(screen.getByPlaceholderText("What's on your mind?"))
    const btn = screen.getByText('Post')
    expect(btn).toBeDisabled()
  })

  it('Post button enables when content entered', () => {
    render(<CreatePost />)
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.focus(textarea)
    fireEvent.change(textarea, { target: { value: 'Hello world' } })
    expect(screen.getByText('Post')).not.toBeDisabled()
  })

  it('calls mutateAsync with content on submit', async () => {
    render(<CreatePost />)
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.focus(textarea)
    fireEvent.change(textarea, { target: { value: 'Test post content' } })
    fireEvent.click(screen.getByText('Post'))
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith('Test post content')
    })
  })

  it('shows character counter when typing', () => {
    render(<CreatePost />)
    const textarea = screen.getByPlaceholderText("What's on your mind?")
    fireEvent.focus(textarea)
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    expect(screen.getByText('275')).toBeInTheDocument()
  })

  it('renders user initials in avatar', () => {
    render(<CreatePost />)
    expect(screen.getByText('RD')).toBeInTheDocument()
  })
})