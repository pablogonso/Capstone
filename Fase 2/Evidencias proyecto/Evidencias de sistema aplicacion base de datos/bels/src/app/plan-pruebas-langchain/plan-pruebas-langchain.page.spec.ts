import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanPruebasLangchainPage } from './plan-pruebas-langchain.page';

describe('PlanPruebasLangchainPage', () => {
  let component: PlanPruebasLangchainPage;
  let fixture: ComponentFixture<PlanPruebasLangchainPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanPruebasLangchainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
