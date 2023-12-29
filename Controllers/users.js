const User = require("../Database/Models/User");
 
//GET CURRENT USER
const getUser = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const {_id, firstName, lastName, email, picturePath, friends, viewedProfile, impressions, location, occupation} = await User.findById(id); 
    res.status(200).json({_id, firstName, lastName, email, picturePath, friends, viewedProfile, impressions, location, occupation});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//GET CURRENT USER'S FRIENDS
const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id); //get current user
    const userFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    console.log(userFriends);
    const formattedUserFriends = userFriends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          location,
          occupation,
          picturePath,
        };
      }
    );
    res.status(200).json(formattedUserFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//ADD OR REMOVE FRIENDS
const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id); //get current user
    const friend = await User.findById(friendId); //get current user's current friend
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();
    const userFriends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );
    const formattedUserFriends = userFriends.map(
      ({ _id, firstName, lastName, location, occupation, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          location,
          occupation,
          picturePath,
        };
      }
    );
    res.status(200).json(formattedUserFriends);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUser, getUserFriends, addRemoveFriend };
