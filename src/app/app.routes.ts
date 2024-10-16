import { Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthComponent } from './auth/auth.component';
import { SignInFormComponent } from './auth/sign-in-form/sign-in-form.component';
import { SignUpFormComponent } from './auth/sign-up-form/sign-up-form.component';
import { ResetPasswordRequireFormComponent } from './auth/reset-password-require-form/reset-password-require-form.component';
import { ResetPasswordFormComponent } from './auth/reset-password-form/reset-password-form.component';
import { JokeListComponent } from './home-page/joke-list/joke-list.component';
import { AddJokeComponent } from './home-page/add-joke/add-joke.component';
import { CategoryListComponent } from './home-page/category-list/category-list.component';
import { CategoryJokeComponent } from './home-page/browse-joke/category-joke.component';
import { RandomJokeComponent } from './home-page/random-joke/random-joke.component';
import { UserJokeListComponent } from './home-page/user-joke-list/user-joke-list.component';
import { FavoriteJokeListComponent } from './home-page/favorite-joke-list/favorite-joke-list.component';
import { ListJokeContainerComponent } from './home-page/list-joke-container/list-joke-container.component';
import { EditJokeComponent } from './home-page/edit-joke/edit-joke.component';
import { BestJokeListComponent } from './home-page/best-joke-list/best-joke-list.component';
import { RulesComponent } from './home-page/rules/rules.component';
import { PrivacyPolicyComponent } from './home-page/privacy-policy/privacy-policy.component';
import { JokeVerificationComponent } from './admin-panel/joke-verification/joke-verification.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

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
            },
            {
                path: 'active/:uuid',
                component: SignInFormComponent
            }
        ]

    },
    {
        path: 'admin',
        component: AdminPanelComponent,
        children: [
            {
                path: 'verification/:index',
                component: JokeVerificationComponent
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
                path: 'edit/:id',
                component: EditJokeComponent
            },
            {
                path: 'favorite',
                component: FavoriteJokeListComponent
            },
            {
                path: 'favorite/page/:page',
                component: FavoriteJokeListComponent
            },
            {
                path: 'best',
                component: BestJokeListComponent
            },
            {
                path: 'best/page/:page',
                component: BestJokeListComponent
            },
            {
                path: 'categories',
                component: CategoryListComponent
            },
            {
                path: 'category/:url',
                component: CategoryJokeComponent
            },
            {
                path: 'random',
                component: RandomJokeComponent
            },
            {
                path: 'joke-list',
                component: UserJokeListComponent
            },
            {
                path: 'list/:uuid',
                component: ListJokeContainerComponent
            },
            {
                path: 'rules',
                component: RulesComponent
            },
            {
                path: 'privacy-policy',
                component: PrivacyPolicyComponent
            },
            {
                path: 'page/:page',
                component: JokeListComponent
            },
            {
                path: '',
                component: JokeListComponent
            }
        ]

    },
    { path: '**', redirectTo: '' }
];
