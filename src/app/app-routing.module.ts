import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskBoardComponent } from './task-board/task-board.component';
import { CompletedTasksBoardComponent } from './completed-tasks-board/completed-tasks-board.component';

const routes: Routes = [
  { path: 'dashboard', component: TaskBoardComponent },
  { path: 'completed-tasks', component: CompletedTasksBoardComponent },
  // { path: '', redirectTo: '/dashboard', pathMatch: 'full' } // default path
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
