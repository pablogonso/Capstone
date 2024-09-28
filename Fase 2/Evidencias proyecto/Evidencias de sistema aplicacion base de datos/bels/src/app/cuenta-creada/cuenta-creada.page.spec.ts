import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CuentaCreadaPage } from './cuenta-creada.page';

describe('CuentaCreadaPage', () => {
  let component: CuentaCreadaPage;
  let fixture: ComponentFixture<CuentaCreadaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CuentaCreadaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
