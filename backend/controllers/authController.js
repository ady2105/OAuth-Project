const jwt = require("jsonwebtoken");
const axios = require("axios");
const { oauth2Client } = require("../utils/googleConfig");
const UserModel = require("../models/userModel");

//GOOGLE LOGIN CONTROLLER
const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    const googleRes = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`,
    );

    const { name, email, picture } = userRes.data;

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name,
        email,
        image: picture,
      });
    }

    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Error during Google login:", err);
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

//GITHUB LOGIN CONTROLLER
const githubLogin = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res
        .status(400)
        .json({ message: "Authorization code is required" });
    }

    //exchanging the code for an access token
    const tokenRes = await axios.post(
      `https://github.com/login/oauth/access_token`,
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code,
      },
      {
        headers: { Accept: "application/json" }, //as github returns the response in url encoded format by default, we need to set the Accept header to applicataion/json to get the response in json format
      },
    );

    const accessToken = tokenRes.data.access_token;
    if (!accessToken) {
      return res
        .status(400)
        .json({ message: tokenRes.data.error_description || tokenRes.data.error || "Failed to obtain access token from GitHub" });
    }

    //fetching user data from github using the access toeken
    const userRes = await axios.get(`https://api.github.com/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let { name, email, avatar_url, login } = userRes.data;

    //Fallback: if email is not proided my the github as some user may change their email privacy in the settings, so to geet the email we need to make another request to the github api to get the email of the user

    if (!email) {
      const emailRes = await axios.get(`https://api.github.com/user/emails`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      //finding the primary email from the list od the emails returned by the github api
      const primaryEmailObj = emailRes.data.find(
        (item) => item.primary && item.verified,
      );
      email = primaryEmailObj ? primaryEmailObj.email : emailRes.data[0].email; //if no primary email is found, we can use the first email in the list
    }

    if (!email) {
      return res
        .status(400)
        .json({ message: "Could not retrieve email from GitHub" });
    }

    //finding the user in the database or creating a new user if not found as we did in the google login controller, why we do this is because we want to have a record of the user in our database for future logins and to store additional information about the user if needed

    let user = await UserModel.findOne({ email });
    if (!user) {
      user = await UserModel.create({
        name: name || login, //if name is not provided by github, we can use the login as the name
        email,
        image: avatar_url,
      });
    }

    //generating a jwt token for the user. reason for this is that we want to authenticate the user in our app and we can use the jwt token to do that. we can send the token to the frontend and store it in the local storag(a local storage is a place where we can store data in the browser and it persists even after the user closes the browser) or in a cookie( a cookie is a small piece of data that is stored in the browser and it is sent to the server with every request) and we use the token to authenticate the user in our app. we can also use the token to authorize the user to access certain routes in our app. for example, we can have a route that is only accessible to authenticated users like we created the handleRefeshToken function in the authcontroller.js file

    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    return res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (err) {
    console.error("Error during GitHub login:", err);

    return res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};

module.exports = { googleLogin, githubLogin };
