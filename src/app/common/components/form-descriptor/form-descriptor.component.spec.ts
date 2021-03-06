import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FormDescriptorComponent } from './form-descriptor.component';

describe('FormDescriptorComponent', () => {
  let component: FormDescriptorComponent;
  let fixture: ComponentFixture<FormDescriptorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [FormDescriptorComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDescriptorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
