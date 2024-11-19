import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'warning-dialog',
  standalone: true,
  imports: [MatIcon, MatButtonModule],
  templateUrl: './warning-dialog.component.html',
  styles: [``], 
})
export class WarningDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<WarningDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}
  onClose(): void {
    this.dialogRef.close();
  }
}
