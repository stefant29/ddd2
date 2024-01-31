import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ADetailComponent } from './a-detail.component';

describe('A Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ADetailComponent,
              resolve: { a: () => of({ id: 'ABC' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ADetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load a on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ADetailComponent);

      // THEN
      expect(instance.a).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
