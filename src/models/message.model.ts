import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
	username: string;
	firstname: string;
	message: string;
}

export const MessageSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		firstname: { type: String, required: true },
		message: { type: String, required: true },
	},
	{ versionKey: false }
);

export const MessageModel = mongoose.model<IMessage>('message', MessageSchema);
