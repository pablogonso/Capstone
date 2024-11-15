import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SeguimientoMensualPage } from './seguimiento-mensual.page';

describe('SeguimientoMensualPage', () => {
  let component: SeguimientoMensualPage;
  let fixture: ComponentFixture<SeguimientoMensualPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoMensualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
