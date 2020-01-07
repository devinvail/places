import { Component, OnInit } from '@angular/core';
import { Place } from '../places.model';
import { PlacesPage } from '../places.page';
import { PlacesService } from '../places.service';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss']
})
export class OffersPage implements OnInit {
  loadedOffers: Place[];

  constructor(private placesService: PlacesService, private router: Router) {}

  ngOnInit() {
    this.loadedOffers = this.placesService.places;
  }

  onEdit(offerId: string, slidingItem: IonItemSliding){
    console.log('editing offer: ', offerId);
    slidingItem.close();
    this.router.navigate(['/', 'places', 'tabs', 'offers', 'edit', offerId]);
  }

}
