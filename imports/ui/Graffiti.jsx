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
      <li>
          <button className="delete" onClick={this.deleteThisGraffiti.bind(this)}>
            &times;
          </button>
      <span className="name">
        <strong>Usuario: {this.props.graffiti.username}</strong> -  Nombre: {this.props.graffiti.name}
      </span>
      </li>
    );
  }
}

Graffiti.propTypes = {
  graffiti:  PropTypes.object.isRequired,
};
