// src/features/bookmarks/BookmarksPage.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BookmarksPage from './BookmarksPage'

// ── Mocks ─────────────────────────────────────────────────
vi.mock('../../lib/firebase', () => ({ db: {} }))

vi.mock('../auth/auth.store', () => ({
  useAuthStore: () => ({ id: 'user-1', name: 'Rakshit Dave' }),
}))

const mockBookmarkedPosts = [
  {
    id: 'p1', userId: 'u1', author: 'Rakshit Dave',
    content: 'Bookmarked post one', createdAt: '1m ago',
    likes: 2, likedBy: [], comments: [],
  },
]

let snapshotCallback: any = null

vi.mock('firebase/firestore', () => ({
  collection:  vi.fn(),
  query:       vi.fn(),
  orderBy:     vi.fn(),
  onSnapshot:  vi.fn((q, cb) => {
    snapshotCallback = cb
    cb({
      docs: [{ id: 'p1', data: () => ({ postId: 'p1' }) }],
    })
    return vi.fn()
  }),
  doc:     vi.fn(),
  getDoc:  vi.fn().mockResolvedValue({
    exists: () => true,
    id: 'p1',
    data: () => mockBookmarkedPosts[0],
  }),
}))

vi.mock('../posts/components/PostCard', () => ({
  default: ({ post }: any) => <div data-testid="post-card">{post.content}</div>,
}))

function renderBookmarks() {
  return render(<MemoryRouter><BookmarksPage /></MemoryRouter>)
}

describe('BookmarksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders page heading', () => {
    renderBookmarks()
    expect(screen.getByText(/bookmarks/i)).toBeInTheDocument()
  })

it('shows loading state initially', () => {
  renderBookmarks()
  const spinner = document.querySelector('.animate-spin')
  expect(spinner).toBeTruthy()
})
  it('shows empty state when no bookmarks', async () => {
    const { onSnapshot } = await import('firebase/firestore')
    vi.mocked(onSnapshot).mockImplementationOnce((q, cb: any) => {
      cb({ docs: [] })
      return vi.fn()
    })
    renderBookmarks()
    await waitFor(() => {
      expect(screen.getByText(/no bookmarks yet/i)).toBeInTheDocument()
    })
  })

  it('renders bookmarked posts', async () => {
    renderBookmarks()
    await waitFor(() => {
      expect(screen.getAllByTestId('post-card')).toHaveLength(1)
    })
  })

  it('shows bookmarked post content', async () => {
    renderBookmarks()
    await waitFor(() => {
      expect(screen.getByText('Bookmarked post one')).toBeInTheDocument()
    })
  })
})