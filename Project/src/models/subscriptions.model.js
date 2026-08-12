import mongoose from "mongoose";
 

const subscriptionSchema = new mongoose.Schema({
    subscriber: {
        //the one who is subscribing
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    channel: { //one who is being subscribed
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {timestamps: true})

export default mongoose.model("Subscription", subscriptionSchema); 