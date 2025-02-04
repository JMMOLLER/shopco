import type { UserType } from "@models/Users";

const users: UserType[] = [
  {
    password: "$2b$10$Q6HMxjIyv6nnlTPi/tvkD.jvqnJEUhxlDeD.VvQ9LeI6BAYVTb14q",
    id: "0194ceb8-37cb-7acd-a2dd-31f216af7128",
    email: "admin@admin.com",
    name: "Super Admin",
    lastName: ""
  },
  {
    password: "$2b$10$Q6HMxjIyv6nnlTPi/tvkD.jvqnJEUhxlDeD.VvQ9LeI6BAYVTb14q",
    id: "0194cebb-c6ab-717c-ab45-bffa2ee68bd4",
    email: "user@user.com",
    lastName: "Doe",
    name: "John",
  }
];

export default users;
