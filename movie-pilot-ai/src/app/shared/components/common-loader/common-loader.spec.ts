import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonLoader } from './common-loader';

describe('CommonLoader', () => {
  let component: CommonLoader;
  let fixture: ComponentFixture<CommonLoader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonLoader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonLoader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
