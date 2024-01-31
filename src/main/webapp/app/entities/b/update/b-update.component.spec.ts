import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IA } from 'app/entities/a/a.model';
import { AService } from 'app/entities/a/service/a.service';
import { BService } from '../service/b.service';
import { IB } from '../b.model';
import { BFormService } from './b-form.service';

import { BUpdateComponent } from './b-update.component';

describe('B Management Update Component', () => {
  let comp: BUpdateComponent;
  let fixture: ComponentFixture<BUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let bFormService: BFormService;
  let bService: BService;
  let aService: AService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), BUpdateComponent],
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
      .overrideTemplate(BUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(BUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    bFormService = TestBed.inject(BFormService);
    bService = TestBed.inject(BService);
    aService = TestBed.inject(AService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call A query and add missing value', () => {
      const b: IB = { id: 'CBA' };
      const a: IA = { id: 'd7c1a561-ee80-4f11-ab3f-9572e9d330e5' };
      b.a = a;

      const aCollection: IA[] = [{ id: 'ec879680-bf90-4363-8f37-e136a7798da0' }];
      jest.spyOn(aService, 'query').mockReturnValue(of(new HttpResponse({ body: aCollection })));
      const additionalAS = [a];
      const expectedCollection: IA[] = [...additionalAS, ...aCollection];
      jest.spyOn(aService, 'addAToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ b });
      comp.ngOnInit();

      expect(aService.query).toHaveBeenCalled();
      expect(aService.addAToCollectionIfMissing).toHaveBeenCalledWith(aCollection, ...additionalAS.map(expect.objectContaining));
      expect(comp.aSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const b: IB = { id: 'CBA' };
      const a: IA = { id: '3c993acc-fb4c-445a-a058-ac01ebfe3d1f' };
      b.a = a;

      activatedRoute.data = of({ b });
      comp.ngOnInit();

      expect(comp.aSSharedCollection).toContain(a);
      expect(comp.b).toEqual(b);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IB>>();
      const b = { id: 'ABC' };
      jest.spyOn(bFormService, 'getB').mockReturnValue(b);
      jest.spyOn(bService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ b });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: b }));
      saveSubject.complete();

      // THEN
      expect(bFormService.getB).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(bService.update).toHaveBeenCalledWith(expect.objectContaining(b));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IB>>();
      const b = { id: 'ABC' };
      jest.spyOn(bFormService, 'getB').mockReturnValue({ id: null });
      jest.spyOn(bService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ b: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: b }));
      saveSubject.complete();

      // THEN
      expect(bFormService.getB).toHaveBeenCalled();
      expect(bService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IB>>();
      const b = { id: 'ABC' };
      jest.spyOn(bService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ b });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(bService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareA', () => {
      it('Should forward to aService', () => {
        const entity = { id: 'ABC' };
        const entity2 = { id: 'CBA' };
        jest.spyOn(aService, 'compareA');
        comp.compareA(entity, entity2);
        expect(aService.compareA).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
