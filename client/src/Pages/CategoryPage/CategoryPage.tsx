import React, { useEffect, useState } from "react";
import CategoryTable from "../../Components/CategoryTable/CategoryTable";
import { Category } from "../../helpers/declarations";

import AddCategoryModal, {
  AddCategoryDto,
} from "../../Components/AddCategoryModal/AddCategoryModal";
import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import { AllCategorys, CreateCategory } from "../../Services/CategoryService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import NavBar from "../../Components/NavBar/NavBar";
import SideNav from "../../Components/SideNav/SideNav";
import { useAuth } from "../../Contexts/useAuth";

type Props = {};

const CategoryPage = (props: Props) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [categories, setCategorys] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isLoggedIn } = useAuth();

  const handleCategoryDeleted = (categoryId: number) => {
    setCategorys(categories.filter((cat) => cat.id !== categoryId));
  };

  useEffect(() => {
    const GetAllCategorys = async () => {
      try {
        setIsLoading(true);
        const results = await AllCategorys();
        setCategorys(results);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    GetAllCategorys();
  }, []);
  const CloseModal = async (addCategoryDto?: AddCategoryDto) => {
    setModalOpen(false);
    if (addCategoryDto) {
      console.log(addCategoryDto);
      try {
        const reponse = await CreateCategory(addCategoryDto);
        if (reponse) {
          setCategorys([...categories, reponse]);
          showSuccessModal();
        } else {
          showErrorModal();
        }
      } catch (error) {
        showErrorModal();
      }
    } else {
    }
  };
  return (
    <div className={`w-full m-0 bg-[#171717] ${isLoggedIn() ? "ps-0" : "p-0"}`}>
      {isLoggedIn() ? <SideNav></SideNav> : <></>}
      <NavBar></NavBar>
      <div>
        <div className="pt-36 px-2">
          <div className="flex justify-end py-4 container mx-auto">
            <button
              onClick={(e) => setModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-2 font-medium rounded"
            >
              Add Category
            </button>
          </div>
          {isLoading ? (
            <TableSkeleton isLoading={isLoading}></TableSkeleton>
          ) : (
            <CategoryTable
              categories={categories}
              onCategoryDeleted={handleCategoryDeleted}
            ></CategoryTable>
          )}
        </div>
      </div>
      {isModalOpen && (
        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={CloseModal}
        ></AddCategoryModal>
      )}
      {/* {showSuccess && <SuccessDialog onClose={() => setShowSuccess(false)} />}
      {showError && <ErrorDialog onClose={() => setShowError(false)} />} */}
    </div>
  );
};

export default CategoryPage;
