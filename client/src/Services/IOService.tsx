import axios from "axios";
import { AddStockEntryDto } from "../Components/AddStockEntryModal/AddStockEntryModal";
import { AddStockExitDto } from "../Components/AddStockExitModal/AddStockExitModal";
import { IOStock, StockEntry, StockExit } from "../helpers/declarations";
import { IOMapper } from "../helpers/formatters";
const apiBase = "http://localhost:8083";

export const GetAllIOStock = async (): Promise<IOStock[]> => {
  try {
    const exits = await axios.get<any>(
      `${apiBase}/Api/StockExit/GetAllStockExit`
    );
    console.log("exits", exits);
    const entrys = await axios.get<any>(
      `${apiBase}/Api/StockEntry/GetAllStockEntries`
    );
    console.log("entry", entrys);

    const results: IOStock[] = IOMapper(entrys.data, exits.data);
    console.log(results);
    return results;
  } catch (error) {
    console.error("Error in GetAllIOStock:", error);
    return [];
  }
};

export const CreateStockEntry = async (
  addStockEntryDto: AddStockEntryDto
): Promise<StockEntry | null> => {
  try {
    const reponse = await axios.post<any>(
      `${apiBase}/Api/StockEntry/CreateStockEntry`,
      addStockEntryDto
    );

    return reponse.data;
  } catch (error) {
    console.error("Error in GetAllStockEntrys:", error);
    return null;
  }
};
export const CreateStockExit = async (
  addStockExitDto: AddStockExitDto
): Promise<StockExit | null> => {
  try {
    const reponse = await axios.post<any>(
      `${apiBase}/Api/StockExit/CreateStockExit`,
      addStockExitDto
    );

    return reponse.data;
  } catch (error) {
    console.error("Error in getOutputProgress:", error);
    return null;
  }
};

export const DeleteStockEntry = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await axios.delete(`${apiBase}/Api/StockEntry/DeleteStockEntry/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteStockEntry:", error);
    if (error.response?.data) {
      return { success: false, message: error.response.data };
    }
    return { success: false, message: "Failed to delete stock entry" };
  }
};

export const DeleteStockExit = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await axios.delete(`${apiBase}/Api/StockExit/DeleteStockExit/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteStockExit:", error);
    if (error.response?.data) {
      return { success: false, message: error.response.data };
    }
    return { success: false, message: "Failed to delete stock exit" };
  }
};
