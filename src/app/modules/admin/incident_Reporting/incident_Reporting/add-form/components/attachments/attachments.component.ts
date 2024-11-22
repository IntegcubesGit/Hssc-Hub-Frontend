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
import { AlertService } from 'app/layout/common/alert/alert.service';
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
  caseId:string = null;
  minFileSizeLimit = 1; // define in Bytes (defined 1B as minimum file size)
  maxFileSizeLimit = 1024 * 1024; // define in Bytes (defined 1MB as maximum file size)

  constructor(
    private _fuseComponentsComponent: AddFormComponent,
    private caseService:Incident_ReportingService,
    private alertService: AlertService,
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

  onCancel() {
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
      
      if(file.size < this.minFileSizeLimit ) {
        this.fileMinLimitWarning(this.minFileSizeLimit);
        break;
      }

      if(file.size > this.maxFileSizeLimit ) { 
      this.fileMaxLimitWarning(this.maxFileSizeLimit);
      break;
      }

      this.files.push({
        name: fileName,
        type: fileType,
        icon: fileIcon,
      });

      this.uploadFile(file,'');
    }
    event.target.value = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault(); 
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault(); 
    if (!event.dataTransfer?.files) return;
    const selectedFiles = event.dataTransfer.files;
    const fakeEvent = { target: { files: selectedFiles } }; 
    this.onFileSelected(fakeEvent);
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
    this.caseService.uploadCaseAttachment('cases',this.caseId,remarks,file).subscribe(
      {
          next: (response) => 
            {
              this.alertService.triggerAlert('success', 'Success', 'File uploaded successfully.');
              this.getAllCaseFiles();
            },
          error: (error) => 
            {
              this.alertService.triggerAlert('error', 'Operation Failed', 'File uploaded failed.');
              this.getAllCaseFiles();
            }
      });
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
        this.alertService.triggerAlert('success', 'Success', 'File download to begin shortly.');
      },
      error: (error) => {
        this.alertService.triggerAlert('error', 'Operation Failed', 'File download failed.');
      }
    });
  }

  deleteFile(fileName: string): void {
    this.caseService.deleteCaseAttachment('cases',this.caseId,fileName).subscribe({
      next: (response) => {
        this.alertService.triggerAlert('success', 'Success', 'File successfully deleted.');
        this.closeDrawer();
        this.getAllCaseFiles();
      },
      error: (error) => {
        this.alertService.triggerAlert('error', 'Operation Failed', 'File deletion failed.');
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
        this.alertService.triggerAlert('error', 'File Access Failed', 'Failed to Fetch File Data.');
      }
    });
  }  

  getFileClass(fileType: string): string {
    const fileClassMap: { [key: string]: string } = {
      pdf: 'bg-red-500 text-black',
      xlsm: 'bg-green-500 text-black',
      docx: 'bg-blue-500 text-black',
      csv: 'bg-purple-500 text-black',
      powerpoint: 'bg-red-400 text-black',
      txt: 'bg-gray-500 text-black',
      jpg: 'bg-green-500 text-black',
      png: 'bg-green-500 text-black',
      mp4: 'bg-orange-500 text-black',
    };
    return fileClassMap[fileType] || 'bg-yellow-500 text-black';
  }

  fileMaxLimitWarning(fileSize: Number): void {
    fileSize = Number(fileSize) / (1024 * 1024); // converts to MB
    this.alertService.triggerAlert('warn', 'Operation Failed', `The upload file size limit is ${fileSize}MB. Please upload a file that is less than ${fileSize}MB.`);
    this.getAllCaseFiles();
  }

  fileMinLimitWarning(fileSize: Number): void {
    this.alertService.triggerAlert('warn', 'Operation Failed', `The file is too small. Please select a file larger than ${fileSize} KB.`);
    this.alertService.triggerAlert('warn', 'Operation Failed', `The file is too small. Please select a file larger than ${fileSize} KB.`);
    this.getAllCaseFiles();
  }
}
