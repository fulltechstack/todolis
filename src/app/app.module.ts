import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { FtsModalComponent } from './shared/fts-modal/fts-modal.component';
import { FormsModule } from '@angular/forms';
import { FtsModalService } from './shared/fts-modal.service';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    TaskBoardComponent,
    FtsModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [FtsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }
