import React, { useState, useEffect, useMemo, useRef } from "react";
import dayjs from "dayjs";
import axios from "../../axios";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Button,
  Input,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
  Stack,
  Select,
} from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import { Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";

const BusinessMain = () => {
  const [formData, setFormData] = useState({
    businessName: "",
    owner: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
    },
    category: "",
  });

  const [data, setData] = useState([]);
  const [owners, setOwners] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusinessID, setSelectedBusinessID] = useState(null);

  const toast = useToast();
  const cancelRef = useRef();
  const btnRef = useRef();

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://burhanpur-city-backend-mfs4.onrender.com/api/bussiness/getBuss"
      );
      setData(response.data.result || []);
    } catch (error) {
      console.error("Error fetching business data", error);
    }
  };

  useEffect(() => {
    fetchData();

    axios
      .get("/user/getUser")
      .then((res) => setOwners(res.data.result || []));

    axios
      .get("/category/getCategory")
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  const getOwnerName = (id) => {
    const owner = owners.find((u) => u._id === id);
    return owner ? owner.name : id;
  };

  const getCategoryName = (categoryId) => {
    if (!Array.isArray(categories)) return "Unknown";
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.name : "Unknown";
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "/bussiness/addBuss",
        formData
      );
      toast({
        title: "Business added successfully!",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      setFormData({
        businessName: "",
        owner: "",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: "",
        },
        category: "",
      });
      fetchData();
      closeDrawer();
    } catch (error) {
      toast({
        title: "Error adding business.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `/bussiness/deleteBuss/${selectedBusinessID}`
      );
      toast({
        title: "Business deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
      });
      closeAlert();
      fetchData();
    } catch (error) {
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Sr No.",
        accessor: "srNo",
        Cell: ({ row: { index } }) => <Cell text={index + 1} />,
      },
      {
        Header: "Business Name",
        accessor: "businessName",
        Cell: ({ value }) => <Cell text={value} bold="bold" />,
      },
      {
        Header: "Owner",
        accessor: "owner",
        Cell: ({ value }) => <Cell text={getOwnerName(value)} />,
      },
      {
        Header: "Phone",
        accessor: "phone",
        Cell: ({ value }) => <Cell text={value} />,
      },
      {
        Header: "Address",
        accessor: "address",
        Cell: ({ value }) =>
          typeof value === "object" ? (
            <Cell
              text={`${value.street || ""}, ${value.city || ""}, ${value.state || ""} - ${value.pincode || ""}`}
            />
          ) : (
            <Cell text={value} />
          ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: ({ value }) => (
          <div style={{ color: "black", fontWeight: 500 }}>
            {getCategoryName(value)}
          </div>
        ),
      },
      {
        Header: "Action",
        Cell: ({ row: { original } }) => (
          <Menu>
            <MenuButton
              as={Button}
              onClick={() => setSelectedBusinessID(original._id)}
            >
              Actions
            </MenuButton>
            <MenuList>
              <MenuItem onClick={openAlert}>
                <MdDelete className="mr-2" /> Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      },
    ],
    [owners, categories]
  );

  return (
    <div className="py-20 bg-bgWhite">
      <section className="md:p-1">
        <div className="flex justify-between items-center mb-6">
          <Button ref={btnRef} onClick={openDrawer} colorScheme="purple">
            Add New Business
          </Button>
        </div>

        <div className="mt-4">
          <Table data={data} columns={columns} />
        </div>
      </section>

      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={closeDrawer}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Add Business</DrawerHeader>
          <DrawerBody>
            <form onSubmit={handleSubmit}>
              <Stack spacing={4}>
                <Input
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  required
                />

               

                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />

                <Stack spacing={2}>
                  <Input
                    placeholder="Street"
                    value={formData.address.street}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          street: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="City"
                    value={formData.address.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          city: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="State"
                    value={formData.address.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          state: e.target.value,
                        },
                      })
                    }
                  />
                  <Input
                    placeholder="Pincode"
                    value={formData.address.pincode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: {
                          ...formData.address,
                          pincode: e.target.value,
                        },
                      })
                    }
                  />
                </Stack>

                <Select
                  placeholder="Select Category"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  required
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.title}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories found</option>
                  )}
                </Select>

                <Button type="submit" colorScheme="purple" isLoading={loading}>
                  Add Business
                </Button>
              </Stack>
            </form>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Business
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this business?
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
    </div>
  );
};

export default BusinessMain;
