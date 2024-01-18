// src/app/fts-alert.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertConfig, AlertType } from '../models/alert-config.model';

@Injectable({
  providedIn: 'root'
})
export class FtsAlertService {
  private alertSubject = new Subject<AlertConfig>();

  alert$ = this.alertSubject.asObservable();

  alert(alertType: AlertType, message: string, isAutoDismissable?: boolean, autoDismissIn?: number, buttonEnabled?: boolean, buttonText?: string) {
    this.alertSubject.next({
      alertType,
      message,
      buttonEnabled,
      buttonText: buttonText || 'OK',
      isAutoDismissable: isAutoDismissable !== undefined ? isAutoDismissable : true,
      autoDismissIn: autoDismissIn !== undefined ? autoDismissIn : 2000
    });
  }

  clear() {
    this.alertSubject.next({} as AlertConfig); // Provide an empty object to close the modal
  }
}

