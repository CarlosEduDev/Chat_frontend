import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Chat } from './components/chat/chat';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {path: 'login', component: Login},
    {
        path: 'chat',
        component: Chat,
        canActivate: [authGuard]
    },
    {path: '', redirectTo: 'login', pathMatch: 'full' }
];
