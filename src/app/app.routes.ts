import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthComponent } from './auth/auth.component';
import { SignInFormComponent } from './auth/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './auth/sign-up-form/sign-up-form.component';
import { ResetPasswordRequireFormComponent } from './auth/reset-password-require-form/reset-password-require-form.component';
import { ResetPasswordFormComponent } from './auth/reset-password-form/reset-password-form.component';
import { JokeListComponent } from './home-page/joke-list/joke-list.component';
import { AddJokeComponent } from './home-page/add-joke/add-joke.component';

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
            },
            {
                path: 'requireResetPassword',
                component: ResetPasswordRequireFormComponent
            },
            {
                path: 'resetPassword',
                component: ResetPasswordFormComponent
            }
        ]

    },
    { 
        path: '', 
        component: HomePageComponent,
        children: [
            {
                path: 'create',
                component: AddJokeComponent
            },
            {
                path: '',
                component: JokeListComponent
            }
        ]

    },
    { path: '**', redirectTo: '' }
];
