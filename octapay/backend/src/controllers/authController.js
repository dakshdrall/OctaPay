import jwt from 'jsonwebtoken'

export const login = async (req, res) => {
  // TODO: implement Google OAuth / email auth and create user record
  const dummyUser = { id: 'user-1', email: 'user@example.com', name: 'Octa User' }
  const token = jwt.sign({ userId: dummyUser.id }, process.env.JWT_SECRET || 'dev', {
    expiresIn: '7d',
  })
  res.json({ user: dummyUser, token })
}

export const logout = async (req, res) => {
  // TODO: implement session invalidation if needed
  res.status(204).send()
}

export const me = async (req, res) => {
  // req.user should be set by requireAuth middleware
  res.json({ user: req.user })
}
