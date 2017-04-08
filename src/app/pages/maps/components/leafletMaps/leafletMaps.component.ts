import {Component, ElementRef} from '@angular/core';

import 'leaflet-map';
import 'style-loader!./leafletMaps.scss';

@Component({
  selector: 'leaflet-maps',
  templateUrl: './leafletMaps.html'
})
export class LeafletMaps {

  constructor(private _elementRef:ElementRef) {
  }

  ngAfterViewInit() {
    let el = this._elementRef.nativeElement.querySelector('.leaflet-maps');

    L.Icon.Default.imagePath = 'assets/img/theme/vendor/leaflet';
    // var map = L.map(el).setView([51.505, -0.09], 13);
    var map = L.map(el).setView([44.0489713,-123.0944854], 14);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // const url = 'http://catalog.civicdashboards.com/dataset/55f42995-22c7-4443-9b3d-c6b7c6455021/resource/90bb52c9-43b5-4512-a669-77de23f6705a/download/56a4b377822a4b06813e4da751825d91temp.geojson';
    const citiesURL = 'assets/geo/orcities.geojson';
    var citiesSearch = [];
    var cities = L.geoJson(null, {
      style: function (feature) {
        return {
          color: "blue",
          fill: false,
          opacity: 1,
          clickable: false
        };
      },
      onEachFeature: function (feature, layer) {
        citiesSearch.push({
          name: layer.feature.properties.name,
          source: "Cities",
          id: L.stamp(layer),
          bounds: layer.getBounds()
        });
      }
    });
    $.getJSON(citiesURL, function (data) {
      cities.addData(data);
    });
    cities.addTo(map);


    const neighborhoodsURL = 'assets/geo/COE_Neighborhoods_7April2017.geojson';
    var neighborhoodsSearch = [];
    var neighborhoods = L.geoJson(null, {
      style: function (feature) {
        return {
          color: "green",
          fill: false,
          opacity: 1,
          clickable: false
        };
      },
      onEachFeature: function (feature, layer) {
        // console.log('start', feature, layer, layer.feature.properties.NAME);
        var label = L.marker(layer.getBounds().getCenter(), {
          icon: L.divIcon({
            className: 'label',
            html: feature.properties.NAME,
            iconSize: [100, 40]
          })
        }).addTo(map);
        label.valueOf()._icon.style.color = 'red';
        neighborhoodsSearch.push({
          name: layer.feature.properties.NAME,
          source: "neighborhoods",
          id: L.stamp(layer),
          bounds: layer.getBounds()
        });
      }
    });
    $.getJSON(neighborhoodsURL, function (data) {
      neighborhoods.addData(data);
    });
    neighborhoods.addTo(map);

    L.marker([44.0489713,-123.0944854]).addTo(map)
      .bindPopup('Downtown Athletic Club.<br> Hack for a Cause.')
      .openPopup();
  }
}
