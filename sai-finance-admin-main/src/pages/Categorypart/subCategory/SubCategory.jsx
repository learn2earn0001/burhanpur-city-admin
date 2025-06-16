import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "../../../axios";
import Table from "../../../componant/Table/Table";
import Cell from "../../../componant/Table/cell";

import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";
import NewNavbar from "../../Dashboard/main/NewNavbar";
// import { Atom } from "react-loading-indicators";
import Loding from "../../../componant/Loader/Loding";

import { motion } from "framer-motion";

const SubcategoryPage = () => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const toast = useToast();

  const [modalOpen, setModalOpen] = useState(false);

  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    image: "",
  });

  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const cancelRef = useRef();

  const openAddModal = () => {
    setEditId(null);
    setFormData({ name: "", description: "", image: "", address: "" });
    setModalOpen(true);
  };
  // here

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/subcategory/getSubCategory/${categoryId}`);
      setSubcategories(res.data.result || []);

      console.log("Subcategory Created:", res.data.result);
      // console.log("Fetched Subcategories:", res.data.result[0]);
    } catch (err) {
      console.error("Error fetching subcategories", err);
      toast({
        title: "Error loading subcategories",
        description: err.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubcategories();
  }, [categoryId]);

  // console.log("categoryId from URL:", categoryId);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, image, address } = formData;

    if (!name.trim() || !image.trim()) {
      toast({
        title: "Missing required fields.",
        description: "Name and Image URL are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim() || "No description",
      image: image.trim(),
      address: address,
      isActive: true,
      category: categoryId,
    };

    try {
      setLoading(true);
      if (editId) {
        // Edit 
        await axios.put(`/subcategory/updateSubcategory/${editId}`, payload);
       

        
        // console.log(data)
        console.log("Submitted Payload:", editId ? "EDIT" : "ADD", payload);

        toast({ title: "Subcategory Updated!", status: "success" });
      } else {
        // Add 
        await axios.post("/subcategory/createSubcategory", payload);
        toast({ title: "Subcategory added!", status: "success" });
      }

      setModalOpen(false);
      fetchSubcategories(); 
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Server error",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
    console.log("Payload going to backend:", payload);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/subcategory/deleteSubCategory/${selectedId}`);
      setSubcategories((prev) =>
        prev.filter((item) => item._id !== selectedId)
      );
      toast({
        title: "Subcategory deleted successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      closeAlert();
    } catch (err) {
      toast({
        title: "Error deleting subcategory.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleEditClick = (subcategory) => {
    console.log("Editing Subcategory:", subcategory);
    console.log(" Address to set:", subcategory.address); 
    setEditId(subcategory._id);
    setFormData({
      name: subcategory.name,
      description: subcategory.description,
      address: subcategory.address,
      image: subcategory.image,
    });
    setModalOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ row: { index } }) => <Cell text={index + 1} />,
      },
      {
        Header: "Image",
        accessor: "image",

        Cell: ({ value }) => (
          <img
            src={value || "https://via.placeholder.com/64"}
            alt="img"
            className="w-16 h-16 rounded object-cover"
          />
        ),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ value }) => <Cell text={value} bold="bold" />,
      },
      {
        Header: "Description",
        accessor: "description",
        Cell: ({ value }) => <Cell text={value} />,
      },
      {
        Header: "Address",
        accessor: "address",
        Cell: ({ value }) => <Cell text={value} />,
      },
      {
        Header: "Actions",
        Cell: ({ row: { original } }) => (
          <Menu>
            <MenuButton as={Button} onClick={() => setSelectedId(original._id)}>
              Actions
            </MenuButton>
            <MenuList>
              <Link to={`/subcategory/details/${original._id}`}>
                <MenuItem>
                  <HiStatusOnline className="mr-2" /> View
                </MenuItem>
              </Link>
              {/* <Link to={`/subcategory/edit/${original._id}`}> */}
              <MenuItem onClick={() =>{ 
                handleEditClick(original)
                console.log(" Edit clicked:", original);
                console.log("Original Row Object:", original);

              }}>
                <MdEdit className="mr-2" /> Edit
              </MenuItem>
              {/* </Link> */}
              <MenuItem onClick={openAlert}>
                <MdDelete className="mr-2" /> Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      },
    ],
    [subcategories]
  );

  console.log("Modal Open State:", modalOpen);

  return (
    <>
      <NewNavbar />
      <br />
      <br />
      <br />
      <br />
      {loading ? (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <Loding />
        </div>
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Subcategories</h2>
            {/* <Link to={`/subcategory/add/${categoryId}`}>
              <Button onClick={openAddModal} colorScheme="blue">+ Add Subcategory</Button>
            </Link> */}
            <Button onClick={openAddModal} colorScheme="blue">
              + Add Subcategory
            </Button>
          </div>
          <Table data={subcategories} columns={columns} />
        </div>
      )}

      {/* Alert Dialog for delete */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Subcategory
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this subcategory?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg"
          >
            <h2 className="text-xl font-semibold mb-4">
              {editId ? "Edit Subcategory" : "Add Subcategory"}
            </h2>
            <form 
             key={editId || "add-form"} //-=-=-=-=-=--=-=--=-=
            onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subcategory Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
              />

              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="border w-full px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end gap-2">
                <Button onClick={() => setModalOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" isLoading={loading} colorScheme="blue">
                  {editId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default SubcategoryPage;
