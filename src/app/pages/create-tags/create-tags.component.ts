import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-create-tags',
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './create-tags.component.html',
  styleUrl: './create-tags.component.css'
})
export class CreateTagsComponent {
  tags: any[] = [];
  showTagList: boolean = false;
  showTagButtonText: string = "Show Existing Tags";
  http = inject(HttpClient);
  tagText: string = "";
  tagObject: any = {
    id: "",
    tagName: ""
  }
  errorMessage: string = "";

  //https://academyofphysics-production.up.railway.app/

  OnShowTags() {
    this.http.get<any[]>("https://academyofphysics-production.up.railway.app/api/TagReadWrite")
      .subscribe({
        next: (data) => {
          data.sort((a, b) => a.tagName.toLowerCase().localeCompare(b.tagName.toLowerCase()));
          this.tags = data;
        },
        error: (err) => this.errorMessage = "List can't be loaded"
      })
    this.showTagList = !this.showTagList;
    if (this.showTagList) {
      this.showTagButtonText = "Hide Existing Tags"
    }
    else if (!this.showTagList) {
      this.showTagButtonText = "Show List of Tags"
    }

  }

  OnSubmittingTag() {
    console.log(this.tagText);
    this.http.post("https://academyofphysics-production.up.railway.app/api/TagReadWrite", { tagName: this.tagText })
      .subscribe({
        next: (data: any) => { console.log("Success") },
        error: (err) => { console.log("Error") }
      })
  }

}
