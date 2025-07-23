import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Server } from './server';

describe('Server', () => {
  let component: Server;
  let fixture: ComponentFixture<Server>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Server]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Server);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
