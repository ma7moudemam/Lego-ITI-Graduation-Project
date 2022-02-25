const mongoose = require('mongoose');
const { Schema } = mongoose;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const shippersSchema = new Schema({
    _id:Number,
    name: String,
    date: String,
  
  contact: [{ email: String,
     phone_number: Number }]
  
   

  },{ _id : false});
  
  shippersSchema.plugin(AutoIncrement, {id : 'shipper_id_counter' , inc_field: '_id'});
  
  
  const shipper = mongoose.model('shippers', shippersSchema);
  
  
  module.exports = shipper;