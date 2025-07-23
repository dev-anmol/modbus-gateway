import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mserver } from './mserver';

describe('Mserver', () => {
  let component: Mserver;
  let fixture: ComponentFixture<Mserver>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mserver]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mserver);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
