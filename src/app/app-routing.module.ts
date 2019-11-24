import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoggedInGuard } from './core/guards/logged-in.guard';
import { ProfileComponent } from './profile/profile.component';
import { BoardComponent } from './board/board.component';

const stringEmpty = '';

const routes: Routes = [
  {
    path: stringEmpty,
    component: HomeComponent,
    canActivate: [LoggedInGuard]
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
