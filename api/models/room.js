const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const RoomSchema = new Schema({
  name: { type:String, unique: true },
  private: Boolean,
  between: Array,
  message: [{
    type: ObjectId,
    ref: 'Message',
  }],
  delUser: [],
  lastTime: Date
});

RoomSchema.statics.addMessage = async function(id, args) {
  const Message = mongoose.model('Message');
  const message = await new Message({ ...args, roomID: id });
  console.log(id, args)
  // await this.findByIdAndUpdate(id, { $push: { message: message.id } });
  await this.findByIdAndUpdate(id, { $set: {lastTime: new Date().getTime() }});

  return {
    message: await message.save(),
  };
};

module.exports = mongoose.model('Room', RoomSchema);