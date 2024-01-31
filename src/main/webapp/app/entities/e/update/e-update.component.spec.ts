import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EService } from '../service/e.service';
import { IE } from '../e.model';
import { EFormService } from './e-form.service';

import { EUpdateComponent } from './e-update.component';

describe('E Management Update Component', () => {
  let comp: EUpdateComponent;
  let fixture: ComponentFixture<EUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let eFormService: EFormService;
  let eService: EService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), EUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    eFormService = TestBed.inject(EFormService);
    eService = TestBed.inject(EService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const e: IE = { id: 'CBA' };

      activatedRoute.data = of({ e });
      comp.ngOnInit();

      expect(comp.e).toEqual(e);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IE>>();
      const e = { id: 'ABC' };
      jest.spyOn(eFormService, 'getE').mockReturnValue(e);
      jest.spyOn(eService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ e });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: e }));
      saveSubject.complete();

      // THEN
      expect(eFormService.getE).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(eService.update).toHaveBeenCalledWith(expect.objectContaining(e));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IE>>();
      const e = { id: 'ABC' };
      jest.spyOn(eFormService, 'getE').mockReturnValue({ id: null });
      jest.spyOn(eService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ e: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: e }));
      saveSubject.complete();

      // THEN
      expect(eFormService.getE).toHaveBeenCalled();
      expect(eService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IE>>();
      const e = { id: 'ABC' };
      jest.spyOn(eService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ e });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(eService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
