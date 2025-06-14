import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateSubjectsComponent } from './create-subjects.component';

describe('CreateSubjectsComponent', () => {
  let component: CreateSubjectsComponent;
  let fixture: ComponentFixture<CreateSubjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateSubjectsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
