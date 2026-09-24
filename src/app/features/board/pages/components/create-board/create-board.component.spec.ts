import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBoardComponent } from './create-board.component';

describe('CreateBoardComponent', () => {
  let component: CreateBoardComponent;
  let fixture: ComponentFixture<CreateBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBoardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
