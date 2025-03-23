import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';


const redirectLoggedIn = () => redirectLoggedInTo('dashboard')
const redirectunauth = () => redirectUnauthorizedTo('login')

export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectLoggedIn },
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        data: { authGuardPipe: redirectunauth },
    },
];