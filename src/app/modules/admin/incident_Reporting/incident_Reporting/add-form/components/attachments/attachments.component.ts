import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';  // Import CommonModule

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [MatButton, MatCard, MatIcon, CommonModule],  // Include CommonModule here
  templateUrl: './attachments.component.html',
  styles: [],
})
export class AttachmentsComponent { 
  /**
   *
   */
  constructor() {
    
  }
  files: { name: string; type: string; icon: string }[] = [
    { name: 'File-attachment-1', type: 'PDF', icon: 'description' },
    { name: 'File-attachment-2', type: 'Excel', icon: 'insert_drive_file' },
    { name: 'File-attachment-3', type: 'Word', icon: 'insert_drive_file' },
  ];



  selectedFile: { name: string; type: string; icon: string } | null = null;
  isDrawerOpen: boolean = false;

  openDrawer(file: { name: string; type: string; icon: string }) {
    this.selectedFile = file;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedFile = null;
  }
}
