import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrediccionTiempoComponent } from './prediccion-tiempo.component';

describe('PrediccionTiempoComponent', () => {
  let component: PrediccionTiempoComponent;
  let fixture: ComponentFixture<PrediccionTiempoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrediccionTiempoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrediccionTiempoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
