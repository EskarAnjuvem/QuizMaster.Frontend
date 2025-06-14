import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateQuestionTypesComponent } from './create-question-types.component';

describe('CreateQuestionTypesComponent', () => {
  let component: CreateQuestionTypesComponent;
  let fixture: ComponentFixture<CreateQuestionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateQuestionTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateQuestionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
