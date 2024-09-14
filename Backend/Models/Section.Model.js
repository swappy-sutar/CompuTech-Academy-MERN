import mongoose, { Schema } from "mongoose";

const sectionSchema = new Schema({
    sectionName:{
        type:String,
    },
    subSection:{
        type: Schema.Types.ObjectId,
        ref: 'SubSection',
        required:true
    }
});

export const Section = mongoose.model("Section", sectionSchema);
