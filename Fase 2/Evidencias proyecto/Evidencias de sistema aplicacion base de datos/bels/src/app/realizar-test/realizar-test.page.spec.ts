import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RealizarTestPage } from './realizar-test.page';

describe('RealizarTestPage', () => {
  let component: RealizarTestPage;
  let fixture: ComponentFixture<RealizarTestPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarTestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
