import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCardDetailsComponent } from './task-card-details.component';

describe('TaskCardDetailsComponent', () => {
  let component: TaskCardDetailsComponent;
  let fixture: ComponentFixture<TaskCardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
