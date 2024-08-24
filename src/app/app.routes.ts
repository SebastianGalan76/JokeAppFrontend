import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthComponent } from './auth/auth.component';
import { SignInFormComponent } from './auth/sign-in-form/sign-in-form.component';

export const routes: Routes = [
    { 
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'signIn',
                component: SignInFormComponent
            }
        ]

    },
    { path: '', component: HomePageComponent },
];
