import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "../../axios";
import Table from "../../componant/Table/Table";
import Cell from "../../componant/Table/cell";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
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
  Select,
} from "@chakra-ui/react";

import { MdEdit, MdDelete } from "react-icons/md";

const Plans= () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", type: "monthly", features: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedPlanId, setSelectedPlanId] = useState(null);

  const toast = useToast();
  const btnRef = useRef();
  const cancelRef = useRef();

  const { isOpen: isDrawerOpen, onOpen: openDrawer, onClose: closeDrawer } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: openDelete, onClose: closeDelete } = useDisclosure();

  const fetchPlans = async () => {
    try {
      const res = await axios.get("/plan/GetAllPlans");
      console.log("Plans API response:", res.data);
      setPlans(Array.isArray(res.data) ? res.data : res.data.result || []);
    } catch (err) {
      console.error("Error fetching plans", err);
    }
  };
  

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      title: form.title.trim(),
      price: Number(form.price),
      features: form.features.split(',').map(f => f.trim())
    };
  
    try {
      if (editingId) {
        await axios.put(`/api/plan/UpdatePlan/${editingId}`, payload);
        alert("Plan updated successfully");
      } else {
        await axios.post("/plan/CreatePlan", payload); // ✅ Corrected path
        alert("Plan created successfully");
      }
      setForm({ title: "", price: "", type: "monthly", features: "" });
      setEditingId(null);
      closeDrawer(); // ✅ close drawer after create
      fetchPlans();
    } catch (err) {
      console.error("Create Plan Error: ", err.response?.data || err.message);
      alert("Something went wrong while saving the plan.");
    }
  };
  ;
  

  const handleEdit = (plan) => {
    setForm({
      title: plan.title,
      price: plan.price,
      type: plan.type,
      features: plan.features.join(', ')
    });
    setEditingId(plan._id);
    openDrawer();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/plan/DeletePlan/${selectedPlanId}`);
      toast({ title: "Plan deleted.", status: "success", duration: 3000 });
      fetchPlans();
      closeDelete();
    } catch (err) {
      toast({ title: "Delete failed.", status: "error", duration: 3000 });
    }
  };

  const columns = useMemo(() => [
    {
      Header: "Sr No.",
      accessor: "srNo",
      Cell: ({ row: { index } }) => <Cell text={index + 1} />,
    },
    {
      Header: "Title",
      accessor: "name",
      Cell: ({ value }) => <Cell text={value} bold="bold" />,
    },
    {
      Header: "Price",
      accessor: "price",
      Cell: ({ value }) => <Cell text={`₹${value}`} />,
    },
    {
      Header: "Type",
      accessor: "type",
      Cell: ({ value }) => <Cell text={value === "monthly" ? "Monthly" : "Yearly"} />,
    },
    {
      Header: "Features",
      accessor: "features",
      Cell: ({ value }) => <Cell text={value?.join(', ')} />,
    },
    {
      Header: "Action",
      Cell: ({ row: { original } }) => (
        <Menu>
          <MenuButton as={Button} colorScheme="purple">
            Actions
          </MenuButton>
          <MenuList>
            <MenuItem onClick={() => handleEdit(original)}>
              <MdEdit className="mr-4" /> Edit
            </MenuItem>
            <MenuItem onClick={() => {
              setSelectedPlanId(original._id);
              openDelete();
            }}>
              <MdDelete className="mr-4" /> Delete
            </MenuItem>
          </MenuList>
        </Menu>
      )
    },
  ], []);

  const filteredPlans = Array.isArray(plans)
  ? plans.filter((plan) =>
      (plan.title || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  return (
    <div className="py-20 bg-bgWhite">
      <section className="md:p-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button ref={btnRef} colorScheme="purple" onClick={openDrawer}>Add New Plan</Button>
          </div>
          <div className="w-96">
            <InputGroup size="sm">
              <InputLeftElement pointerEvents="none" />
              <Input
                placeholder="Search by title..."
                border="1px solid #949494"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputRightAddon border="none">
                <Button className="bg-emerald-400" size="sm">Search</Button>
              </InputRightAddon>
            </InputGroup>
          </div>
        </div>

        <Table data={filteredPlans} columns={columns} />
      </section>

      {/* Drawer for Add/Edit Plan */}
      <Drawer isOpen={isDrawerOpen} placement="right" onClose={closeDrawer} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{editingId ? "Edit Plan" : "Create Plan"}</DrawerHeader>
          <DrawerBody>
            <Input
              placeholder="Title"
              name="title"
              value={form.name}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mb-4"
            />
            <Input
              placeholder="Price"
              name="price"
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mb-4"
            />
            <Select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="mb-4"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </Select>
            <Input
              placeholder="Features (comma separated)"
              name="features"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />
          </DrawerBody>
          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={closeDrawer}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {editingId ? "Update" : "Create"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation */}
      <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={closeDelete}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Plan
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to delete this plan?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDelete}>Cancel</Button>
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

export default Plans;
