import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Place } from 'src/app/places/places.model';
import { ModalController } from '@ionic/angular';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-create-booking',
  templateUrl: './create-booking.component.html',
  styleUrls: ['./create-booking.component.scss']
})
export class CreateBookingComponent implements OnInit {
  @Input() selectedPlace: Place;
  @Input() selectedMode: 'select' | 'random';
  @ViewChild('f') form: NgForm;
  startDate: string;
  endDate: string;

  constructor(private modalCtrl: ModalController) {}

  onCancel() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  // onBook() {
  //   this.modalCtrl.dismiss(
  //     {
  //       bookingData: {
  //         firstName: this.form.value['first-name'],
  //         lastName: this.form.value['last-name'],
  //         guestNumber: this.form.value['guest-number'],
  //         from: this.form.value['date-from'],
  //         to: this.form.value['date-to']
  //       }
  //     },
  //     'confirm'
  //   );
  // }

  ngOnInit() {
    const availableFrom = new Date(this.selectedPlace.availableFrom);
    const availableTo = new Date(this.selectedPlace.availableTo);
    if (this.selectedMode === 'random') {
      this.startDate = new Date(
        availableFrom.getTime() +
          Math.random() *
            (availableTo.getTime() -
              7 * 24 * 60 * 60 * 1000 -
              availableFrom.getTime())
      ).toISOString();

      this.endDate = new Date(
        new Date(this.startDate).getTime() +
          Math.random() *
            (new Date(this.startDate).getTime() +
              6 * 24 * 60 * 60 * 1000 -
              new Date(this.startDate).getTime())
      ).toISOString();
    }
  }

  datesValid() {
    const validFrom = this.form.value['date-from'];
    const validTo = this.form.value['date-to'];
    if (validFrom > validTo) {
      return true;
    } else {
      return false;
    }
  }

  onSubmit(form: NgForm) {
    console.log(this.form.value['date-from']);
    this.modalCtrl.dismiss(
      {
        bookingData: {
          firstName: this.form.value['first-name'],
          lastName: this.form.value['last-name'],
          guestNumber: this.form.value['guest-number'],
          from: this.form.value['date-from'],
          to: this.form.value['date-to']
        }
      },
      'confirm'
    );
  }
}
