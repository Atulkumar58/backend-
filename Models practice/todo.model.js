import mongoose from "mongoose"

const todoSchema = new mongoose.Schema(
  {
    content:{
      type: String,
      required: true
    },
    complete:{
      type: Boolean,
      default : false
    },
    createdBy:{
      type: mongoose.schema.Types.ObjectId,
      ref : "User"
    },
    subTodos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubTodo"
      }
    ] // ARRAY OF SUB TODOS
  },
  {timestamps: true}
);

export const Todo = mongoose.model("Todo", todoSchema);