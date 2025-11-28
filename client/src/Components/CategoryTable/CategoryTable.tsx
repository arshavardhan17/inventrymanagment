import React, { useState } from "react";
import { Category } from "../../helpers/declarations";
import { truncateText } from "../../helpers/formatters";
import { DeleteCategory } from "../../Services/CategoryService";

interface Props {
  categories: Category[];
  onCategoryDeleted?: (categoryId: number) => void;
}

const CategoryTable = (props: Props) => {
  const handleDelete = async (categoryId: number) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const success = await DeleteCategory(categoryId);
      if (success && props.onCategoryDeleted) {
        props.onCategoryDeleted(categoryId);
      }
    }
  };
  return (
    <div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-900 dark:text-gray-900">
          <thead className="text-xs text-gray-700 uppercase bg-gradient-to-l from-[#08D6DA] to-[#9DF8FA] dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3">
                Description
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {props.categories.map((category) => (
              <tr
                key={category.id}
                className="bg-gradient-to-r from-[#08D6DA] to-[#9DF8FA] odd:dark:bg-gray-900 border-none  even:dark:bg-gray-800 border-b dark:border-gray-700"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {category.name}
                </th>
                <td className="px-6 py-4">
                  {truncateText(category.description, 100)}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="font-medium text-red-600 dark:text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
