import {Component, OnInit, ɵConsole} from '@angular/core';
import {BookingService} from './booking.service';
import {Booking} from './booking.model';
import {IonItemSliding} from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {
  loadedBookings: Booking[];

  constructor(private bookingsService: BookingService, private router: Router) {}

  ngOnInit() {
    this.loadedBookings = this.bookingsService.bookings;
    console.log('bookings: ', this.loadedBookings);
  }

  onDelete(bookingId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    //this.router.navigate(['/', 'tabs']);

  }
}
