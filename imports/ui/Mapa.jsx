import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import GoogleMap from './GoogleMap';
import { Graffitis } from "../api/graffitis.js";

export default class Mapa extends Component {
  constructor(props) {
    super(props);
    this.handleOnReady = this.handleOnReady.bind(this);
    _props = this.props;
  }

  handleMapOptions() {
    return {
      center: new google.maps.LatLng(4.603755, -74.062529),
      zoom: 16,
    };
  }


  handleOnReady(name) {
    GoogleMaps.ready(name, map => {
      Tracker.autorun(c => {
        google.maps.event.addListener(map.instance, 'click', function(event) {
          //console.log("props handle: "+_props);
         _props.onMarker(event.latLng.lat(),event.latLng.lng());

        });

        const markers = {};

        Graffitis.find().observe({
          added: function(document) {
            const marker = new google.maps.Marker({
              draggable: true,
              animation: google.maps.Animation.DROP,
              position: new google.maps.LatLng(document.latitude, document.longitude),
              map: map.instance,
              icon: 'https://raw.githubusercontent.com/vek/Graffitis/master/images/paint-spray.png',
              id: document._id,
            });

            var contentString =
            '<div id="content">'+
            '<img src='+ document.fileURL+' width=250 height=250> </img> <br/>'+
            '<br/><p><strong>Nombre Graffiti:</strong> '+ document.name + '</p>'+
            '<p><strong>Tags:</strong> '+ document.tags.map(tag => " "+tag.name) + '</p>'+
            '<p><strong>Creado por:</strong> '+ document.username + '</p>'+
            '<p><strong>Fecha:</strong> '+ document.createdAt + '</p>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', function() {
        infowindow.open(map, marker);
       });

      //  marker.addListener('mouseout', function() {
      //  infowindow.close();
      //  });

            google.maps.event.addListener(marker, 'dragend', function(event) {
              Meteor.call("graffitis.update",marker.id, event.latLng.lat(), event.latLng.lng() );
            });

            markers[document._id] = marker;
          },
           changed: function(newDocument, oldDocument) {
             markers[newDocument._id].setPosition({
               lat: newDocument.latitude,
               lng: newDocument.longitude,
             });
           },
          removed: function(oldDocument) {
            markers[oldDocument._id].setMap(null);
            google.maps.event.clearInstanceListeners(markers[oldDocument._id]);
            delete markers[oldDocument._id];
          },
        });
        this.computation = c;
      });
    });
  }

  componentWillUnmount() {
    this.computation.stop();
  }

  render() {

    return (
      <GoogleMap
        onReady={this.handleOnReady}
        mapOptions={this.handleMapOptions}
      >
        Cargando!
      </GoogleMap>
    );
  }
}
