export type UseTraceOptionText =
  | 'my brand'
  | 'training'
  | 'real estate'
  | 'museums'
  | 'personal'
  | 'other';

export type ButtonType = 'remove' | 'restore' | 'revoke';

export type GenericResponse = { ok: boolean };

export enum MemberType {
  USER = 'user',
  TEAM = 'team',
}

export enum ApplicationRole {
  USER = 'User',
  ADMIN = 'Admin',
}
