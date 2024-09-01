import mongoose from "mongoose";

const propertySchema = new mongoose.Schema({
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Host',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  // country:{
  //   type: String,
  //   required: true,
  // },
  sub_title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  pricePerNight: {
    type: Number,
    required: true,
  },
  totalprice:{
    type:Number,
    // required:true,
  },
  amenities: [{
    type: String,
  }],
  images: [{
    type: String, // URL to image
  }],
  category:{
    type:String,
    default:'uncategorized'
},
  availability: [{
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  }],
  bookings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
  }],
}, {
  timestamps: true,
});

// const Property = mongoose.model('Property', propertySchema);
// export default Property;
const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

export default Property;

