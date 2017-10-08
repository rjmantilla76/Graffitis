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
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a id="logoPS" className="navbar-brand" href="#miPagina">GraffitisCity</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">
              <li><AccountsUIWrapper/></li>
              <li><a href="#sobreNosotros">SOBRE NOSOTROS</a></li>
              <li><a href="#contactenos">CONTACTENOS</a></li>
            </ul>
          </div>
        </div>
      </nav>

      {!this.props.currentUser && <div className="jumbotron text-center">
        <h1 id="titulo">GraffitisCity</h1>
        <p>Búscalos por todo Bogotá</p>
      </div> }

      <br/>
        <div className="container">
          { this.props.currentUser ?
          <header>
            <h2>Agrega un nuevo graffiti</h2>
              <form className="new-graffiti pure-form" id= "formGraffiti" onSubmit={this.handleSubmit.bind(this)} >
                <fieldset>
                  <legend>Nuevo graffiti</legend>
                  <input type="text" ref="textName" placeholder="Nombre"/>
                  <input type="text" ref="imgFileName" name="cloudinaryFileName" placeholder={this.state.fileName} readOnly/>
                  <input type="hidden" ref ="imgURL" name="cloudinaryUrl" disabled="true"/>
                  <button id="cloudinary-upload-widget" onClick={this.handleCloudinary.bind(this)}>Subir Imagen </button>
                  <button id="submit" type="submit">Agregar Graffiti </button>
                </fieldset>
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
      <div className="container-fluid bg-grey">
        <Mapa onMarker={ (latitude,longitude) => this.changeLatLng(latitude,longitude) } ></Mapa>
      </div>
      <br></br>
      {!this.props.currentUser && <div id="sobreNosotros" className="container-fluid"><h2>SOBRE NOSOTROS</h2><br></br>
      <p id="textoSobreNosotros">GraffitisCity es un proyecto que busca que las personas conozcan graffitis artísticos en todo Bogotá.</p></div>}
      {!this.props.currentUser && <div id="contactenos" className="container-fluid bg-grey"><h2>CONTACTENOS</h2><br></br>
      <p id="textoSobreNosotros">Somos 2 estudiantes de Ingeniería de Sistemas y Computación. Escríbenos a email</p></div>}
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
