import React, { Component } from "react";
import PropTypes from 'prop-types';
import ReactDOM from "react-dom";
import { Meteor } from "meteor/meteor";
import { createContainer } from "meteor/react-meteor-data";

import AccountsUIWrapper from "./AccountsUIWrapper.jsx"
import { Graffitis } from "../api/graffitis.js";
import  Graffiti  from "./Graffiti.jsx";
import  Mapa  from "./Mapa.jsx";

const ReactTags = require('react-tag-autocomplete')

class App extends Component {
  constructor(props) {
    super(props);
    this.changeLatLng = this.changeLatLng.bind(this);
    this.state = {
      lat: 4.603755,
      lng: -74.062529,
      fileName: "Sube una imagen",
      fileURL: "",
      delimiters: [9,32,13],
      tags: [
        { id: 1, name: "Stencil" },
        { id: 2, name: "Street-Art" },
        { id: 3, name: "Política" }
      ],
      suggestions: [
        { id: 4, name: "Religion" },
        { id: 5, name: "Amor" },
        { id: 6, name: "Feminismo" },
        { id: 7, name: "Música" },
        { id: 8, name: "Humor" },
        { id: 9, name: "Drogas" },
        { id: 10, name: "Wildstyle" },
        { id: 11, name: "Stencil" },
        { id: 12, name: "Poster" },
        { id: 13, name: "Sticker" },
        { id: 14, name: "Política" },
        { id: 15, name: "Arte" }
      ]
    };
  }


// tags
  handleDelete (i) {
   const tags = this.state.tags.slice(0)
   tags.splice(i, 1)
   this.setState({ tags })
 }

 handleAddition (tag) {
   const tags = [].concat(this.state.tags, tag)
   this.setState({ tags })
 }


   handleSubmit(event) {
     event.preventDefault();
     const name = ReactDOM.findDOMNode(this.refs.textName).value.trim();
     Meteor.call('graffitis.insert', name, this.state.lat, this.state.lng, this.state.fileURL, this.state.tags);
     ReactDOM.findDOMNode(this.refs.textName).value = "";
     ReactDOM.findDOMNode(this.refs.txtFileName).value = "";
   }

   handleCloudinary(event){
     event.preventDefault();
     cloudinary.openUploadWidget(
       {
         cloud_name: 'diqqlncv0',
         upload_preset: 'xo0iva0a',
         sources: ['local', 'url', 'camera'],
         max_file_size: '5000000',
         cropping: 'server'
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
         //console.log(fileName,url);
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
            <a id="logoGC" className="navbar-brand" href="#miPagina">GraffitisCity</a>
          </div>
          <div className="collapse navbar-collapse" id="myNavbar">
            <ul className="nav navbar-nav navbar-right">
              <li><AccountsUIWrapper/></li>
              {this.props.currentUser && <li><a href="#misGraffitis">MIS GRAFFITIS</a></li>}
              {this.props.currentUser && <li><a href="#agregarGraffiti">AGREGAR GRAFFITI</a></li>}
              <li><a href="#buscarGraffitis">BUSCAR GRAFFITIS</a></li>
              {!this.props.currentUser && <li><a href="#sobreNosotros">SOBRE NOSOTROS</a></li> }
              {!this.props.currentUser && <li><a href="#contactenos">CONTACTENOS</a></li> }
            </ul>
          </div>
        </div>
      </nav>

      {!this.props.currentUser && <div className="jumbotron text-center">
        <h1 id="titulo">GraffitisCity</h1>
        <p id="textJumbotron">Búscalos por todo Bogotá</p>
      </div> }

      {this.props.currentUser && <div className="jumbotron text-center">
        <h1 id="titulo">GraffitisCity</h1>
        <p id="textJumbotronUsuario">Bienvenido {Meteor.user().username}</p>
      </div> }

      {!this.props.currentUser && <h3>Ingresa en <em>Sign in</em> para empezar a agregar graffitis!</h3> }

      {this.props.currentUser && <div id="misGraffitis" className="container-fluid"><h2>Mis Graffitis</h2><br></br><ul className="list-inline">{this.renderGraffitis()}</ul></div>}

      <div id="buscarGraffitis" className="container-fluid bg-grey">
        {this.props.currentUser && <h2>Agrega un graffiti</h2>}
        {this.props.currentUser && <br></br>}
        {this.props.currentUser && <p>Para agregar un graffiti:</p>}
        {this.props.currentUser && <br></br>}
        {this.props.currentUser && <ol><li>Dale click en el mapa donde quieres agregarlo</li>
          <li>Ingresa el nombre del graffiti en el formulario</li><li>Sube una foto del graffiti</li><li>Oprime Agregar Graffiti</li></ol>}
        {this.props.currentUser && <br></br>}

        {!this.props.currentUser && <h2>MAPA GRAFFITIS</h2>}
        <br></br>
        <Mapa onMarker={ (latitude,longitude) => this.changeLatLng(latitude,longitude) } ></Mapa>
      </div>

          { this.props.currentUser ?
          <header>
            <div id="agregarGraffiti" className="container-fluid bg-grey">
                  <form id= "formGraffiti" className="new-graffiti form-horizontal"  onSubmit={this.handleSubmit.bind(this)} >
                    <div className="form-group">
                      <label className="control-label col-sm-2">Nombre:</label>
                      <div className="col-sm-10">
                        <input type="text" className="form-control" ref="textName" placeholder="Nombre"/>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Imagen:</label>
                      <div className="col-sm-10">
                        <input type="text" ref="txtFileName" name="cloudinaryFileName" placeholder={this.state.fileName} readOnly/>
                        <input type="hidden" ref ="imgURL" name="cloudinaryUrl" disabled="true"/>
                        <button id="cloudinary-upload-widget" onClick={this.handleCloudinary.bind(this)}>Subir Imagen </button>
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="control-label col-sm-2">Tags:</label>
                      <div className="col-sm-10">
                        <ReactTags tags={this.state.tags} suggestions={this.state.suggestions} delimiters={this.state.delimiters} handleDelete={this.handleDelete.bind(this)}
                          handleAddition={this.handleAddition.bind(this)} placeholder ='Agrega un Tag' minQueryLength={1} allowNew = {true} />
                      </div>
                      <br/>
                      <br/>
                      <div className="col-sm-offset-2 col-sm-10">
                        <br/>
                        <button type="submit" id="submit" className="btn btn-default">Agregar Graffiti</button>
                      </div>
                    </div>
                  </form>
            </div>
          </header> : ''}

      {!this.props.currentUser && <div id="sobreNosotros" className="container-fluid"><h2>SOBRE NOSOTROS</h2><br></br>
      <p id="textoSobreNosotros">GraffitisCity es un proyecto que busca que las personas conozcan graffitis en todo Bogotá.</p></div>}
      {!this.props.currentUser && <div id="contactenos" className="container-fluid bg-grey"><h2>CONTACTENOS</h2><br></br>
      <p id="textoSobreNosotros">Somos 2 estudiantes de Ingeniería de Sistemas y Computación. Escríbenos a graffitisCity@gmail.com</p></div>}
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
