import { Component } from '@angular/core';
import { BinComponent } from '../bin/bin.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms'

@Component({
  selector: 'app-dashboard',
  imports: [BinComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {}
