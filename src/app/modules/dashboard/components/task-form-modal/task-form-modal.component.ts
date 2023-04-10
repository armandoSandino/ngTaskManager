import {
  Component,
  OnInit,
  Input,
  NgZone,
  AfterViewInit,
  AfterContentInit,
  OnDestroy,
  LOCALE_ID,
  Inject,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, concat } from 'rxjs';
import { statesTask, priorityTask } from 'src/app/shared/utils/utils';
import { finalize } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { CollaboratorService } from '../../services/collaborator.service';
import { TaskService } from '../../services/task.service';
import { NgbActiveModal, NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../../services/toast.service';
import Swal from 'sweetalert2/dist/sweetalert2.js';

@Component({
  selector: 'app-task-form-modal',
  templateUrl: './task-form-modal.component.html',
  styleUrls: ['./task-form-modal.component.css'],
  providers: [
    NgbModalConfig,
    NgbModal
  ]
})
export class TaskFormModalComponent implements OnInit, AfterViewInit, AfterContentInit, AfterViewChecked, OnDestroy {


  // ViewChild Variables
  @ViewChild('content') contentElement!: ElementRef;

  // Input variables
  @Input() action = 'New';

  // Ouputp variables
  @Output() listenerAction: EventEmitter<any>;

  // HTML variables
  btnActionSaveHtml = document.getElementById('btnActionSave') as HTMLElement;
  btnActionSave: HTMLElement = this.btnActionSaveHtml;
  actionCloseHtml = document.getElementById('actionClose') as HTMLElement;
  actionClose: HTMLElement = this.actionCloseHtml;

  public taskForm!: FormGroup;
  loading = false;

  collaborators$!: Observable<any[]>;
  selectedCollaboratorId: any = null;
  selectedStateId: any = null;
  selectedPriorityId: any = null;
  selectedTaskId: any = null;
  collaboratorsList: any[] = [];
  stateList = statesTask;
  priorityList = priorityTask;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public zone: NgZone,
    private formBuilder: FormBuilder,
    private collaboratorService: CollaboratorService,
    private taskService: TaskService,
    public activityModal: NgbActiveModal,
    config: NgbModalConfig,
    private modalService: NgbModal,

    public toastService: ToastService,

    @Inject(LOCALE_ID) private locale: string
  ) {

    this.listenerAction = new EventEmitter<any>();
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      Id: [null],
      UserId: [null],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      State: [null, [Validators.required]],
      Priority: [null, [Validators.required]],
      Description: [null, [Validators.required]],
      Collaborator: [null, [Validators.required]],
      Notes: [null, []]
    });
  }

  ngAfterViewInit(): void {
    this.btnActionSave = document.getElementById('btnActionSave') as HTMLElement;
    this.actionClose = document.getElementById('actionClose') as HTMLElement;
  }

  ngAfterContentInit(): void {
    this.getCollaborators();
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.toastService.clear();
  }

  save($event: any): void | any {

    this.loading = true;
    if (this.taskForm.valid) {

      const foundState: any = this.stateList.filter((res) => res.id === this.taskForm.controls['State'].value);
      const foundPriority: any = this.priorityList.filter((res) => res.id === this.taskForm.controls['Priority'].value);
      let payload = {
        startDate: this.getFormatDate(this.taskForm.get('startDate')?.value.toString().trim()),
        endDate: this.getFormatDate(this.taskForm.get('endDate')?.value.toString().trim()),
        state: foundState[0]?.name,
        priority: foundPriority[0]?.name,
        description: this.taskForm.controls['Description'].value ? this.taskForm.controls['Description'].value.toString().trim() : ' ',
        collaborator: this.taskForm.controls['Collaborator'].value.toString().trim(),
        collaborator_id: parseInt(this.taskForm.controls['Collaborator'].value.toString().trim()),
        notes: this.taskForm.controls['Notes'].value ? this.taskForm.controls['Notes'].value.toString().trim() : ' ',
      };

      if (this.action === 'Edit') {
        this.taskService.updateTask(payload, this.taskForm.controls['Id']?.value )
          .pipe(finalize(() => {
            this.loading = false;
          })).subscribe((response: any ) => {

            this.listenerAction.emit( response );
            this.taskForm.reset();
            this.changeDetectorRef.detectChanges();
            this.modalService.dismissAll();

            this.showNotification('The operation was successful.',
            'The task was edited successfully.',
            'success');

          }, (error) => {
            console.error('Error when update task ', error);
            this.showNotification('Something is not right.',
            'Please try again.',
            'error');
          }, () => { });
      }

      if (this.action === 'Add') {
        this.taskService.createTask(payload)
          .pipe(finalize(() => {
            this.loading = false;
          })).subscribe((response) => {

            this.listenerAction.emit(response);
            this.taskForm.reset();
            this.changeDetectorRef.detectChanges();
            this.modalService.dismissAll();
            this.showNotification('The operation was successful.',
            'The task was created correctly.',
            'success');
          }, (error) => {
            console.error('Error when creating task ', error);
            this.showNotification('Something is not right.',
            'Please try again.',
            'error');
          }, () => { });
      }

    }

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

  onListenerStateChange($event: any): void | any {

  }

  onListenerPriorityChange($event: any): void | any {

  }

  closingForm($event: any): void | any {
    this.taskForm.reset();
  }

  // show modal
  public open() {
    this.modalService.open(this.contentElement, {
      scrollable: true,
      size: 'lg'
    });
  }

  public actionOperation(action: string, identifier?: any | number | string) {
    
    this.action = action;
    this.selectedTaskId = identifier;
    //
    this.changeDetectorRef.detectChanges();
    //

    if (this.action === 'Edit') {
      this.taskService.getTask(this.selectedTaskId)
        .subscribe((response: any) => {
          if (response?.data) {
            this.taskForm.controls['Id']?.patchValue(response?.data?.id);
            this.taskForm.controls['startDate']?.patchValue(response?.data?.startDate);
            this.taskForm.controls['endDate']?.patchValue(response?.data?.endDate);
            this.taskForm.controls['Description']?.patchValue(response?.data?.description);
            this.taskForm.controls['Collaborator']?.patchValue(response?.data?.collaborator_id);
            this.taskForm.controls['Notes']?.patchValue(response?.data?.notes);
            let foundState = this.stateList.find((res) => res?.name === response?.data?.state);
            this.taskForm.controls['State']?.patchValue(foundState?.id);
            let foundPriority = this.priorityList.find((res) => res?.name === response?.data?.priority);
            this.taskForm.controls['Priority']?.patchValue(foundPriority?.id);
            this.changeDetectorRef.detectChanges();
          }
        }, (error: any) => {
          console.error('Error getting task ', error);
        });
    }

  }

  showNotification(title: string, description: string, type: string ): void {
    switch( type ){
      case 'success':{
        Swal.fire(title, description, 'success' );
      }break;
      case 'warning': {
        Swal.fire(title, description, 'warning' );
      }break;
      case 'error': {
        Swal.fire(title, description, 'error' );
      }break;  
      default: break;
    }
  }

  getFormatDate(date: string | any, isFullTime?: boolean | any): string {
    let formattDate = '';
    if (isFullTime !== null && isFullTime !== undefined) {
      formattDate = 'yyyy-MM-dd HH:mm:ss a zzzz';
    } else {
      formattDate = 'yyyy-MM-dd HH:mm:ss';
    }
    return ''.concat(
      formatDate(
        new Date(date),
        formattDate,
        this.locale)
    );
  }

}
