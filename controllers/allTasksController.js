const AllTasks = require("../models/allTasksModel");
const mongoose = require("mongoose");

// // GET all
// const getAllTasks = async (req, res) => {
//   try {
//     const data = await AllTasks.aggregate([
//       {
//         $set: {
//           tasksList: {
//             $sortArray: {
//               input: "$tasksList",
//               sortBy: { year: 1, month: 1, date: 1 },
//             },
//           },
//           completedList: {
//             $sortArray: {
//               input: "$completedList",
//               sortBy: { year: 1, month: 1, date: 1 },
//             },
//           },
//         },
//       },
//     ]);
//     res.status(200).json(data[0]);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// GET one
const getTasks = async (req, res) => {
  const { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Users not found" });

  try {
    let data = await AllTasks.findOne({ user_id: id });

    if (!data) {
      data = await AllTasks.create({
        user_id: id,
        tasksList: [],
        completedList: [],
        makerList: [{ tasks: [] }, { tasks: [] }, { tasks: [] }],
      });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update one
const updateTasks = async (req, res) => {
  const { id } = req.user;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ error: "Users not found" });

  const update = await AllTasks.findOneAndUpdate(
    { user_id: id },
    { ...req.body }
  );

  if (!update) return res.status(404).json({ error: "Users not found" });

  res.status(200).json(update);
};

module.exports = { getTasks, updateTasks };
