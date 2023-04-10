import { Component, OnInit, NgZone, AfterViewInit, AfterContentInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Task } from 'src/app/shared/models/task.model';
import { TaskFormModalComponent } from '../task-form-modal/task-form-modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { priorityTask, statesTask } from 'src/app/shared/utils/utils';
import { Observable } from 'rxjs/internal/Observable';
import { CollaboratorService } from '../../services/collaborator.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// Services
import { TaskService } from '../../services/task.service';
// Models


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit, AfterContentInit {
  //ViewChild Variables
  @ViewChild(TaskFormModalComponent) taskFormModalComponent!: TaskFormModalComponent;

  //
  btnActionModalConfirmationElement = document.getElementById('btnActionModalConfirmation');
  btnActionModalConfirmation: HTMLElement = this.btnActionModalConfirmationElement as HTMLElement;
  //
  public formFilters!: FormGroup;

  tasksList: Task[] = [];
  loading = false;

  collaborators$!: Observable<any[]>;
  selectedCollaboratorId: any = null;
  selectedStateId: any = null;
  selectedPriorityId: any = null;
  selectedTaskId: any = null;
  collaboratorsList: any[] = [];
  stateList = statesTask;
  priorityList = priorityTask;
  selectedTask: any = null;

  countPage = 10;
  pager = {
    page: 1,
    currentPage: 1,
    totalPage: 1,
    total: 1,
    quantity: 10
  };

  constructor(
    private taskService: TaskService,
    private ngZone: NgZone,
    public formBuilder: FormBuilder,
    private collaboratorService: CollaboratorService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {

  }

  ngOnInit(): void {

    this.formFilters = this.formBuilder.group({
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      Collaborator: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Priority: [null, [Validators.required]],
    });

    this.getTasks().then((res) => {
    }).catch((error) => {
    });
    this.getCollaborators();
  }

  ngAfterViewInit(): void {
    this.btnActionModalConfirmation = document.getElementById('btnActionModalConfirmation') as HTMLElement;
  }

  ngAfterContentInit(): void {
  }


  async getTasks(request?: any): Promise<any> {

    this.loading = true;

    return new Promise((resolve, reject) => {

      this.taskService.getTasks()
        .pipe(finalize(() => {
          this.loading = false;
        }))
        .subscribe((response: any) => {
          if (response?.data) {
            this.tasksList = response?.data;
          }
          resolve(response);
        }, (error) => {
          console.error('Error getting tasks ', error);
          reject(error);
        }, () => {
        });
    });
  }

  selectedDeleteTask(selectedTask: any): void | any {
    this.selectedTask = selectedTask;
    if (this.selectedTask?.state === 'PROCESO') {
      this.showNotification(
        'You cannot delete the task!',
        'The task is in progress.',
        'warning'
      );
    } else {
      this.confirmDeleteTask();
    }
  }

  selectedUpdateTask(task: any): void {
    if (task?.state === 'FINALIZADA') {
      this.showNotification(
        'You cannot edit the task!',
        'The task is finished.',
        'warning'
      );
    } else {
      this.taskFormModalComponent.actionOperation('Edit', task?.id);
      this.taskFormModalComponent.open();
    }
  }

  deleteTask($event: any): void | any {
    this.loading = true;
    this.taskService.deleteTask(this.selectedTask?.id)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe((response: any) => {

        this.pager.page = 1;
        this.getTasks();

      }, (error: any) => {
        console.error('Error deleting task ', error);
      });
  }

  onListenerAction($event: any) {
    this.getTasks();
  }

  onListenerPriorityChange($event: any): void | any {

  }

  onListenerStateChange($event: any): void | any {

  }

  getCollaborators() {
    this.collaborators$ = this.collaboratorService.getCollaboratorsAsyncPipe();
    this.collaboratorService.getCollaborators()
      .subscribe((response: any) => {
        if (response?.data) {
          this.collaboratorsList = response?.data;
          this.changeDetectorRef.detectChanges();
        }
      }, (error: any) => {
        console.error('Error getting collaborators ', error);
      });
  }

  onListenerCollaboratorChange($event: any): void | any {

  }

  filterRecords($event: any): void | any {

    if (this.formFilters.valid) {
      let foundPriority = this.priorityList.find((item) => item?.id === this.formFilters.controls['Priority']?.value);
      let foundState = this.stateList.find((item) => item?.id === this.formFilters.controls['State']?.value);
      this.taskService.getTasks({
        startDate: this.formFilters.controls['startDate'].value,
        endDate: this.formFilters.controls['endDate'].value,
        collaborator: this.formFilters.controls['Collaborator'].value,
        state: foundState?.name,
        priority: foundPriority?.name
      }).subscribe((response: any) => {
        if (response?.data) {
          this.tasksList =  response?.data;
        }
      }, (error) => {
        console.warn('Error of ', error);
      });
    }

  }

  showAllTask($event: any): void {
    this.getTasks();
  }

  showNotification(title: string, description: string, type: string): void {
    switch (type) {
      case 'success': {
        Swal.fire(title, description, 'success');
      } break;
      case 'warning': {
        Swal.fire(title, description, 'warning');
      } break;
      case 'error': {
        Swal.fire(title, description, 'error');
      } break;
      default: break;
    }
  }

  confirmDeleteTask() {

    Swal.fire({
      title: 'Notification',
      text: 'You are sure to perform the operation?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.value) {
        Swal.fire(
          'Processing transaction!',
          'Wait a moment, we are working on it!',
          'success'
        );

        this.deleteTask(null);

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Something is not right.',
          'Please try again. :)',
          'error'
        )
      }
    })
  }

  manageModal(action: string, identity: string, opeartion: string): void | any {
    switch (action) {
      case 'open': {
        if (identity === 'task') {
          if (opeartion === 'add') {
            this.taskFormModalComponent.actionOperation('Add');
            this.taskFormModalComponent.open();
          } else {
            this.taskFormModalComponent.actionOperation('Edit');
            this.taskFormModalComponent.open();
          }
        }
      } break;
      case 'close': {
      } break;
      default: break;
    }
  }
}