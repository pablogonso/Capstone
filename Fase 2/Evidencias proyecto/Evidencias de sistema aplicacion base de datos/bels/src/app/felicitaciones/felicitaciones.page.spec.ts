import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FelicitacionesPage } from './felicitaciones.page';

describe('FelicitacionesPage', () => {
  let component: FelicitacionesPage;
  let fixture: ComponentFixture<FelicitacionesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FelicitacionesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
