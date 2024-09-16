import User from "../models/userModel.js";

export const signup = async (req, res) => {
  try {
    console.log(req.body);
    const { name, email, password } = req.body;
    const sample = "sample from node";

    const user = await User.create({ name, email, password });
    res.status(200).json({ user, sample });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

export const getOneUser = async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Params: ", req.params);
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (err) {
    res.status(400).json({ message: err });
  }
};
