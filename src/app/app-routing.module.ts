import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { ProfileComponent } from './profile/profile.component';
import { BoardComponent } from './board/board.component';
import { LoginComponent } from './login/login.component';
import { LoggedOutGuard } from './guards/logged-out.guard';

const stringEmpty = '';

const routes: Routes = [
  {
    path: stringEmpty,
    component: HomeComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: 'board/:id',
    component: BoardComponent,
    canActivate: [LoggedInGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
