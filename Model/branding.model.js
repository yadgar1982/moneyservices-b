import { Schema, model } from "mongoose";

const brandingSchema = new Schema(
  {

    // Company information
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    mobile: {
      type: String,
      trim: true,
    },

    website: {
      type: String,
      trim: true,
    },

    logo: {
      type: String,
    },


    // Branding customization
    primaryColor: {
      type: String,
      default: "#059669",
    },

    secondaryColor: {
      type: String,
      default: "#0f172a",
    },

      footerText: {
      type: String,
      default: "Thank you for your business",
    },



  },
  {
    timestamps: true,
  }
);


export default model("Branding", brandingSchema);