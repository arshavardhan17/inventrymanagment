import React, { useEffect, useState } from "react";
import ArticleTable from "../../Components/ArticleTable/ArticleTable";
import { Article } from "../../helpers/declarations";
import AddArticleModal, {
  AddArticleDto,
} from "../../Components/AddArticleModal/AddArticleModal";
import EditArticleModal from "../../Components/EditArticleModal/EditArticleModal";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import {
  AllArticles,
  CreateArticle,
  UpdateArticle,
  DeleteArticle,
} from "../../Services/ArticleService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import { useAuth } from "../../Contexts/useAuth";
import SideNav from "../../Components/SideNav/SideNav";
import NavBar from "../../Components/NavBar/NavBar";

type Props = {};

const StockPage = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { isLoggedIn } = useAuth();
  useEffect(() => {
    const GetAllArticles = async () => {
      setLoading(true);
      const results = await AllArticles();
      console.log(results);
      setArticles(results);
      setLoading(false);
    };
    GetAllArticles();
  }, []);
  const CloseModal = async (addArticleDto?: AddArticleDto) => {
    setModalOpen(false);
    if (addArticleDto) {
      console.log(addArticleDto);
      try {
        const response = await CreateArticle(addArticleDto);
        if (response) {
          setArticles([...articles, response]);
          showSuccessModal();
        } else {
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    }
  };

  const CloseEditModal = async (article?: Article) => {
    setEditModalOpen(false);
    if (article) {
      try {
        const updateDto = {
          name: article.name,
          description: article.description,
          quantity: article.quantity,
          price: article.price,
          categoryId: article.category?.id || 0,
          supplierId: article.supplier?.id || 0,
          barcode: article.barcode,
        };
        const response = await UpdateArticle(article.id, updateDto);
        if (response) {
          setArticles(
            articles.map((a) => (a.id === article.id ? response : a))
          );
          showSuccessModal();
        } else {
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    }
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
        const result = await DeleteArticle(id);
        if (result.success) {
          setArticles(articles.filter((a) => a.id !== id));
          showSuccessModal();
        } else {
          alert(result.message || "Failed to delete article");
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    }
  };

  return (
    <div className={`w-full m-0 bg-[#171717] ${isLoggedIn() ? "ps-0" : "p-0"}`}>
      {isLoggedIn() ? <SideNav /> : <></>}
      <NavBar />
      <div className="pt-36 px-2">
        <div className="flex justify-end py-4 container mx-auto">
          <button
            onClick={(e) => {
              setModalOpen(true);
            }}
            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 font-medium rounded"
          >
            Add Article
          </button>
        </div>
        {isLoading ? (
          <TableSkeleton isLoading={isLoading}></TableSkeleton>
        ) : (
          <ArticleTable
            articles={articles}
            onEdit={handleEdit}
            onDelete={handleDelete}
          ></ArticleTable>
        )}
      </div>
      <AddArticleModal
        isOpen={isModalOpen}
        onClose={CloseModal}
      ></AddArticleModal>
      <EditArticleModal
        isOpen={isEditModalOpen}
        onClose={CloseEditModal}
        article={selectedArticle}
      ></EditArticleModal>
      {/* {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
      {showError && <ErrorDialog onClose={() => setShowError(false)} />} */}
    </div>
  );
};

export default StockPage;
