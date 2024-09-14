import mongoose, { Schema } from "mongoose";

const subSectionSchema = new Schema({
    title:{
        type:String,
    },
    desciption:{
        type:String
    },
    timeDuration:{
        type:String,
    },
    videoUrl:{
        type:String,
    }
     
});

export const SubSection = mongoose.model("SubSection", subSectionSchema);
