import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-file-limit-dialog',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './file-limit-dialog.component.html',
  styles: [``], 
})
export class FileLimitDialogComponent {
  constructor(private dialogRef: MatDialogRef<FileLimitDialogComponent>) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
