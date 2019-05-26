/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose';

export const SettingsSchema = new Schema({
  perspectiveString: {
    type: String,
    enum: ['Scroll', 'Split'],
    default: 'Scroll',
  },
  lobbyDisplayString: {
    type: String,
    enum: ['Unknown', 'None', 'FirstPerson', 'ThirdPerson', 'Shoulder', 'FlyCam', 'Static', 'Follow', 'SceneOverview', 'FreeCam', 'FollowPath'],
    default: 'FirstPerson',
  },
});
