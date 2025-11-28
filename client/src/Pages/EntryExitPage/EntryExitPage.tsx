import React, { useEffect, useState } from "react";
import FluxTable from "../../Components/FluxTable/FluxTable";
import { StockEntry, IOStock, StockExit } from "../../helpers/declarations";

import SuccessDialog from "../../Components/SuccessDialog/SuccessDialog";
import ErrorDialog from "../../Components/ErrorDialog/ErrorDialog";
import AddStockEntryModal, {
  AddStockEntryDto,
} from "../../Components/AddStockEntryModal/AddStockEntryModal";

import AddStockExitModal, {
  AddStockExitDto,
} from "../../Components/AddStockExitModal/AddStockExitModal";
import TableSkeleton from "../../Components/TableSkeleton/TableSkeleton";
import {
  CreateStockEntry,
  CreateStockExit,
  GetAllIOStock,
  DeleteStockEntry,
  DeleteStockExit,
} from "../../Services/IOService";
import { showErrorModal, showSuccessModal } from "../../helpers/handlers";
import NavBar from "../../Components/NavBar/NavBar";
import SideNav from "../../Components/SideNav/SideNav";
import { useAuth } from "../../Contexts/useAuth";

type Props = {};

const EntryExitPage = (props: Props) => {
  const EntryToStock = (source: StockEntry): IOStock => {
    return {
      article: source.article.name,
      date: source.date,
      id: source.id,
      type: "Entry",
      intervenant: source.supplier.name,
      quantity: source.quantity,
    };
  };
  const ExitToStock = (source: StockExit): IOStock => {
    return {
      article: source.article.name,
      date: source.date,
      id: source.id,
      type: "Exit",
      intervenant: source.destination,
      quantity: source.quantity,
    };
  };
  const [ioStock, setIoStock] = useState<IOStock[]>([]);
  const { isLoggedIn } = useAuth();
  const [isEntryModalOpen, setEntryModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setExitModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const GetAllIoOperations = async () => {
      setLoading(true);
      const response = await GetAllIOStock();
      setIoStock(response);
      setLoading(false);
    };

    GetAllIoOperations();
  }, []);

  const refreshData = async () => {
    setLoading(true);
    const response = await GetAllIOStock();
    setIoStock(response);
    setLoading(false);
  };
  const CloseEntry = async (data?: AddStockEntryDto) => {
    try {
      setEntryModalOpen(false);
      if (data) {
        const reponse = await CreateStockEntry(data);
        if (reponse != null) {
          await refreshData();
          showSuccessModal();
        } else {
          throw new Error("Invalid response from CreateStockEntry");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setEntryModalOpen(false);
      showErrorModal();
    }
  };
  const CloseExit = async (data?: AddStockExitDto) => {
    try {
      setExitModalOpen(false);
      if (data) {
        const reponse = await CreateStockExit(data);
        if (reponse != null) {
          await refreshData();
          showSuccessModal();
        } else {
          throw new Error("Invalid response from CreateStockExit");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setExitModalOpen(false);
      showErrorModal();
    }
  };

  const handleDelete = async (id: number, type: string) => {
    try {
      let result;
      if (type === "Entry") {
        result = await DeleteStockEntry(id);
      } else {
        result = await DeleteStockExit(id);
      }

      if (result.success) {
        await refreshData();
        showSuccessModal();
      } else {
        alert(result.message || `Failed to delete ${type}`);
        showErrorModal();
      }
    } catch (error) {
      showErrorModal();
    }
  };
  return (
    <div className={`w-full m-0 bg-[#171717] ${isLoggedIn() ? "ps-0" : "p-0"}`}>
      {isLoggedIn() ? <SideNav></SideNav> : <></>}
      <NavBar></NavBar>
      <div>
        <div className="pt-36 px-2">
          <div className="flex justify-end gap-5 items-center py-4 container mx-auto">
            <button
              onClick={(e) => {
                setEntryModalOpen(true);
              }}
              className="bg-green-500 hover:bg-green-700 text-white px-3 py-2 font-medium rounded"
            >
              report Entry
            </button>
            <button
              onClick={(e) => {
                setExitModalOpen(true);
              }}
              className="bg-red-500 hover:bg-red-700 text-white px-3 py-2 font-medium rounded"
            >
              report Exit
            </button>
          </div>
          {isLoading ? (
            <TableSkeleton isLoading={isLoading}></TableSkeleton>
          ) : (
            <FluxTable
              iOStock={ioStock}
              onDelete={handleDelete}
              onEditComplete={refreshData}
            ></FluxTable>
          )}
        </div>
      </div>
      {/* {showSuccess && (
        <SuccessDialog onClose={() => setShowSuccess(false)}></SuccessDialog>
      )}
      {showError && (
        <ErrorDialog onClose={() => setShowError(false)}></ErrorDialog>
      )} */}
      {isEntryModalOpen && (
        <AddStockEntryModal
          isOpen={isEntryModalOpen}
          onClose={CloseEntry}
        ></AddStockEntryModal>
      )}
      {isExitModalOpen && (
        <AddStockExitModal
          isOpen={isExitModalOpen}
          onClose={CloseExit}
        ></AddStockExitModal>
      )}
    </div>
  );
};

export default EntryExitPage;
