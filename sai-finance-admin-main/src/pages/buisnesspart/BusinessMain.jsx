import React, { useState, useEffect, useMemo, useRef } from "react";
import axios from "../../axios";
import dayjs from "dayjs";
import Table from "../../componant/Table/Table";
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, useToast, AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter, Menu, MenuButton, MenuList, MenuItem, InputGroup, InputLeftElement, Input, InputRightAddon } from "@chakra-ui/react";
import { MdDelete } from "react-icons/md";
import RegisterBusinessForm from "./buisnessComponents/RegisterBusinessForm";
import Cell from "../../componant/Table/cell";

const BusinessMain = () => {
    const [data, setData] = useState([]);
    const [owners, setOwners] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedBusinessID, setSelectedBusinessID] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingBusiness, setEditingBusiness] = useState(null);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure(); // modal
    const {
        isOpen: isAlertOpen,
        onOpen: openAlert,
        onClose: closeAlert,
    } = useDisclosure(); // delete alert

    const cancelRef = useRef();
    const toast = useToast();

    const fetchData = async () => {
        try {
            const res = await axios.get("/bussiness/getBuss");
            setData(res.data.result || []);
        } catch (err) {
            console.error("Error fetching businesses", err);
        }
    };

    useEffect(() => {
        fetchData();
        axios.get("/user/getUser").then((res) => setOwners(res.data.result || []));
        axios
            .get("/category/getCategory")
            .then((res) => setCategories(res.data.data || []));
    }, []);




    const getOwnerName = (id) => {
        const owner = owners.find((o) => o._id === id);
        return owner?.name || owner?.title || "Unknown";
    };

    const getCategoryName = (id) => {
        const category = categories.find((c) => c._id === id);
        return category?.name || "Unknown";
    };

    const handleFormSubmit = async (formData) => {
        setLoading(true);
        try {
            if (isEditing && editingBusiness) {
                await axios.put(`/bussiness/updateBuss/${editingBusiness._id}`, formData);
                toast({ title: "Business updated.", status: "success", duration: 3000 });
            } else {
                https://burhanpur-city-backend-mfs4.onrender.com/api/bussiness/registerBuss
                await axios.post("bussiness/registerBuss", formData);
                toast({ title: "Business added.", status: "success", duration: 3000 });
            }
            fetchData();
            onClose();
            setIsEditing(false);
            setEditingBusiness(null);
        } catch (error) {
            toast({ title: "Operation failed.", status: "error", duration: 3000 });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/bussiness/deleteBuss/${selectedBusinessID}`);
            toast({ title: "Business deleted.", status: "success", duration: 3000 });
            closeAlert();
            fetchData();
        } catch (err) {
            toast({ title: "Delete failed.", status: "error", duration: 3000 });
        }
    };

    const columns = useMemo(() => [
        {
            Header: "Sr No.",
            Cell: ({ row: { index } }) => <Cell text={index + 1} />,
        },
        {
            Header: "Business Name",
            accessor: "name",
            Cell: ({ value }) => <Cell text={value || "Unknown"} bold="bold" />,
        },

        


        {
            Header: "Category",
            accessor: "category",
            Cell: ({ value }) => <Cell text={getCategoryName(value)} />,
        },
        {
            Header: "Description",
            accessor: "description",
            Cell: ({ value }) => <Cell text={value || "-"} />,
        },
        {
            Header: "Phone",
            accessor: "contact.phone",
            Cell: ({ row }) => <Cell text={row.original?.contact?.phone || "-"} />,
        },
 
        {
            Header: "Street",
            accessor: "address.street",
            Cell: ({ row }) => <Cell text={row.original?.address?.street || "-"} />,
        },
         {
            Header: "Speciality",
            accessor: "speciality",
            Cell: ({ value }) => <Cell text={value || "-"} />,
        },
 
        {
            Header: "Action",
            Cell: ({ row: { original } }) => (
                <Menu>
                    <MenuButton
                        colorScheme="purple" as={Button}>Actions</MenuButton>
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                setIsEditing(true);
                                setEditingBusiness(original);
                                onOpen();
                            }}
                        >
                            ✏️ Edit
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                setSelectedBusinessID(original._id);
                                openAlert();
                            }}
                        >
                            <MdDelete className="mr-2" /> Delete
                        </MenuItem>
                    </MenuList>
                </Menu>
            ),
        },
    ], [owners, categories]);


    return (
        <div className="py-20 bg-bgWhite">
            <section className="md:p-1">
                <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                    <div className="flex gap-2 items-center">
                        <Button colorScheme="purple">Total Businesses: {data.length}</Button>
                        <Button
                            colorScheme="blue"
                            onClick={() => {
                                setIsEditing(false);
                                setEditingBusiness(null);
                                onOpen();
                            }}
                        >
                            Add New Business
                        </Button>
                    </div>


                    <div className="w-full mt-3 sm:w-auto sm:min-w-[300px]">
                        <InputGroup size="sm">
                            <InputLeftElement pointerEvents="none" />
                            <Input
                                placeholder="Search..."
                                border="1px solid #949494"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <InputRightAddon border="none">
                                <Button className="bg-purple" size="sm">
                                    Search
                                </Button>
                            </InputRightAddon>
                        </InputGroup>
                    </div>


                </div>

                <Table
                
                    data={data.filter((item) => {
                        const ownerName = getOwnerName(item.owner).toLowerCase();
                        const categoryName = getCategoryName(item.category).toLowerCase();
                        return (
                            item.name?.toLowerCase().includes(search.toLowerCase()) ||
                            item.contact?.phone?.toLowerCase().includes(search.toLowerCase()) ||
                            item.contact?.email?.toLowerCase().includes(search.toLowerCase()) ||
                            ownerName.includes(search.toLowerCase()) ||
                            categoryName.includes(search.toLowerCase())
                        );
                    })}
                    columns={columns}
                />

            </section>

            {/* Business Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    setIsEditing(false);
                    setEditingBusiness(null);
                    onClose();
                }}
                size="4xl"
                scrollBehavior="inside"
            >
                <ModalOverlay />
                <ModalContent className="rounded-2xl">
                    <ModalHeader className="text-xl font-bold">
                        {isEditing ? "Edit Business" : "Register New Business"}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <RegisterBusinessForm
                            owners={owners}
                            categories={categories}
                            initialData={editingBusiness}
                            onSubmit={handleFormSubmit}
                            loading={loading}
                        />
                    </ModalBody>
                </ModalContent>
            </Modal>

            {/* Delete Alert Dialog */}
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
