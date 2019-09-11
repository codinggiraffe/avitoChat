const { Router } = require('express');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const ObjectId = require('mongoose').Types.ObjectId;
const router = Router();

router.get('/', async (req, res) => {
    const users = await User.find({});
    const chats = await Chat.find({});
    const messages = await Message.find({});

    res.end(`<h1>
                UsersList: 
            </h1>
            ${users}
            <br/>
            <h1>
                ChatsList: 
            </h1>
            ${chats}
            <br/>
            <h1>
                MessagesList: 
            </h1>
            ${messages}
            
`);
});

router.post('/users/add', async (req, res) => {

    const user = new User({
        username: req.body.username,
        created_at: new Date()
    });

    try{
        await user.save();
    }catch (e) {
        return res.status(400).send({
            statusCode: 400,
            message: 'User adding failed. Error: ' + e.errmsg
        })
    }
    return res.status(200).send({
        id: user._id,
    });

});

router.post('/chats/add', async (req, res) => {

    const realUsers = await req.body.users.filter(function(el){
                    if (ObjectId.isValid(el)){
                        return User.find({_id : el});
                    }
                    return false;
                });

    if (realUsers.length !== req.body.users.length){
        return res.status(400).send({
            statusCode: 400,
            message: 'Chat adding failed. Error: users array contains unreal Id`s'
        })
    }

    const chat = new Chat({
        name: req.body.name,
        users: req.body.users,
        created_at: new Date()
    });

    try{
        await chat.save();
    }catch (e) {
        return res.status(400).send({
            statusCode: 400,
            message: 'Chat adding failed. Error: ' + e.errmsg
        })
    }

    return res.status(200).send({
        id: chat._id,
    });
});

router.post('/messages/add', async (req, res) => {

    if (!ObjectId.isValid(req.body.chat)) return res.status(400).send({
        statusCode: 400,
        message: 'Message adding failed. Error: incorrect chat id'
    });

    const messageChat = await Chat.find({_id: req.body.chat});

    if(!messageChat.length) return res.status(400).send({
        statusCode: 400,
        message: 'Message adding failed. Error: such chat does not exist'
    });

    if(!messageChat[0].users.includes(req.body.author)) return res.status(400).send({
        statusCode: 400,
        message: 'Message adding failed. Error: this user does not in this chat'
    });

    const message = new Message({
        chat: req.body.chat,
        author: req.body.author,
        text: req.body.text,
        created_at: new Date()
    });

    try{
        await message.save();
    }catch (e) {
        return res.status(400).send({
            statusCode: 400,
            message: 'Message adding failed. Error: ' + e.errmsg
        })
    }

    return res.status(200).send({
        id: message._id,
    });

});

router.post('/chats/get', async (req, res) => {

    if (!ObjectId.isValid(req.body.user)) return res.status(400).send({
        statusCode: 400,
        message: 'Chats getting failed. Error: incorrect user id'
    });

    const userList = await User.find({_id: req.body.user});

    if(!userList.length) return res.status(400).send({
        statusCode: 400,
        message: 'Chats getting failed. Error: this user not in this chat'
    });


    const queryResultChats = await Chat.find({users: { $all : [req.body.user]}});

    const queryResultMessages = await Message.find({chat: {
            $in : queryResultChats.map(i => i._id)
        }})
        .sort({created_at: -1});

    const sortedChats = [];

    let i = 0;

    while (queryResultChats.length &&  i < queryResultMessages.length){
        let chatIndex = queryResultChats.findIndex(function(el){
            return el._id.toString() == queryResultMessages[i].chat;
        });
        if (chatIndex !== -1){
            console.log("chatIndex of "+queryResultMessages[i].chat+" : "+chatIndex);
            sortedChats.push(
                queryResultChats.splice(chatIndex,1)
            );
        }
        i++;
    }

    sortedChats.push(...queryResultChats); // chats without messages

    return res.status(200).send({
        len: sortedChats.length,
        chats: sortedChats,
    });
});

router.post('/messages/get', async (req, res) => {
    if (!ObjectId.isValid(req.body.chat)) return res.status(400).send({
        statusCode: 400,
        message: 'Messages getting failed. Error: incorrect chat id'
    });

    const chatList = await Chat.find({_id: req.body.chat});

    if(!chatList.length) return res.status(400).send({
        statusCode: 400,
        message: 'Messages getting failed. Error: this chat not exist'
    });

    const messagesByChat = await Message.find({chat: req.body.chat});

    return res.status(200).send({
        id: messagesByChat,
    });
});

module.exports = router;