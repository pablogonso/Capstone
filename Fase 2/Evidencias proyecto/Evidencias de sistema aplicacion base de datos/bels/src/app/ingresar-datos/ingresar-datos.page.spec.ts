import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IngresarDatosPage } from './ingresar-datos.page';

describe('IngresarDatosPage', () => {
  let component: IngresarDatosPage;
  let fixture: ComponentFixture<IngresarDatosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(IngresarDatosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
