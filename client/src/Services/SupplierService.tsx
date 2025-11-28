import { AddSupplierDto } from "../Components/AddSupplierModal/AddSupplierModal";
import { Supplier } from "../helpers/declarations";
import axios from "axios";

const apiBase = "http://localhost:8083";

export const AllSuppliers = async (): Promise<Supplier[]> => {
  try {
    const response = await axios.get<any>(
      `${apiBase}/Api/Supplier/GetAllSuppliers`
    );

    return response.data;
  } catch (error) {
    console.error("Error in getAllSuppliers:", error);
    return [];
  }
};

export const CreateSupplier = async (
  addSupplierDto: AddSupplierDto
): Promise<Supplier | null> => {
  try {
    const reponse = await axios.post<any>(
      `${apiBase}/Api/Supplier/CreateSupplier`,
      addSupplierDto
    );

    return reponse.data;
  } catch (error) {
    console.error("Error in getAllSuppliers:", error);
    return null;
  }
};

export const UpdateSupplier = async (
  id: number,
  updateSupplierDto: any
): Promise<Supplier | null> => {
  try {
    const response = await axios.put<any>(
      `${apiBase}/Api/Supplier/UpdateSupplier/${id}`,
      updateSupplierDto
    );

    return response.data;
  } catch (error) {
    console.error("Error in updateSupplier:", error);
    return null;
  }
};

export const DeleteSupplier = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await axios.delete(`${apiBase}/Api/Supplier/DeleteSupplier/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteSupplier:", error);
    if (error.response?.data) {
      return { success: false, message: error.response.data };
    }
    return { success: false, message: "Failed to delete supplier" };
  }
};
