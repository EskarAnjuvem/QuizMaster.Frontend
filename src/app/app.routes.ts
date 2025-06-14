import { Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CreateQuestionTypesComponent } from './pages/create-question-types/create-question-types.component';
import { CreateSubjectsComponent } from './pages/create-subjects/create-subjects.component';
import { CreateTagsComponent } from './pages/create-tags/create-tags.component';
import { QuestionEntryComponent } from './pages/question-entry/question-entry.component';

export const routes: Routes = [
    { path: 'create-question-type', component:CreateQuestionTypesComponent},
    { path: 'create-subjects', component:CreateSubjectsComponent},
    { path: 'create-tags', component:CreateTagsComponent},
    { path: 'question-entry', component:QuestionEntryComponent},
    { path: 'about', component:AboutComponent},
    { path: '', redirectTo:'about', pathMatch : 'full'},
];
