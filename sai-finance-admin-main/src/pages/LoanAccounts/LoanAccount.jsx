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
import CreateLoanUser from "./CreateLoanUser";
import RegisterBusinessForm from "../buisnesspart/buisnessComponents/RegisterBusinessForm";

function UserManagement() {
  const [data, setData] = useState([]);
  const [userBusinesses, setUserBusinesses] = useState({});
  const [selectedUserIdForBusiness, setSelectedUserIdForBusiness] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [isBusinessFormOpen, setIsBusinessFormOpen] = useState(false);
  const toast = useToast();

  const { isOpen: isAlertOpen, onOpen: openAlert, onClose: closeAlert } = useDisclosure();
  const { isOpen: isCreateOpen, onOpen: openCreate, onClose: closeCreate } = useDisclosure();
  const cancelRef = useRef();

  // 📥 Load users + fetch each user's business data
  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await axios.get("/Users/userDetails");
        if (res?.result) {
          setData(res.result);
          const resultMap = {};
          await Promise.all(res.result.map(async (u) => {
            const { data: bizRes } = await axios.get(`/bussiness/getMyBuss?owner=${u._id}`);
            resultMap[u._id] = bizRes.data.result || [];
          }));
          setUserBusinesses(resultMap);
        }
      } catch (err) {
        console.error(err);
      }
    })();
    axios.get("/category/getCategory").then(({ data }) => setCategories(data.data || []));
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/Users/userDetails/${id}`);
      toast({ title: "Deleted", status: "success", duration: 3000, isClosable: true });
      setData(d => d.filter(u => u._id !== id));
    } catch (err) {
      toast({ title: "Error", status: "error", duration: 3000, isClosable: true });
    }
    closeAlert();
  };

  const columns = useMemo(() => [
    { Header: "#", Cell: ({ row: { index } }) => <Cell text={index + 1} /> },
    { Header: "Name", accessor: "name", Cell: ({ value }) => <Cell text={value} bold /> },
    { Header: "Email", accessor: "email", Cell: ({ value }) => <Cell text={value} bold /> },
    { Header: "Phone", accessor: "phone", Cell: ({ value }) => <Cell text={value} /> },
    { Header: "Role", accessor: "role", Cell: ({ value }) => <Cell text={value} /> },
    {
      Header: "Registered",
      accessor: "createdAt",
      Cell: ({ value }) => <Cell text={dayjs(value).format("D MMM, YYYY h:mm A")} />,
    },
    {
      Header: "Action",
      Cell: ({ row: { original } }) => {
        const hasBiz = userBusinesses[original._id]?.length > 0;
        return (
          <Menu>
            <MenuButton as={Button} colorScheme="purple">Actions</MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  setSelectedUserIdForBusiness(original._id);
                  setIsBusinessFormOpen(true);
                }}
              >
                <HiStatusOnline /> {hasBiz ? "View Business" : "Add Business"}
              </MenuItem>
              <Link to={`/dash/edit-user/${original._id}`}>
                <MenuItem><MdEdit /> Edit</MenuItem>
              </Link>
              <MenuItem onClick={openAlert}><MdDelete /> Delete</MenuItem>
            </MenuList>
          </Menu>
        );
      },
    },
  ], [userBusinesses]);

  return (
    <div className="py-8">
      <div className="flex justify-between mb-4">
        <Button colorScheme="purple" onClick={openCreate}>Add New User</Button>
        <InputGroup w="300px">
          <Input placeholder="Search..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <InputRightAddon>
            <Button colorScheme="green">Search</Button>
          </InputRightAddon>
        </InputGroup>
      </div>

      <Table
        data={data.filter(u =>
          [u.name, u.email, u.phone].some(f => f?.toLowerCase().includes(searchTerm.toLowerCase()))
        )}
        columns={columns}
      />

      <AlertDialog isOpen={isAlertOpen} leastDestructiveRef={cancelRef} onClose={closeAlert} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete User?</AlertDialogHeader>
            <AlertDialogBody>Are you sure?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>Cancel</Button>
              <Button colorScheme="red" onClick={() => handleDelete(selectedUserIdForBusiness)}>Delete</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <CreateLoanUser isOpen={isCreateOpen} onClose={closeCreate} />

      <Drawer isOpen={isBusinessFormOpen} placement="right" onClose={() => setIsBusinessFormOpen(false)} size="md">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {userBusinesses[selectedUserIdForBusiness]?.length > 0 ? "Business Info" : "Add Business"}
          </DrawerHeader>
          <DrawerBody>
            {userBusinesses[selectedUserIdForBusiness]?.length > 0 ? (
              userBusinesses[selectedUserIdForBusiness].map(biz => (
                <div key={biz._id} className="mb-4">
                  <p><strong>Name:</strong> {biz.name}</p>
                  <p><strong>Category:</strong> {biz.category}</p>
                  <p><strong>Address:</strong> {biz.location}</p>
                </div>
              ))
            ) : (
              <RegisterBusinessForm
                categories={categories}
                onSubmit={businessData => {
                  const payload = { ...businessData, owner: selectedUserIdForBusiness };
                  return axios.post("/bussiness/registerBuss", payload).then(() => {
                    toast({ title: "Registered", status: "success", duration: 3000 });
                    setIsBusinessFormOpen(false);
                    // update business list in memory
                    setUserBusinesses(prev => ({
                      ...prev,
                      [selectedUserIdForBusiness]: [payload]
                    }));
                  });
                }}
              />
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export default UserManagement;
