// src/app/fts-alert/fts-alert.component.ts
import { Component, OnInit } from '@angular/core';
import { FtsAlertService } from '../services/fts-alert.service';
import { AlertConfig, AlertType } from '../models/alert-config.model';

@Component({
  selector: 'app-fts-alert',
  templateUrl: './fts-alert.component.html',
  styleUrls: ['./fts-alert.component.scss']
})
export class FtsAlertComponent implements OnInit {
  alertConfig!: AlertConfig;

  constructor(private alertService: FtsAlertService) {
  }

  ngOnInit() {
    this.alertService.alert$.subscribe(config => {
      this.alertConfig = config;
      if (this.alertConfig.isAutoDismissable) {
        this.autoDismissAlert();
      }
    });
  }

  autoDismissAlert() {
    setTimeout(() => {
      this.closeAlert();
    }, this.alertConfig.autoDismissIn);
  }

  closeAlert() {
    this.alertService.clear();
  }

  getAlertClass(): string {
    if (this.alertConfig) {
      switch (this.alertConfig.alertType) {
        case AlertType.Success:
          return 'alert_success';
        case AlertType.Warning:
          return 'alert_warning';
        case AlertType.Error:
          return 'alert_error';
        case AlertType.Info:
          return 'alert_info';
        default:
          return '';
      }
    }
    return '';
  }
}
