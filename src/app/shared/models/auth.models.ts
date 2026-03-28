// --- Request Payloads ---

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role?: 'STUDENT' | 'TUTOR';
}

export interface LoginRequest {
  email: string;
  password: string;
}


// --- Response Structures ---

/**
 * Generic wrapper for all backend responses.
 */
export interface ApiResponse<T> {
  responseStatus: string;
  requestUUID: string;
  data: T;
  traceError: string | null;
}

/**
 * The structure of the `data` object in the login response.
 */
export interface LoginResponseData {
  token: string;
  tokenType: string;
}

/**
 * Represents the full user profile object returned from the /me endpoint.
 */
export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  status: number;
  roles: string[];
  permissions: string[];
  image: number[],
  provider: string,
  tutorId: number,
  userType: string,
  coverPhotoUrl?: string;
}

/**
 * The object that will be stored in localStorage and held in the BehaviorSubject.
 * It combines the token with the full user profile.
 */
export interface AuthenticatedUser {
  token: string;
  user: UserProfile;
}
