import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardCreator } from './card-creator';

describe('CardCreator', () => {
  let component: CardCreator;
  let fixture: ComponentFixture<CardCreator>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardCreator]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardCreator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
