import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NvsFormService } from '../../services/nvs-form/nvs-form.service';
import { TextInputComponent } from '../../shared/text-input/text-input.component';
import { OptionInputComponent } from '../../shared/option-input/option-input.component';
import { TextAreaInputComponent } from '../../shared/text-area-input/text-area-input.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-nvs-form',
  standalone: true,
  imports: [TextInputComponent, OptionInputComponent, TextAreaInputComponent, ButtonComponent],
  templateUrl: './nvs-form.component.html',
  styleUrls: ['./nvs-form.component.css']
})
export class NvsFormComponent implements OnInit {
  ncrId!: number;

  formData = {
    verification_no: '',
    ncr_no: '',
    verification_result: '',
    is_effective: '',
    reminder_no: '',
    verified_by: '',
    verified_date: ''
  };

  constructor(
    private route: ActivatedRoute,
    private nvsFormService: NvsFormService  ,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam || isNaN(Number(idParam))) {
      console.error('Invalid or missing NCR ID in route.');
      return;
    }

    this.ncrId = Number(idParam);

    this.nvsFormService.getNvsByNcrId(this.ncrId).subscribe({
      next: (data) => {
        if (data) {
          this.formData = {
            ...this.formData,
            ...data
          };
        }
      },
      error: (err) => {
        console.error('Error fetching NVS data:', err);
      }
    });
  }

  onSubmit() {
    if (!this.ncrId || this.ncrId <= 0) {
      console.error('Invalid NCR ID. Cannot submit form.');
      return;
    }

    if (!this.formData.verification_no || !this.formData.ncr_no) {
      alert('Please fill required fields!');
      return;
    }

    console.log(this.formData)
    
    this.nvsFormService.saveNvsData(this.ncrId, this.formData).subscribe({
      next: (res) => {
        console.log('Success:', res);
        this.router.navigate(['/nvs-preview', this.ncrId]);
      },
      error: (err) => {
        console.error('Error submitting form', err);
        alert('Submission failed. Please check console.');
      }
    });
  }
}