// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';
import 'firebase/storage';
import { domainName } from "../../constants/domainName";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBX0xA53I5ImapDNmlHZjBvUJjdUQCNL0",
  authDomain: "meetsy-f287c.firebaseapp.com",
  projectId: "meetsy-f287c",
  storageBucket: "meetsy-f287c.appspot.com",
  messagingSenderId: "1062287763930",
  appId: "1:1062287763930:web:030fadcbd80694393938e3",
  measurementId: "G-NQJFWHR5GY"
};


var SingletonFactory = (function () {

  class Firebase {
    constructor() {
      firebase.initializeApp(firebaseConfig);

    this.auth = firebase.auth();
    this.db = firebase.firestore();
    this.storage = firebase.storage();

    }
    // *** Auth API ***
    doCreateUserWithEmailAndPassword = (email, password) =>
      this.auth.createUserWithEmailAndPassword(email, password);

    doSignInWithEmailAndPassword = (email, password) =>
      this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => {
    this.auth.signOut();
    window.location.href = domainName;
  }

    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

    doPasswordUpdate = password =>
      this.auth.currentUser.updatePassword(password);
    // ** Merge Auth and DB User API

    // *** User API ***
    get dbUser() {
      this.user(this.auth.currentUser.uid).get().then(query => {
        return query.data();
      }).catch((error) => {
        console.log("No such user!");
      });
      return null;
    }
    user = uid => this.db.doc(`users/${uid}`);

    users = () => this.db.collection('users');

    userByEmail = email => this.db.collection('users').where('email', "==", email.trim());

    // not working - not updating onSnapshot
    usersByTeam = (tid) => this.db.collection('users').where('teams', 'array-contains-any', [tid]);
    usersByIds = ids => this.db.collection('users').where('userId', 'in', ids);

    // getting a list of the teams of the specified user
    userTeams = uid => this.db.collection('teams').where('userId', 'like', uid)

    // ** Team API ***

  team = uid => this.db.doc(`teams/${uid}`);
  teams = () => this.db.collection('teams');


    // *** Calendar API ***

    event = uid => this.db.doc(`events/${uid}`);
    events = () => this.db.collection('events');

    // *** Meeting API ***
    meeting = uid => this.db.doc(`meetings/${uid}`);
    meetings = () => this.db.collection('meetings');

  }
  var instance;
  return {
    getInstance: function () {
      if (!instance) {
        instance = new Firebase();
        delete instance.constructor;
      }
      return instance;
    }
  }
})();


export {SingletonFactory as default};