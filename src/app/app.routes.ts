import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { HomeComponent } from "./home/home.component";

export const routes: Routes = [
    { path: '', component: HomeComponent },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: 'oauth2/redirect',
        loadComponent: () => import('./features/auth/oauth2-redirect-handler/oauth2-redirect-handler.component').then(m => m.OAuth2RedirectHandlerComponent)
    },
    {
        path: 'auth',
        children: [
            {
                path: 'login',
                loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
            },
            {
                path: 'register',
                loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
            },
            {
                path: 'upload-photo',
                loadComponent: () => import('./features/auth/photo-upload/photo-upload.component').then(m => m.PhotoUploadComponent),
            },
            { path: '', redirectTo: 'login', pathMatch: 'full' }
        ]
    },
    {
        path: 'tutor',
        children: [
            {
                path: 'register',
                loadComponent: () => import('./features/tutor/tutor-registration/tutor-registration.component').then(m => m.TutorRegistrationComponent),
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/user-profile/user-profile.component').then(m => m.UserProfileComponent),
    },
    {
        path: 'details/:id',
        loadComponent: () => import('./features/tutor/tutor-details/tutor-details.component').then(m => m.TutorDetailsComponent),
    },
    {
        path: 'time-slots',
        loadComponent: () => import('./features/tutor/tutor-time-slots/tutor-time-slots.component').then(m => m.TutorTimeSlotsComponent),
    },
    {
        path: 'sessions',
        children: [
            {
                path: 'tutor/:id',
                loadComponent: () => import('./features/tutor/tutor-sessions/tutor-sessions.component').then(m => m.TutorSessionsComponent)
            },
            {
                path: 'user/:id',
                loadComponent: () => import('./features/user/user-sessions/user-sessions.component').then(m => m.UserSessionsComponent)
            }
        ]
    },
    {
        path: 'tutor-home',
        loadComponent: () => import('./features/tutor/tutor-home/tutor-home.component').then(m => m.TutorHomeComponent),
        canActivate: [authGuard]
    },
    {
        path: 'video-stream/:id',
        loadComponent: () => import('./features/video-stream-component/video-stream-component.component').then(m => m.VideoStreamComponentComponent),
        canActivate: [authGuard]
    },
    {
        path: 'create-time-slot',
        loadComponent: () => import('./features/tutor/create-time-slot/create-time-slot.component').then(m => m.CreateTimeSlotComponent),
        canActivate: [authGuard]
    },
    { path: '**', redirectTo: '' }
];
