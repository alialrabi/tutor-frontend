export interface UserProfile {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

export interface Tutor {
  id: number;
  userProfile: UserProfile;
  bio: string;
  experienceYears: number;
  hourlyRate: number;
  acceptsOneToOne: boolean;
  acceptsOneToMany: boolean;
  rating: number;
  totalReviews: number;
  status: number;
  numberOfSessions?: number;
  videoId?: string;
  categoryId?: number;
}
