import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlanDeTrabajoPage } from './plan-de-trabajo.page';

describe('PlanDeTrabajoPage', () => {
  let component: PlanDeTrabajoPage;
  let fixture: ComponentFixture<PlanDeTrabajoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDeTrabajoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
