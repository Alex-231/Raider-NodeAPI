/* eslint-disable no-underscore-dangle */
import { Schema, model as Model } from 'mongoose';

// eslint-disable-next-line import/no-cycle
import User from './User';

export const ClanSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  creator_id: {
    type: Schema.ObjectId,
    required: true,
    unique: true,
  },
  open: {
    type: Boolean,
    required: true,
    default: false,
  },
  requestedUser_ids: {
    type: [Schema.ObjectId],
    required: false,
  },
  invitedUser_ids: {
    type: [Schema.ObjectId],
    required: false,
  },
});

ClanSchema.pre('validate', (next) => {
  // Check that no unlinked clan requests are present.
  if (this.requestedUser_ids.length > 1) {
    this.requestedUser_ids.forEach((requestedUserId) => {
      User.findById(requestedUserId, (err, foundUser) => {
        if (foundUser && !(foundUser.clanRequest_ids.indexOf(this._id) > -1)) {
          // If there's a clan, store it.
          this.requestedUser_ids.splice(this.requestedUser_ids.indexOf(requestedUserId, 1));
        }
      });
    }, this);
  }
  if (this.invitedUser_ids.length > 1) {
    this.invitedUser_ids.forEach((invitedUserId) => {
      User.findById(invitedUserId, (err, foundUser) => {
        if (foundUser && !(foundUser.clanInvite_ids.indexOf(this._id) > -1)) {
          // If there's a clan, store it.
          this.requestedUser_ids.splice(this.requestedUser_ids.indexOf(invitedUserId, 1));
        }
      });
    }, this);
  }

  return next();
});

const Clan = Model('Clan', ClanSchema);
export default Clan;
