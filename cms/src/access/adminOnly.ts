import type { PayloadRequest } from 'payload'

export const adminOnly = ({ req: { user } }: { req: PayloadRequest }): boolean =>
  user?.collection === 'users' && user.role === 'admin'
