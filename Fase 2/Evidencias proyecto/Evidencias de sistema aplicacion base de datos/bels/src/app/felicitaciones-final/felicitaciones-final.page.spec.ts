import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FelicitacionesFinalPage } from './felicitaciones-final.page';

describe('FelicitacionesFinalPage', () => {
  let component: FelicitacionesFinalPage;
  let fixture: ComponentFixture<FelicitacionesFinalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FelicitacionesFinalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
