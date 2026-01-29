import bcrypt from "bcryptjs";

// In-memory user storage - replace with database later
export const users = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@vsa.org",
    phone: "(555) 123-4567",
    password: bcrypt.hashSync("admin123", 10), // password: admin123
    role: "admin",
    status: "active",
    joinDate: "2024-01-01",
    emailOptIn: true,
  },
  {
    id: 2,
    name: "John Doe",
    email: "john@example.com",
    phone: "(555) 234-5678",
    password: bcrypt.hashSync("password123", 10), // password: password123
    role: "member",
    status: "active",
    joinDate: "2024-01-15",
    emailOptIn: false,
  },
];
