const router = require("express").Router();
const Conversation = require("../models/Conversation");

//new conv

router.post("/add", async (req, res) => {
  const newConversation = new Conversation({
    members: ["635789330bf809c8b8d4aa8d", "63578ad7760db1f6b4763134"],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try {
    // const test = await Conversation.findOne();
    // console.log(test)

    // test.members.forEach(element => {
    //   console.log(element, req.params.userId)
    //   if (element === req.params.userId) {
    //     console.log('Yes')
    //   }
    // });
    // console.log(req.params.userId)
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    // return
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
