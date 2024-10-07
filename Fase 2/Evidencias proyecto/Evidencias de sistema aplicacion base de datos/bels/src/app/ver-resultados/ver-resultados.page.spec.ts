import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VerResultadosPage } from './ver-resultados.page';

describe('VerResultadosPage', () => {
  let component: VerResultadosPage;
  let fixture: ComponentFixture<VerResultadosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VerResultadosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
