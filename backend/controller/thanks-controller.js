import Thanks from "../models/thanks-model.js";
import { sendServerError } from "../utils/error-response-util.js";

export const sendThanks = async (req, res) => {
  try {
    const message = req.body.message?.trim() || "Thanks for helping me prepare better.";

    const thanks = await Thanks.create({
      user: req.user._id,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Thank you for your feedback. It means a lot.",
      thanks,
    });
  } catch (error) {
    return sendServerError(res, error, "Unable to save thanks message");
  }
};
