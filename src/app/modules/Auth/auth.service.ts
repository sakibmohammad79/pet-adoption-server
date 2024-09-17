const loginUserIntoDB = async (payload: {
  password: string;
  email: string;
}) => {
  console.log(payload);
};

export const AuthService = {
  loginUserIntoDB,
};
