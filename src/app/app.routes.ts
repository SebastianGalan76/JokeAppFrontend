import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthComponent } from './auth/auth.component';
import { SignInFormComponent } from './auth/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './auth/sign-up-form/sign-up-form.component';

export const routes: Routes = [
    { 
        path: 'auth',
        component: AuthComponent,
        children: [
            {
                path: 'signIn',
                component: SignInFormComponent
            },
            {
                path: 'signUp',
                component: SignUpFormComponent
            }
        ]

    },
    { path: '', component: HomePageComponent },
];
