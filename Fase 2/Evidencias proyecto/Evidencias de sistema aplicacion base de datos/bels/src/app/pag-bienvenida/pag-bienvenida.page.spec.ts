import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagBienvenidaPage } from './pag-bienvenida.page';

describe('PagBienvenidaPage', () => {
  let component: PagBienvenidaPage;
  let fixture: ComponentFixture<PagBienvenidaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagBienvenidaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
