import { Type, Static } from "@sinclair/typebox";

// Define a schema for a user
const UserSchema = Type.Object({
  id: Type.String({ format: "uuid" }),
  name: Type.String(),
  email: Type.String({ format: "email" }),
  age: Type.Optional(Type.Number({ minimum: 0 })),
});

// Infer the TypeScript type from the schema
type User = Static<typeof UserSchema>;
export { UserSchema, User };
