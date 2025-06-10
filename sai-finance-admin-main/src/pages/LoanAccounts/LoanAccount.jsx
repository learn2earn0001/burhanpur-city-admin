import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "../../axios";

import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  InputRightAddon,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
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
} from "@chakra-ui/react";

import { MdEdit, MdDelete } from "react-icons/md";
import { HiStatusOnline } from "react-icons/hi";

function UserManagement() {
  const [data, setData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();
  const cancelRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get("/Users/userDetails");
        if (response?.data?.result) {
          setData(response.data.result);
        }
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    }
    fetchData();
  }, []);

  const handleDelete = () => {
    axios
      .delete(`/Users/userDetails/${selectedUserID}`)
      .then(() => {
        toast({
          title: "User deleted successfully.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
        onClose();
        setData((prev) => prev.filter((user) => user._id !== selectedUserID));
      })
      .catch(() => {
        toast({
          title: "Something went wrong!",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      });
  };

  const columns = useMemo(() => [
    {
      Header: "Sr No.",
      accessor: "srNo",
      Cell: ({ row: { index } }) => <Cell text={index + 1} />,
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: ({ value }) => <Cell text={value} bold="bold" />,
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: ({ value }) => <Cell text={value} bold="bold" />,
    },
    {
      Header: "Phone",
      accessor: "phone",
      Cell: ({ value }) => <Cell text={value} />,
    },
    {
      Header: "Address",
      accessor: "address",
      Cell: ({ value }) => <Cell text={value} />,
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: ({ value }) => <Cell text={value} />,
    },
    {
      Header: "Status",
      accessor: "isActive",
      Cell: ({ value }) => (
        <Cell text={value ? "Active" : "Inactive"} />
      ),
    },
    {
      Header: "Registered On",
      accessor: "createdAt",
      Cell: ({ value }) => (
        <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />
      ),
    },
    {
      Header: "Action",
      Cell: ({ row: { original } }) => (
        <Menu>
          <MenuButton as={Button} onClick={() => setSelectedUserID(original._id)}>
            Actions
          </MenuButton>
          <MenuList>
            <Link to={`/dash/view-user-details/${original._id}`}>
              <MenuItem>
                <HiStatusOnline className="mr-4" /> View Details
              </MenuItem>
            </Link>
            <Link to={`/dash/edit-user/${original._id}`}>
              <MenuItem>
                <MdEdit className="mr-4" /> Edit
              </MenuItem>
            </Link>
            <MenuItem onClick={onOpen}>
              <MdDelete className="mr-4" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      ),
    },
  ], [data]);

  return (
    <div className="py-8 bg-bgWhite">
      <section className="md:p-1">
        <div className="py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button onClick={openDrawer} ref={btnRef} className="bg-purple">
                Total Users: {data.length}
              </Button>
              <Link to={`/dash/create-user`}>
                <Button className="bg-purple" colorScheme="orange">
                  Add New User
                </Button>
              </Link>
            </div>

            <div className="w-96">
              <InputGroup size="sm">
                <InputLeftElement pointerEvents="none" />
                <Input placeholder="Search..." border="1px solid #949494" />
                <InputRightAddon border="none">
                  <Button className="bg-purple" size="sm">
                    Search
                  </Button>
                </InputRightAddon>
              </InputGroup>
            </div>
          </div>

          <div className="mt-4">
            <Table data={data} columns={columns} />
          </div>
        </div>
      </section>

      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>User Filter/Info</DrawerHeader>
          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>Cancel</Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">Delete User</AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this user?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </div>
  );
}

export default UserManagement;
