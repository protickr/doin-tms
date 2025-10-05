import { Type } from "@sinclair/typebox";

// Input for creating/updating a task
export const TaskInput = Type.Object({
  title: Type.String(),
  description: Type.String(),
  status: Type.Optional(
    Type.Union([
      Type.Literal("Pending"),
      Type.Literal("In Progress"),
      Type.Literal("Completed"),
    ])
  ),
  assignedUserId: Type.String({ format: "uuid" }),
  dueDate: Type.Optional(Type.String({ format: "date-time" })),
});

// Output schema
export const TaskResponse = Type.Object({
  id: Type.String({ format: "uuid" }),
  title: Type.String(),
  description: Type.String(),
  status: Type.String(),
  assignedUserId: Type.Optional(Type.String({ format: "uuid" })),
  dueDate: Type.Optional(Type.String({ format: "date-time" })),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

export const tasksListResponse = Type.Array(TaskResponse);
export type TaskInputType = typeof TaskInput;
export type TaskResponseType = typeof TaskResponse;
export type TasksListResponseType = typeof tasksListResponse;
