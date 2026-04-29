export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type AdminLoginResponse = {
  data: {
    admin: AdminUser;
    token: string;
  };
  message: string;
};
