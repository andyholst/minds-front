import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MockService } from '../../../utils/mock';

import { FormInputSliderComponent } from './slider.component';

describe('FormInputSliderComponent', () => {
  let component: FormInputSliderComponent;
  let fixture: ComponentFixture<FormInputSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormInputSliderComponent],
      providers: [{ provide: FormBuilder, useValue: MockService(FormBuilder) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
