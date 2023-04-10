import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HomeComponent } from './components/home/home.component';
import { TaskFormModalComponent } from './components/task-form-modal/task-form-modal.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastGlobalComponent } from './components/toast-global/toast-global.component';


@NgModule({
  declarations: [
    DashboardComponent,
    HomeComponent,
    TaskFormModalComponent,
    ToastGlobalComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  exports: [
    ToastGlobalComponent
  ],
  imports: [
    CommonModule,
    //BrowserModule,
    DashboardRoutingModule,
    NgbModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgbToastModule,
    NgIf,
    NgTemplateOutlet,
    NgFor
  ],
  providers: [
    NgbActiveModal
  ],
  bootstrap: [HomeComponent, DashboardComponent ],
  entryComponents: [
    TaskFormModalComponent
  ]
})
export class DashboardModule { }
