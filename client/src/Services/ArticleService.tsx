import { AddArticleDto } from "../Components/AddArticleModal/AddArticleModal";
import { Article } from "../helpers/declarations";
import axios from "axios";

const apiBase = "http://localhost:8083";
export const AllArticles = async (): Promise<Article[]> => {
  try {
    const response = await axios.get<any>(
      `${apiBase}/Api/Article/GetAllArticles`
    );
    console.log(response);

    return response.data;
  } catch (error) {
    console.error("Error in GetAllArticles:", error);
    return [];
  }
};
export const CreateArticle = async (
  addArticleDto: AddArticleDto
): Promise<Article | null> => {
  try {
    const reponse = await axios.post<any>(
      `${apiBase}/Api/Article/CreateArticle`,
      addArticleDto
    );

    return reponse.data;
  } catch (error) {
    console.error("Error in getAllArticles:", error);
    return null;
  }
};

export const UpdateArticle = async (
  id: number,
  updateArticleDto: any
): Promise<Article | null> => {
  try {
    const response = await axios.put<any>(
      `${apiBase}/Api/Article/UpdateArticle/${id}`,
      updateArticleDto
    );

    return response.data;
  } catch (error) {
    console.error("Error in updateArticle:", error);
    return null;
  }
};

export const DeleteArticle = async (
  id: number
): Promise<{ success: boolean; message?: string }> => {
  try {
    await axios.delete(`${apiBase}/Api/Article/DeleteArticle/${id}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteArticle:", error);
    if (error.response?.data) {
      return { success: false, message: error.response.data };
    }
    return { success: false, message: "Failed to delete article" };
  }
};
