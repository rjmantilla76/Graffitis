import { Meteor } from 'meteor/meteor';
import { Mongo } from "meteor/mongo";
import { check } from 'meteor/check';

export const Graffitis = new Mongo.Collection("graffitis");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('graffitis', function graffitisPublication() {
    return Graffitis.find();
  });
}

Meteor.methods({
  'graffitis.insert'(name,latitude,longitude,fileURL,tags) {
    check(name, String);

    // Revisar que el usuario esté logeado
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    // var today  = new Date();

    Graffitis.insert({
      name,
      createdAt: new Date().toLocaleString(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
      latitude,
      longitude,
      fileURL,tags
    });
  },
  'graffitis.remove'(graffitiId) {
    check(graffitiId, String);

    const graffiti = Graffitis.findOne(graffitiId);

    if (graffiti.owner !== Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Graffitis.remove(graffitiId);
  },

'graffitis.update'(graffitiId,lat,long)
{
  check(graffitiId, String);

  const graffiti = Graffitis.findOne(graffitiId);

  if (graffiti.owner !== Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }

   Graffitis.update(graffitiId, {
     $set: {latitude:lat, longitude:long}
   });
  },

});
