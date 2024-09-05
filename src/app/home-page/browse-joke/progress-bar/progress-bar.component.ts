import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {
  @Input({ required: true }) progressBar!: ProgressBarSettings;
}

export class ProgressBarSettings {
  left: string = '';
  title: string = '';
  right: string = '';
  progress: number = 0;
}