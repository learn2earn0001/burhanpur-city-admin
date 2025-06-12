import React, { useEffect, useState, useMemo, useRef } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
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

// 🆕 import the modal component
import CreateLoanUser from "./CreateLoanUser"; // ⬅️ adjust the path if needed

function UserManagement() {
  const [data, setData] = useState([]);
  const [selectedUserID, setSelectedUserID] = useState(null);

  const toast = useToast();

  // delete‐user confirmation dialog
  const {
    isOpen: isAlertOpen,
    onOpen: openAlert,
    onClose: closeAlert,
  } = useDisclosure();

  // side drawer for filters
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  // modal for creating a user
  const {
    isOpen: isCreateOpen,
    onOpen: openCreate,
    onClose: closeCreate,
  } = useDisclosure();

  const cancelRef = useRef();
  const btnRef = useRef();

  // 🚀 fetch users once on mount
  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await axios.get("/Users/userDetails");
        if (res?.result) setData(res.result);
      } catch (err) {
        console.error("Error fetching user data", err);
      }
    })();
  }, []);

  // 🔥 remove user handler
  const handleDelete = async () => {
    try {
      await axios.delete(`/Users/userDetails/${selectedUserID}`);
      toast({
        title: "User deleted successfully.",
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
      closeAlert();
      setData((prev) => prev.filter((u) => u._id !== selectedUserID));
    } catch (err) {
      toast({
        title: "Something went wrong!",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top",
      });
    }
  };

  // 📊 table column definitions (memoized)
  const columns = useMemo(
    () => [
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
        Cell: ({ value }) => <Cell text={value ? "Active" : "Inactive"} />,
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
            <MenuButton
              as={Button}
              onClick={() => setSelectedUserID(original._id)}
            >
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
              <MenuItem onClick={openAlert}>
                <MdDelete className="mr-4" /> Delete
              </MenuItem>
            </MenuList>
          </Menu>
        ),
      },
    ],
    []
  );

  return (
    <div className="py-8 bg-bgWhite">
      {/* ========================= HEADER & SEARCH ========================= */}
      <section className="md:p-1">
        <div className="py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button onClick={openDrawer} ref={btnRef} className="bg-purple">
                Total Users: {data.length}
              </Button>
              {/* 🆕 open create-user modal */}
              <Button
                // className="bg-purple"
                colorScheme="purple"
                onClick={openCreate}
              >
                Add New User
              </Button>
            </div>
            {/* 🔍 search bar (not wired) */}
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

          {/* ========================= DATA TABLE ========================= */}
          <div className="mt-4">
            <Table data={data} columns={columns} />
          </div>
        </div>
      </section>

      {/* ========================= FILTER DRAWER ========================= */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={closeDrawer}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>User Filter/Info</DrawerHeader>
          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* ========================= DELETE ALERT ========================= */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={cancelRef}
        onClose={closeAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete User
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this user?
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

      {/* ========================= CREATE USER MODAL ========================= */}
      <CreateLoanUser isOpen={isCreateOpen} onClose={closeCreate} />
    </div>
  );
}

export default UserManagement;
