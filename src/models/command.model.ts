import mongoose, { Schema, Document } from 'mongoose';

export interface ICommand extends Document {
	username: string;
	command_used: string;
}

export const CommandSchema: Schema = new Schema(
	{
		username: { type: String, required: true },
		command_used: { type: String, required: true },
	},
	{ versionKey: false }
);

export const CommandModel = mongoose.model<ICommand>('command', CommandSchema);
