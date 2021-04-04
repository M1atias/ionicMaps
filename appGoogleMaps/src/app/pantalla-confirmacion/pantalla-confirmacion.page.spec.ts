import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PantallaConfirmacionPage } from './pantalla-confirmacion.page';

describe('PantallaConfirmacionPage', () => {
  let component: PantallaConfirmacionPage;
  let fixture: ComponentFixture<PantallaConfirmacionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PantallaConfirmacionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PantallaConfirmacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
