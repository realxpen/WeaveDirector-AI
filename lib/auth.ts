export type AuthUser = {
  name: string
  email: string
  password: string
  createdAt: string
}

export type SessionUser = {
  sessionId?: string
  name: string
  email: string
  signedInAt: string
}

export type UserProfile = {
  email: string
  name: string
  headline: string
  bio: string
  location: string
  website: string
  joinedAt: string
  avatarUrl: string
  coverUrl: string
  updatedAt: string
}

const USERS_KEY = "weavedirector.users"
const SESSION_KEY = "weavedirector.session"
const PROFILES_KEY = "weavedirector.profiles"
const ACTIVE_SESSIONS_KEY = "weavedirector.activeSessions"

export type ActiveSession = {
  id: string
  email: string
  device: string
  browser: string
  location: string
  lastActiveAt: string
  signedInAt: string
}

function inBrowser() {
  return typeof window !== "undefined"
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function detectDevice(): string {
  if (!inBrowser()) return "Unknown Device"
  const ua = window.navigator.userAgent
  if (/iPhone/i.test(ua)) return "iPhone"
  if (/Android/i.test(ua)) return "Android Phone"
  if (/iPad/i.test(ua)) return "iPad"
  if (/Macintosh/i.test(ua)) return "Mac"
  if (/Windows/i.test(ua)) return "Windows PC"
  return "Desktop"
}

function detectBrowser(): string {
  if (!inBrowser()) return "Unknown Browser"
  const ua = window.navigator.userAgent
  if (/Edg/i.test(ua)) return "Edge"
  if (/Chrome/i.test(ua) && !/Edg/i.test(ua)) return "Chrome"
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return "Safari"
  if (/Firefox/i.test(ua)) return "Firefox"
  return "Browser"
}

function readUsers(): AuthUser[] {
  if (!inBrowser()) return []
  const raw = window.localStorage.getItem(USERS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as AuthUser[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeUsers(users: AuthUser[]) {
  if (!inBrowser()) return
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function readProfiles(): UserProfile[] {
  if (!inBrowser()) return []
  const raw = window.localStorage.getItem(PROFILES_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as UserProfile[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeProfiles(profiles: UserProfile[]) {
  if (!inBrowser()) return
  window.localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles))
}

function readActiveSessions(): ActiveSession[] {
  if (!inBrowser()) return []
  const raw = window.localStorage.getItem(ACTIVE_SESSIONS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as ActiveSession[]
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeActiveSessions(sessions: ActiveSession[]) {
  if (!inBrowser()) return
  window.localStorage.setItem(ACTIVE_SESSIONS_KEY, JSON.stringify(sessions))
}

function defaultProfile(name: string, email: string): UserProfile {
  const now = new Date().toISOString()
  return {
    email,
    name,
    headline: "Creative Director",
    bio: "Passionate about blending AI with design workflows and campaign execution.",
    location: "Lagos, Nigeria",
    website: "",
    joinedAt: now,
    avatarUrl: "",
    coverUrl: "",
    updatedAt: now,
  }
}

function ensureProfile(name: string, email: string) {
  const profiles = readProfiles()
  const exists = profiles.some((p) => normalizeEmail(p.email) === normalizeEmail(email))
  if (exists) return
  writeProfiles([...profiles, defaultProfile(name, email)])
}

export function signUpLocal(name: string, email: string, password: string): SessionUser {
  const normalizedEmail = normalizeEmail(email)
  const users = readUsers()
  const exists = users.some((user) => normalizeEmail(user.email) === normalizedEmail)
  if (exists) {
    throw new Error("Account already exists for this email.")
  }

  const newUser: AuthUser = {
    name: name.trim(),
    email: normalizedEmail,
    password,
    createdAt: new Date().toISOString(),
  }
  writeUsers([...users, newUser])
  ensureProfile(newUser.name, newUser.email)
  const sessionId = generateId()
  const session: SessionUser = {
    sessionId,
    name: newUser.name,
    email: newUser.email,
    signedInAt: new Date().toISOString(),
  }
  const sessions = readActiveSessions().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(newUser.email)
  )
  sessions.push({
    id: sessionId,
    email: newUser.email,
    device: detectDevice(),
    browser: detectBrowser(),
    location: "Unknown",
    lastActiveAt: new Date().toISOString(),
    signedInAt: session.signedInAt,
  })
  writeActiveSessions(sessions)
  setSession(session)
  return session
}

export function signInLocal(email: string, password: string): SessionUser {
  const normalizedEmail = normalizeEmail(email)
  const users = readUsers()
  const match = users.find(
    (user) => normalizeEmail(user.email) === normalizedEmail && user.password === password
  )
  if (!match) {
    throw new Error("Invalid email or password.")
  }

  const sessionId = generateId()
  const session: SessionUser = {
    sessionId,
    name: match.name,
    email: match.email,
    signedInAt: new Date().toISOString(),
  }
  ensureProfile(match.name, match.email)
  const sessions = readActiveSessions().filter(
    (item) => normalizeEmail(item.email) !== normalizeEmail(match.email)
  )
  sessions.push({
    id: sessionId,
    email: match.email,
    device: detectDevice(),
    browser: detectBrowser(),
    location: "Unknown",
    lastActiveAt: new Date().toISOString(),
    signedInAt: session.signedInAt,
  })
  writeActiveSessions(sessions)
  setSession(session)
  return session
}

export function getSession(): SessionUser | null {
  if (!inBrowser()) return null
  const raw = window.localStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as SessionUser
    if (!parsed?.email) return null
    return parsed
  } catch {
    return null
  }
}

export function isSignedIn(): boolean {
  return Boolean(getSession())
}

export function setSession(session: SessionUser) {
  if (!inBrowser()) return
  const normalized = {
    ...session,
    sessionId: session.sessionId || generateId(),
  }
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(normalized))
}

export function getProfile(email: string): UserProfile | null {
  const normalizedEmail = normalizeEmail(email)
  const profiles = readProfiles()
  return profiles.find((p) => normalizeEmail(p.email) === normalizedEmail) ?? null
}

export function getCurrentUserProfile(): UserProfile | null {
  const session = getSession()
  if (!session) return null
  return getProfile(session.email)
}

export function saveProfile(update: Partial<UserProfile> & { email: string }): UserProfile {
  const normalizedEmail = normalizeEmail(update.email)
  const profiles = readProfiles()
  const index = profiles.findIndex((p) => normalizeEmail(p.email) === normalizedEmail)
  const existing = index >= 0 ? profiles[index] : defaultProfile(update.name ?? "User", normalizedEmail)
  const next: UserProfile = {
    ...existing,
    ...update,
    email: normalizedEmail,
    updatedAt: new Date().toISOString(),
  }

  if (index >= 0) {
    profiles[index] = next
  } else {
    profiles.push(next)
  }
  writeProfiles(profiles)
  return next
}

export function updateDisplayName(email: string, name: string): void {
  const normalizedEmail = normalizeEmail(email)
  const users = readUsers()
  const userIndex = users.findIndex((u) => normalizeEmail(u.email) === normalizedEmail)
  if (userIndex >= 0) {
    users[userIndex] = { ...users[userIndex], name: name.trim() }
    writeUsers(users)
  }

  const session = getSession()
  if (session && normalizeEmail(session.email) === normalizedEmail) {
    setSession({ ...session, name: name.trim() })
  }
}

export function updateAccountLocal(
  currentEmail: string,
  nextName: string,
  nextEmail: string
): SessionUser {
  const fromEmail = normalizeEmail(currentEmail)
  const toEmail = normalizeEmail(nextEmail)
  const users = readUsers()
  const userIndex = users.findIndex((u) => normalizeEmail(u.email) === fromEmail)
  if (userIndex < 0) {
    throw new Error("Current account was not found.")
  }

  const emailTaken =
    fromEmail !== toEmail &&
    users.some((u) => normalizeEmail(u.email) === toEmail)
  if (emailTaken) {
    throw new Error("Another account already uses this email.")
  }

  users[userIndex] = {
    ...users[userIndex],
    name: nextName.trim(),
    email: toEmail,
  }
  writeUsers(users)

  const profiles = readProfiles()
  const profileIndex = profiles.findIndex((p) => normalizeEmail(p.email) === fromEmail)
  if (profileIndex >= 0) {
    profiles[profileIndex] = {
      ...profiles[profileIndex],
      email: toEmail,
      name: nextName.trim(),
      updatedAt: new Date().toISOString(),
    }
    writeProfiles(profiles)
  }

  const current = getSession()
  if (!current || normalizeEmail(current.email) !== fromEmail) {
    throw new Error("Please sign in again.")
  }

  const sessions = readActiveSessions().map((item) =>
    normalizeEmail(item.email) === fromEmail ? { ...item, email: toEmail } : item
  )
  writeActiveSessions(sessions)

  const nextSession: SessionUser = {
    ...current,
    name: nextName.trim(),
    email: toEmail,
  }
  setSession(nextSession)
  return nextSession
}

export function updatePasswordLocal(
  email: string,
  currentPassword: string,
  newPassword: string
): void {
  const normalizedEmail = normalizeEmail(email)
  const users = readUsers()
  const userIndex = users.findIndex((u) => normalizeEmail(u.email) === normalizedEmail)
  if (userIndex < 0) {
    throw new Error("Account not found.")
  }
  if (users[userIndex].password !== currentPassword) {
    throw new Error("Current password is incorrect.")
  }
  users[userIndex] = { ...users[userIndex], password: newPassword }
  writeUsers(users)
}

export function listActiveSessionsForCurrentUser(): ActiveSession[] {
  const session = getSession()
  if (!session) return []
  const normalizedEmail = normalizeEmail(session.email)
  const currentSessionId = session.sessionId
  const sessions = readActiveSessions()
    .filter((item) => normalizeEmail(item.email) === normalizedEmail)
    .map((item) => {
      if (item.id === currentSessionId) {
        return { ...item, lastActiveAt: new Date().toISOString() }
      }
      return item
    })
  writeActiveSessions(sessions)
  return sessions.sort((a, b) => b.lastActiveAt.localeCompare(a.lastActiveAt))
}

export function revokeActiveSession(sessionId: string): boolean {
  const current = getSession()
  const sessions = readActiveSessions()
  const next = sessions.filter((item) => item.id !== sessionId)
  const changed = next.length !== sessions.length
  if (changed) {
    writeActiveSessions(next)
  }

  if (current?.sessionId === sessionId) {
    signOutLocal()
    return true
  }
  return false
}

export function signOutLocal() {
  if (!inBrowser()) return
  const current = getSession()
  if (current?.sessionId) {
    const sessions = readActiveSessions().filter((item) => item.id !== current.sessionId)
    writeActiveSessions(sessions)
  }
  window.localStorage.removeItem(SESSION_KEY)
}
