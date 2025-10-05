import { Type, Static } from "@sinclair/typebox";

// Define a schema for a user
const User = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  createdAt: Type.String({ format: "date-time" }),
  updatedAt: Type.String({ format: "date-time" }),
});

const UserLoginResponse = Type.Object({
  name: Type.String(),
  email: Type.String({ format: "email" }),
  token: Type.String(),
});

const UserSignupInput = Type.Object({
  name: Type.String({ minLength: 1 }),
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
});

const UserLoginInput = Type.Object({
  email: Type.String({ format: "email" }),
  password: Type.String({ minLength: 6 }),
});

type UserType = Static<typeof User>;
export { User, UserType, UserSignupInput, UserLoginInput, UserLoginResponse };

