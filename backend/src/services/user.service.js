import { User } from "../models/relations.js";

export const getAllUsers = async () => {
  return await User.findAll({
    attributes: ["id", "username", "avatarUrl", "bio", "role"],
  });
};

export const getUserById = async (id) => {
  return await User.findByPk(id, {
    attributes: ["id", "username", "avatarUrl", "bio", "role"],
  });
};

export const updateUserProfile = async (id, { avatarUrl, bio }) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("Usuario no encontrado");
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;
  if (bio !== undefined) user.bio = bio;
  await user.save();
  return user;
};

// Seed inicial de usuarios — llamar una sola vez al iniciar
export const seedUsers = async () => {
  const usersToSeed = [
    { username: "Seba", role: "admin" }, // el que tiene permisos de admin
    { username: "Pala", role: "user" },
    { username: "Peque", role: "user" },
    { username: "Tade", role: "user" },
  ];

  for (const u of usersToSeed) {
    const exists = await User.findOne({ where: { username: u.username } });
    if (!exists) {
      await User.create(u);
    }
  }
  console.log("Usuarios seed OK");
};
