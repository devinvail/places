import {Component, OnInit, OnDestroy} from '@angular/core';
import {Place} from '../places.model';
import {PlacesPage} from '../places.page';
import {PlacesService} from '../places.service';
import {Router} from '@angular/router';
import {IonItemSliding} from '@ionic/angular';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit, OnDestroy {
  offers: Place[];
  private placesSub: Subscription;
  isLoading = false;

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.placesSub = this.placesService.places.subscribe(places => {
      console.log('offer: ', places);

      this.offers = places;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }

  onEdit(offerId: string, slidingItem: IonItemSliding) {
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
