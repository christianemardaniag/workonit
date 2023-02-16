import { Component, OnInit } from '@angular/core';
import * as html2pdf from 'html2pdf.js';

import { DbhelperService } from 'src/app/services/dbhelper.service';


@Component({
  selector: 'app-student-resume-view',
  templateUrl: './student-resume-view.component.html',
  styleUrls: ['./student-resume-view.component.css']
})
export class StudentResumeViewComponent implements OnInit {
  constructor(public db: DbhelperService) { }
  student: any = {};
  showButton = true
  ngOnInit(): void {
    this.student = this.db.getCurrentStudent();
    console.log(this.student)
  }

  async generateResume() {
    this.showButton = false
    const element = document.getElementById('resume-content');
    console.log(element)
    const options = {
      margin: [0, .5, 0, 0],
      filename: this.student.firstName + " " + this.student.lastName + ".pdf",
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().from(element).set(options).save();
  }


}
