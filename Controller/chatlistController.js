const Message = require("../models/message");
const users = require("../models/user");

const getChatList = async (req, res) => {
  
    try{
    //const myUserId = req.user.id;
    const myEmail = req.user.email;



const personalRooms = await Message.distinct("roomName", {
  roomName: { $regex: myEmail, $options: "i" }
});

    const partnerEmails = new Set();

    personalRooms.forEach(room => {

      const [e1, e2] = room.split("-");
      if (e1 !== myEmail) partnerEmails.add(e1);
      if (e2 !== myEmail) partnerEmails.add(e2);
    });

    const usersData = await users.find(
        { email: { $in: [...partnerEmails] } },
        { _id: 1, name: 1, email: 1 }
      );

    const personalChats = usersData.map(u => ({
      id: u._id,
      name: u.name,
      email: u.email
    }));


    res.status(200).json({
      chatList: [...personalChats]
    });


  } catch (err) {
 
    console.error("Chat List Error:", err);
    res.status(500).json({ error: "Failed to fetch chat list" });
  }
};

module.exports = { getChatList };