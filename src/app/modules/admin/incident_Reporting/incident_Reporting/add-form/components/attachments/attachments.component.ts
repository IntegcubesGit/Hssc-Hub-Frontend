import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';  // Import CommonModule
import { AddFormComponent } from '../../add-form.component';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [MatButton, MatCard, MatIcon, CommonModule],  
  templateUrl: './attachments.component.html',
  styles: [],
})
export class AttachmentsComponent implements OnInit
{
  filess:any =[];
  files: { name: string; type: string; icon: string }[] = [
    { name: 'File-attachment-1', type: 'PDF', icon: 'description' },
    { name: 'File-attachment-2', type: 'Excel', icon: 'insert_drive_file' },
    { name: 'File-attachment-3', type: 'Word', icon: 'insert_drive_file' },
  ];
  selectedFile: { name: string; type: string; icon: string } | null = null;
  isDrawerOpen: boolean = false;
  caseId:string=null;

  constructor(
    private _fuseComponentsComponent: AddFormComponent,
    private caseService:Incident_ReportingService,
    private route: ActivatedRoute, 


  ) 
  {}
  ngOnInit(): void 
  {
    this.caseId = this.route.parent?.snapshot.paramMap.get('id');
    this.getAllCaseFiles();
    
  }

 

  openDrawer(file: { name: string; type: string; icon: string }) {
    this.selectedFile = file;
    this.isDrawerOpen = true;
  }

  closeDrawer() {
    this.isDrawerOpen = false;
    this.selectedFile = null;
  }

  toggleDrawer(): void {
    this._fuseComponentsComponent.matDrawer.toggle();
  }

  // Handle file selection
  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileType = this.getFileType(file.name);
      const fileIcon = this.getFileIcon(fileType);

      // Add selected file to the list
      this.files.push({
        name: file.name,
        type: fileType,
        icon: fileIcon,
      });
      
      // Optionally, upload the file
      //this.uploadFile(file);
    }
  }

  // Helper method to get file type based on file extension
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'PDF';
      case 'xlsx':
        return 'Excel';
      case 'docx':
        return 'Word';
      default:
        return 'Unknown';
    }
  }

  // Helper method to get file icon based on file type
  getFileIcon(fileType: string): string {
    switch (fileType) {
      case 'PDF':
        return 'description';
      case 'Excel':
        return 'insert_drive_file';
      case 'Word':
        return 'insert_drive_file';
      default:
        return 'insert_drive_file';
    }
  }


  uploadFile(file: File,remarks:string): void 
  {
    this.caseService.uploadCaseAttachment('cases',this.caseId,remarks,file).subscribe(
      {
          next: (response) => 
            {
              
            },
          error: (error) => 
            {
              console.error('Error uploading the attachment', error);
            }
      });
    this.getAllCaseFiles();
  }

  downloadFile(fileName:string)
  {
      this.caseService.downloadCaseAttachment('cases',fileName).subscribe(
        {
            next: (response) => 
              {
                
              },
              error: (error) => 
              {
                console.error('Error downlaoding the attachment', error);
              }
        });
  }
  getAllCaseFiles()
  {
    this.caseService.getAllCaseAttachments(this.caseId).subscribe(
      {
          next: (response) => 
            {
              this.filess = response;
            },
          error: (error) => 
            {
              console.error('Error fetching case attachments data:', error);
            }
      });
  }
}
