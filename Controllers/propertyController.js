import Property from "../models/propertyModele.js";



// Create a new property


export const createProperty = async (req,res)=>{
    try {
        const { hostId, title, description, location, pricePerNight, amenities, images, availability,category,sub_title } = req.body;

        const newProperty = new Property({
            hostId,
            title,
            sub_title,
            description,
            location,
            pricePerNight,
            amenities,
            images,
            category,
            availability,
            
          });
      
          await newProperty.save();
          res.status(201).json({ message: 'Property created successfully', property: newProperty });


    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });

    }
}




// get all

export const getProperty = async(req,res,next)=>{

    try {

        const getpropertdetailes = await Property.find()
        res.status(200).json({message:"Property Details Get All",result:getpropertdetailes})

    } catch (error) {
        next(error)
    }
}