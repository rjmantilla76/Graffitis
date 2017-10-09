import React, { Component } from "react";
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Graffitis } from "../api/graffitis.js";


export default class Graffiti extends Component {

  deleteThisGraffiti() {
     Meteor.call('graffitis.remove', this.props.graffiti._id);
  }

  render() {
    // console.log("owner: "+this.props.graffiti.owner)
    // console.log("current user: "+this.props.currentUser._id)
    return (

      <div className="panel panel-primary">
        <div className="panel-heading">
          <h3 className="panel-title"><strong>Nombre: {this.props.graffiti.name}</strong> </h3>
        </div>
        <div className="panel-body">
          <img src= {this.props.graffiti.fileURL} width="200" height="200"/><br/><br/>
          <strong>Tags:</strong> {this.props.graffiti.tags.map(tag => tag.name+"  ")}<br/>
          <strong>Fecha:</strong> {this.props.graffiti.createdAt}<br/>
          <p><br/><button className="btn btn-primary btn-sm" onClick={this.deleteThisGraffiti.bind(this)}>
          Borrar
        </button></p>
        </div>
      </div>

    );
  }
}

Graffiti.propTypes = {
  graffiti:  PropTypes.object.isRequired,
};
