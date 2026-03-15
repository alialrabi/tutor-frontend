// auth.service.ts
import { Injectable } from '@angular/core';
import { OAuthService, AuthConfig } from 'angular-oauth2-oidc';

export const authConfig: AuthConfig = {
    issuer: 'https://accounts.google.com',
    redirectUri: window.location.origin,
    clientId: '125876674349-cp7mhp421bl9mmc72hj6frsc63vuihm2.apps.googleusercontent.com',
    scope: 'openid profile email',
    responseType: 'token id_token',
    showDebugInformation: true,

    strictDiscoveryDocumentValidation: false,
    skipIssuerCheck: false,
};
