import { Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';  
import { AddFormComponent } from '../../add-form.component';
import { Incident_ReportingService } from '../../../incident_Reporting.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FileLimitDialogComponent } from './file-limit-dialog/file-limit-dialog.component';

@Component({
  selector: 'app-attachments',
  standalone: true,
  imports: [MatButton, MatCard, MatIcon, CommonModule],  
  templateUrl: './attachments.component.html',
  styles: [],
  providers: [DatePipe],
})
export class AttachmentsComponent implements OnInit
{
  files:any =[];
  selectedFile: { name: string; type: string; icon: string; fileSize: string; remarks: string; uploadedBy: string; uploadedAt: string; completeFileName: string;} | null = null;
  isDrawerOpen: boolean = false;
  caseId:string=null;

  constructor(
    private _fuseComponentsComponent: AddFormComponent,
    private caseService:Incident_ReportingService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private router: Router,
  ) 
  {}
  ngOnInit(): void 
  {
    this.caseId = this.route.parent?.snapshot.paramMap.get('id');
    this.getAllCaseFiles();
    
  }

  onCancel() 
    {
        this.router.navigate(['/case/incident_Reporting']);
    }

  formatDate(date: string): string | null {
    return this.datePipe.transform(date, 'h:mm a, MM/dd/yyyy');
  }

  formatSize(size: number): string {
    let formattedSize: string;
    let postfix: string;
  
    if (size < 1024) {
      formattedSize = size.toFixed(2);
      postfix = 'B'; 
    } else if (size < 1024 * 1024) {
      formattedSize = (size / 1024).toFixed(2);
      postfix = 'KB'; 
    } else if (size < 1024 * 1024 * 1024) {
      formattedSize = (size / (1024 * 1024)).toFixed(2);
      postfix = 'MB'; 
    } else {
      formattedSize = (size / (1024 * 1024 * 1024)).toFixed(2);
      postfix = 'GB'; 
    }
  
    return `${formattedSize} ${postfix}`;
  }
  
  openDrawer(file: { name: string; type: string; icon: string; fileSize: string; remarks: string; uploadedBy: string; uploadedAt: string; completeFileName: string;  }): void {
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

  onFileSelected(event: any): void {
    const selectedFiles = event.target.files;
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      const fileName = file.name;
      const fileType = this.getFileType(file.name);
      const fileIcon = this.getFileIcon(fileType);

      this.files.push({
        name: fileName,
        type: fileType,
        icon: fileIcon,
      });
      
      this.uploadFile(file,'');
    }
  }

  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pdf';
      case 'xlsx':
        return 'xlsx';
      case 'docx':
        return 'docx';
      case 'pptx':
        return 'pptx';
      case 'csv':
        return 'csv';
      default:
        return extension;
    }
  }

  getFileIcon(fileType: string): string {
    return 'insert_drive_file';
  }


  uploadFile(file: File,remarks:string): void 
  {
    // if(file.size > 1024 * 1024 * 100) 
    if(file.size > 1024 * 1024 ) // limited for 1mb for testing
    {
      this.openFileLimitWarningDialog();
      return;
    }
    else{  
    this.caseService.uploadCaseAttachment('cases',this.caseId,remarks,file).subscribe(
      {
          next: (response) => 
            {
              console.log('File uploaded successfully', response);
              this.getAllCaseFiles();
            },
          error: (error) => 
            {
              console.error('Error uploading the attachment', error);
              console.log(error);
              this.getAllCaseFiles();
            }
      });}
  }

  downloadFile(fileName: string, mainFileName: string, fileFormat:string): void {
    this.caseService.downloadCaseAttachment('cases', fileName).subscribe({
      next: (response: Blob) => {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(response);
        link.download = `${mainFileName}.${fileFormat}`.replace(/ /g, '_');
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
        console.log('File downloaded successfully');
      },
      error: (error) => {
        console.error('Error downloading the attachment', error);
      }
    });
  }

  deleteFile(fileName: string): void {
    this.caseService.deleteCaseAttachment('cases',this.caseId,fileName).subscribe({
      next: (response) => {
        console.log('File deleted successfully', response);
        this.getAllCaseFiles();
      },
      error: (error) => {
        console.error('Error deleting the attachment', error);
      }
    });
  }
  
  getAllCaseFiles() {
    this.caseService.getAllCaseAttachments(this.caseId).subscribe({
      next: (response) => {
        this.files = response.caseFiles.map(file => ({
          completeFileName: file.fileName,
          fileName: file.originalFileName,
          type: this.getFileType(file.extension),
          icon: this.getFileIcon(this.getFileType(file.extension)),
          remarks: file.remarks,
          uploadedBy: file.uploadedBy,
          uploadedAt: file.uploadTime,
          fileSize: file.fileSize,
        }));
      },
      error: (error) => {
        console.error('Error fetching case attachments data:', error);
      }
    });
  }  

  getFileClass(fileType: string): string {
    const fileClassMap: { [key: string]: string } = {
      pdf: 'bg-red-600 text-white',
      excel: 'bg-yellow-300 text-black',
      docx: 'bg-blue-600 text-white',
      powerpoint: 'bg-green-600 text-white',
      csv: 'bg-blue-300 text-black',
      txt: 'bg-gray-600 text-white',
      jpg: 'bg-green-600 text-white',
      png: 'bg-green-600 text-white',
      mp4: 'bg-orange-600 text-black',
    };
    return fileClassMap[fileType] || 'bg-black text-white';
  }

  openFileLimitWarningDialog(): void {
    this.dialog.open(FileLimitDialogComponent);
    this.getAllCaseFiles();
  }
  
}
