/* eslint-disable import/prefer-default-export */
import { Schema } from 'mongoose';
import { EmblemSchema } from './Emblem';
import { ColorSchema } from './Color';

export const CharacterSchema = new Schema({
  emblem: {
    type: EmblemSchema,
    required: true,
  },
  raceString: {
    type: String,
    enum: ['X', 'Y'],
    default: 'X',
    required: true,
  },
  guild: {
    type: String,
    required: false,
  },
  armourPrimaryColor: {
    type: ColorSchema,
    required: true,
  },
  armourSecondaryColor: {
    type: ColorSchema,
    required: true,
  },
  armourTertiaryColor: {
    type: ColorSchema,
    required: true,
  },
  shoulderArmourString: {
    type: String,
    enum: ['X', 'Y'],
    default: 'X',
    required: true,
  },
  helmetArmourString: {
    type: String,
    enum: ['X', 'Y'],
    default: 'X',
    required: true,
  },
  chestArmourString: {
    type: String,
    enum: ['X', 'Y'],
    default: 'X',
    required: true,
  },
  level: {
    type: Number,
    default: 0,
    required: true,
  },
  exp: {
    type: Number,
    default: 0,
    required: true,
  },
});
