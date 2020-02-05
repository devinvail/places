import {Component, OnInit, OnDestroy} from '@angular/core';
import {IonItemSliding, LoadingController} from '@ionic/angular';
import {Subscription} from 'rxjs';

import {BookingService} from './booking.service';
import {Booking} from './booking.model';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit, OnDestroy {
  loadedBookings: Booking[];
  private bookingSub: Subscription;

  constructor(
    private bookingService: BookingService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.bookingSub = this.bookingService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });
  }

  ngOnDestroy() {
    this.bookingSub.unsubscribe();
  }

  onDelete(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();

    this.loadingCtrl
      .create({message: 'cancelling booking...'})
      .then(loadingEl => {
        loadingEl.present();
        this.bookingService.cancelBooking(bookingId).subscribe(() => {
          loadingEl.dismiss();
        });
      });
  }
}
