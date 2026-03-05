// src/features/search/SearchPage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import SearchPage from './SearchPage'

// ── Mocks ─────────────────────────────────────────────────
vi.mock('../../lib/firebase', () => ({ db: {} }))

const mockPosts = [
  {
    id: 'p1', userId: 'u1', author: 'Rakshit Dave',
    content: 'Hello world post', createdAt: '1m ago',
    likes: 3, likedBy: [], comments: [],
  },
  {
    id: 'p2', userId: 'u2', author: 'Alice Smith',
    content: 'Another post here', createdAt: '2m ago',
    likes: 1, likedBy: [], comments: [],
  },
]

const mockUsers = [
  { id: 'u1', name: 'Rakshit Dave', photoURL: null },
  { id: 'u2', name: 'Alice Smith',  photoURL: null },
]

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query:      vi.fn(),
  orderBy:    vi.fn(),
  limit:      vi.fn(),
  getDocs:    vi.fn().mockResolvedValue({
    docs: [
      { id: 'p1', data: () => ({ userId: 'u1', author: 'Rakshit Dave', content: 'Hello world post', createdAt: null, likes: 3, likedBy: [], comments: [] }) },
      { id: 'p2', data: () => ({ userId: 'u2', author: 'Alice Smith',  content: 'Another post here', createdAt: null, likes: 1, likedBy: [], comments: [] }) },
    ],
  }),
}))

vi.mock('../posts/components/PostCard', () => ({
  default: ({ post }: any) => <div data-testid="post-card">{post.content}</div>,
}))

function renderSearch() {
  return render(<MemoryRouter><SearchPage /></MemoryRouter>)
}

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders search input', () => {
    renderSearch()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('shows initial empty state', () => {
    renderSearch()
    expect(screen.getByText(/search for posts or people/i)).toBeInTheDocument()

  })

  it('shows results after typing', async () => {
    renderSearch()
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'hello' } })
    await waitFor(() => {
      expect(screen.queryByText(/search for people or posts/i)).not.toBeInTheDocument()
    }, { timeout: 600 })
  })

  it('clears results when input cleared', async () => {
    renderSearch()
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'hello' } })
    fireEvent.change(input, { target: { value: '' } })
    await waitFor(() => {
      expect(screen.getByText(/search for posts or people/i)).toBeInTheDocument()
    })
  })

  it('search input accepts text', () => {
    renderSearch()
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'Rakshit' } })
    expect(input).toHaveValue('Rakshit')
  })
})