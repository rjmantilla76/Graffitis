import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx"
import { Graffitis } from "../api/graffitis.js";
import  Graffiti  from "./Graffiti.jsx";
import  Mapa  from "./Mapa.jsx";

class App extends Component {
  constructor(props) {
    super(props);
    this.changeLatLng = this.changeLatLng.bind(this);
    this.state = {
      lat: 4.603755,
      lng: -74.062529,
      fileName: "Por favor agrega una imagen",
      fileURL: "",
    };
  }

   handleSubmit(event) {
     event.preventDefault();
     const name = ReactDOM.findDOMNode(this.refs.textName).value.trim();
     Meteor.call('graffitis.insert', name, this.state.lat, this.state.lng, this.state.fileURL);
     ReactDOM.findDOMNode(this.refs.textName).value = "";
     ReactDOM.findDOMNode(this.refs.imgFileName).value = "";
   }

   handleCloudinary(event){
     event.preventDefault();
     cloudinary.openUploadWidget(
       {
         cloud_name: 'diqqlncv0',
         upload_preset: 'xo0iva0a',
         sources: ['local', 'url', 'camera'],
         max_file_size: '500000',
        //  max_image_width: '500',
        //  max_image_height: '500',
        //  min_image_width: '300',
        //  min_image_height: '300',
       },
       (error, result) => {
         if (error) {
           console.log('Error al subir la imagen: ', error);
           return;
         }

         const fileName = result[0].original_filename;
         const url = result[0].url;
         console.log(fileName,url);
         this.changeFileURL(fileName,url);
      });
   }

   renderGraffitis() {
     let filteredGraffitis = this.props.graffitis;


     if (this.props.currentUser)
     {
       return filteredGraffitis.filter(graffiti => Meteor.user()._id === graffiti.owner).map((graffiti) => (
         <Graffiti key={graffiti._id} graffiti={graffiti} currentUser={Meteor.user()} />
       ));
      }

   }

   changeLatLng(latitude,longitude) {
     this.setState(
       {lat: latitude,
        lng: longitude,
     });
   }

   changeFileURL(fileN,fileU) {
     this.setState(
       {fileName: fileN,
        fileURL: fileU,
     });
   }

  render() {
    return (
    <div className="App">
      <AccountsUIWrapper />
      <br/>
        <div className="container">
          { this.props.currentUser ?
          <header>
            <h2>Agrega un nuevo graffiti</h2>
              <form className="new-graffiti" id= "formGraffiti" onSubmit={this.handleSubmit.bind(this)} >
                <input type="text" ref="textName" placeholder="Nombre"/>
                <div>
                  <input type="text" ref="imgFileName" name="cloudinaryFileName" placeholder={this.state.fileName} readOnly/>
                  <input type="hidden" ref ="imgURL" name="cloudinaryUrl" disabled="true"/>
                  <button id="cloudinary-upload-widget" onClick={this.handleCloudinary.bind(this)}>Subir Imagen </button>
                  <button id="submit" >Agregar Graffiti </button>
                </div>
              </form>
          </header> : ''}
        </div>
      {this.props.currentUser && <h3>Tus Graffitis</h3> }
      {!this.props.currentUser && <h3>Ingresa para empezar a agregar graffitis!</h3> }
      <ul>
        {this.renderGraffitis()}
      </ul>
      <br/>
      <br/>
      <Mapa onMarker={ (latitude,longitude) => this.changeLatLng(latitude,longitude) } ></Mapa>
    </div>
    );
  }
}

App.propTypes = {
  graffitis: PropTypes.array.isRequired,
  currentUser: PropTypes.object,
};


export default createContainer(() => {
  Meteor.subscribe('graffitis');
  return {
    graffitis: Graffitis.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user()
  };
}, App);
