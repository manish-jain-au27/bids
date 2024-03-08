const User = require('../models/User');

// Send a notification to a user
const sendNotification = async (userId, type, message, offerId) => {
  try {
    // Assume you have a User model with a notifications field
    const user = await User.findById(userId);

    if (!user) {
      console.error('User not found for sending notification.');
      return;
    }

    // Add the notification to the user's notifications array
    user.notifications.push({
      type: type,  // Update to a valid enum value
      message,
      offer: offerId,  // Provide the offer ID
      timestamp: new Date(),
    });

    // Save the updated user document
    await user.save();

    console.log(`Notification sent to user ${userId}: ${message}`);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

module.exports = sendNotification;