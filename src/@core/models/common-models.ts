export enum FreelancerStatus {
  approved = 'approved',
  rejected = 'rejected',
  pending = 'pending',
  blocked = 'blocked',
  close = 'close'
}
export enum Role {
  // Admin = 1,
  // Manager = 2,
  // User = 3
  Admin = 'admin',
  Manager = 'manager',
  User = 'user'
}

export class User {
  email: String
fullName: String
iat: Number
id: String
isAdmin: true
permissions: []
}