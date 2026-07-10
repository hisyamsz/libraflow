export const HEADER_TABLE_USER = [
  "No",
  "Nama Lengkap",
  "NIS",
  "Kelas",
  "Email",
  "Nomor Telepon",
  "Role",
  "Aksi",
];

export const INITIAL_USER_FORM = {
  name: "",
  nis: "",
  role: "MEMBER" as const,
  email: "",
  phone: "",
  password: "",
  class: "",
};

export const INITIAL_EDIT_USER_FORM = {
  name: "",
  nis: "",
  role: "MEMBER" as const,
  email: "",
  phone: "",
  class: "",
};

export const INITIAL_PASSWORD_FORM = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};
