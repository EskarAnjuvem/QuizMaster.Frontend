import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-question-entry',
  imports: [ReactiveFormsModule, NgFor, NgIf, NgSelectModule, FormsModule],
  templateUrl: './question-entry.component.html',
  styleUrl: './question-entry.component.css'
})
export class QuestionEntryComponent implements OnInit {


  http = inject(HttpClient);
  selectedImageFile: File | null = null;
  availableTags: any[] = [];
  availableTypes: any[] = [];
  availableSubjects: any[] = [];
  difficultyLevels: any[] = [];
  selectedOption: boolean = false;
  isSubmitting: boolean = false;

  questionTransactionForm: FormGroup = new FormGroup(
    {
      questionTypeId: new FormControl(1, [Validators.required]),
      questionSubjectId: new FormControl(1, [Validators.required]),
      questionText: new FormControl("", [Validators.required]),
      questionDifficultyLevelId: new FormControl(1, [Validators.required]),
      answerColumns: new FormControl("2", [Validators.required]),
      miniPageWidth: new FormControl("0.8"),
      tagIds: new FormControl([], [Validators.required]),
      questionImageWidth: new FormControl(null),
      questionImage: new FormControl(null),
      answerOptions: new FormArray([
        new FormGroup({ answerText: new FormControl("", [Validators.required]), isCorrect: new FormControl(false) }),
        new FormGroup({ answerText: new FormControl("", [Validators.required]), isCorrect: new FormControl(false) }),
        new FormGroup({ answerText: new FormControl("", [Validators.required]), isCorrect: new FormControl(false) }),
        new FormGroup({ answerText: new FormControl("", [Validators.required]), isCorrect: new FormControl(false) })
      ])

    });

  get answerOptions(): FormArray {
    return this.questionTransactionForm.get('answerOptions') as FormArray;
  }

  ngOnInit(): void {
    this.http.get<any[]>("https://academyofphysics-production.up.railway.app/api/TagReadWrite")
      .subscribe(data => {
        data.sort((a, b) => a.tagName.localeCompare(b.tagName, undefined, { sensitivity: 'base' }));
        this.availableTags = data;
      });

    this.http.get<any[]>("https://academyofphysics-production.up.railway.app/api/QuestionEntry/questionTypes")
      .subscribe(data => {
        data.sort((a, b) => a.typeName.localeCompare(b.typeName, undefined, { sensitivity: 'base' }));
        this.availableTypes = data;

        const defaultType = this.availableTypes.find(type => type.id === 1);
        this.questionTransactionForm.get('questionType')?.setValue(defaultType.id);
      });

    this.http.get<any[]>("https://academyofphysics-production.up.railway.app/api/QuestionEntry/subjects")
      .subscribe(data => {
        data.sort((a, b) => a.subjectName.localeCompare(b.subjectName, undefined, { sensitivity: 'base' }));
        this.availableSubjects = data;

        const defaultType = this.availableSubjects.find(type => type.id === 1);
        this.questionTransactionForm.get('questionSubject')?.setValue(defaultType.id);
      });

    this.http.get<any[]>("https://academyofphysics-production.up.railway.app/api/QuestionEntry/difficultyLevels")
      .subscribe(data => {
        data.sort((a, b) => a.levelName.localeCompare(b.levelName, undefined, { sensitivity: 'base' }));
        this.difficultyLevels = data;

        const defaultType = this.difficultyLevels.find(level => level.id === 1);
        this.questionTransactionForm.get('questionDifficultyLevel')?.setValue(defaultType.id);
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      this.questionTransactionForm.patchValue({
        questionImage: file
      });
      this.questionTransactionForm.get('questionImage')?.updateValueAndValidity();
    }
  }


  onSubmit() {

    this.isSubmitting = true;
    this.questionTransactionForm.disable();


    const formData = new FormData();
    // Append form fields manually
    formData.append('questionTypeId', this.questionTransactionForm.get('questionTypeId')?.value);
    formData.append('questionSubjectId', this.questionTransactionForm.get('questionSubjectId')?.value);
    formData.append('questionText', this.questionTransactionForm.get('questionText')?.value);
    formData.append('questionDifficultyLevelId', this.questionTransactionForm.get('questionDifficultyLevelId')?.value);
    formData.append('answerColumns', this.questionTransactionForm.get('answerColumns')?.value);
    formData.append('minipageWidth', this.questionTransactionForm.get('miniPageWidth')?.value);



    const width = this.questionTransactionForm.get('questionImageWidth')?.value;
    if (width) formData.append('questionImageWidth', width);

    if (this.selectedImageFile) {
      formData.append('questionImage', this.selectedImageFile);
    }

    //const answers = this.questionTransactionForm.get('answerOptions')?.value;
    //formData.append('answerOptions', JSON.stringify(answers)); // Must be stringified

    formData.append("answerOptions", JSON.stringify(this.questionTransactionForm.value.answerOptions));
    formData.append("tagIds", JSON.stringify(this.questionTransactionForm.value.tagIds));


    this.http.post('https://academyofphysics-production.up.railway.app/api/QuestionEntry/add-question-with-answers', formData)
      .subscribe({
        next: (res) => {
          alert("Submitted successfully");
          this.resetForm();
        },
        error: (err) => {
          alert("Failed: " + err.message);
          this.questionTransactionForm.enable();
          this.isSubmitting = false;
        }
      });
  }

  resetForm() {
    this.questionTransactionForm.reset({
      questionTypeId: 1, questionSubjectId: 1, questionText: '', questionDifficultyLevelId: 1,
      answerColumns: '2', miniPageWidth: '0.8', tagIds: [], questionImageWidth: null, questionImage: null
    });        // Clear form fields
    this.selectedImageFile = null;               // Clear file variable if you're using one
    const answerArray = this.questionTransactionForm.get('answerOptions') as FormArray;
    while (answerArray.length > 0) { answerArray.removeAt(0); }

    // Reinitialize default 4 blank answers
    for (let i = 0; i < 4; i++) {
      answerArray.push(new FormGroup({
        answerText: new FormControl("", [Validators.required]),
        isCorrect: new FormControl(false)
      }));
    }

    this.questionTransactionForm.enable();       // Re-enable form
    this.isSubmitting = false;
  }

}