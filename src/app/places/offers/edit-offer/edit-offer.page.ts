import {FormGroup, FormControl, Validators} from '@angular/forms';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController, LoadingController} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import {PlacesService} from '../../places.service';
import {Place} from '../../places.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.page.html',
  styleUrls: ['./edit-offer.page.scss'],
})
export class EditOfferPage implements OnInit, OnDestroy {
  place: Place;
  form: FormGroup;
  private placeSub: Subscription;
  private placeId: string;

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private router: Router,
    private loadingCtr: LoadingController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      console.log('paramMap: ', paramMap);
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/offers');
        return;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
        });

      this.form = new FormGroup({
        title: new FormControl(this.place.title, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
        description: new FormControl(this.place.description, {
          updateOn: 'blur',
          validators: [Validators.required],
        }),
      });
    });
  }

  editPlace() {
    this.loadingCtr
      .create({
        message: '... updating offer',
      })
      .then(loadEl => {
        this.route.paramMap.subscribe(paramMap => {
          this.placeId = paramMap.get('placeId');
          this.placesService
            .editPlace(
              this.form.value.title,
              this.form.value.description,
              this.placeId
            )
            .subscribe(() => {
              console.log('DONE');
              this.loadingCtr.dismiss();
              this.form.reset();
              this.router.navigate(['/places/tabs/offers']);
            });
        });
      });
  }

  searchData(value) {
    console.log('input data: ', value);
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
