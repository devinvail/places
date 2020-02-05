import {Component, OnInit, OnDestroy} from '@angular/core';
import {NavController} from '@ionic/angular';
import {Place} from '../../places.model';
import {ActivatedRoute} from '@angular/router';
import {PlacesService} from '../../places.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit, OnDestroy {
  place: Place;
  private placeSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService
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
    });
  }

  onOfferPlace() {
    this.navCtrl.navigateBack('/places/tabs/offers');
  }

  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }
}
