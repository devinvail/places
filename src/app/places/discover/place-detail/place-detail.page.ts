import {CreateBookingComponent} from './../../../bookings/create-booking/create-booking.component';
import {Place} from './../../places.model';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
  NavController,
  ModalController,
  ActionSheetController,
  LoadingController,
} from '@ionic/angular';
import {PlacesService} from '../../places.service';
import {Subscription} from 'rxjs';
import {BookingService} from 'src/app/bookings/booking.service';
import {AuthService} from 'src/app/auth/auth.service';

@Component({
  selector: 'app-place-detail',
  templateUrl: './place-detail.page.html',
  styleUrls: ['./place-detail.page.scss'],
})
export class PlaceDetailPage implements OnInit, OnDestroy {
  place: Place;
  isBookable = false;
  private placeSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(place => {
          this.place = place;
          this.isBookable = place.userId !== this.authService.userId;
          console.log('this.place: ', this.place);
        });
    });
  }

  onBookPlace() {
    this.actionSheetCtrl
      .create({
        header: 'Choose an Action',
        buttons: [
          {
            text: 'Select a date',
            handler: () => {
              this.openBookingModal('select');
            },
          },
          {
            text: 'Random date',
            handler: () => {
              this.openBookingModal('random');
            },
          },
          {
            text: 'Cancel',
            role: 'cancel',
          },
        ],
      })
      .then(actionSheetEl => {
        actionSheetEl.present();
      });
  }

  openBookingModal(mode: 'select' | 'random') {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: {selectedPlace: this.place, selectedMode: mode},
      })
      .then(elModal => {
        elModal.present();
        return elModal.onDidDismiss();
      })
      .then(resultData => {
        console.log('resultData: ', resultData);

        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({message: 'booking place ... '})
            .then(loadingEl => {
              loadingEl.present();
              this.bookingService
                .addBooking(
                  this.place.id,
                  this.place.title,
                  this.place.imageUrl,
                  resultData.data.bookingData.firstName,
                  resultData.data.bookingData.lastName,
                  resultData.data.bookingData.guestNumber,
                  resultData.data.bookingData.from,
                  resultData.data.bookingData.to
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
