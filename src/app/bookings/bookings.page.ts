import {Component, OnInit, ɵConsole} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding} from '@ionic/angular';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];
  private bookingsSub = Subscription;

  constructor(
    private bookingsService: BookingService,
    private router: Router
  ) {}

  ngOnInit() {
    //this.loadedBookings = this.bookingsService.bookings;

    this.bookingsSub = this.bookingsService.bookings.subscribe(bookings => {
      this.loadedBookings = bookings;
    });

    console.log('bookings: ', this.loadedBookings);
  }

  onDelete(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    //this.router.navigate(['/', 'tabs']);
  }
}
