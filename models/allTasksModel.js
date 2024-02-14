const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const allTasksSchema = new Schema(
  {
    user_id: { type: String, required: true },
    tasksList: [
      {
        date: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        tasks: [
          {
            tasksName: [
              {
                name: { type: String, required: true },
                status: { type: Boolean, required: true },
              },
            ],
            color: { type: String, required: true },
          },
        ],
      },
    ],
    completedList: [
      {
        date: { type: Number, required: true },
        month: { type: Number, required: true },
        year: { type: Number, required: true },
        tasks: [
          {
            tasksName: [
              {
                name: { type: String, required: true },
                status: { type: Boolean, required: true },
              },
            ],
            color: { type: String, required: true },
          },
        ],
      },
    ],
    makerList: [
      {
        tasks: [
          {
            tasksName: [
              {
                name: { type: String, required: true },
                status: { type: Boolean, required: true },
              },
            ],
            color: { type: String, required: true },
          },
        ],
      },
    ],
  },
  { _id: true }
);

module.exports = mongoose.model("AllTasks", allTasksSchema);
