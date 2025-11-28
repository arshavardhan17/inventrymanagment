import axios from "axios";

const apiBase = "http://localhost:8083";

export interface UserDto {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
  phone?: string;
}

export const GetCurrentUser = async (): Promise<UserDto | null> => {
  try {
    const response = await axios.get<UserDto>(
      `${apiBase}/Api/User/GetCurrentUser`
    );
    return response.data;
  } catch (error) {
    console.error("Error in GetCurrentUser:", error);
    return null;
  }
};

export const UpdateUser = async (
  updateUserDto: UpdateUserDto
): Promise<UserDto | null> => {
  try {
    const response = await axios.put<UserDto>(
      `${apiBase}/Api/User/UpdateUser`,
      updateUserDto
    );
    return response.data;
  } catch (error) {
    console.error("Error in UpdateUser:", error);
    return null;
  }
};
