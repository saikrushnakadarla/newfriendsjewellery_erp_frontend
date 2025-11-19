import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import InputField from "../../../Pages/InputField/InputField";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import baseURL from "../../../../Url/NodeBaseURL"; // Ensure this is correctly set

function SubCategory() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { subcategory_id, metal_type } = state || {}; // Destructure state to get subcategory_id and location

  const [formData, setFormData] = useState({
    category_id: "",
    metal_type_id: "",
    metal_type: metal_type || "", // Initialize with passed metal_type if available
    category: "",
    sub_category_name: "",
    pricing: "By Weight",
    prefix: "",
    purity: "",
    selling_purity: "",
    printing_purity: "",
  });

  const [metalOptions, setMetalOptions] = useState([]);
  const [allCategoryOptions, setAllCategoryOptions] = useState([]);
  const [filteredCategoryOptions, setFilteredCategoryOptions] = useState([]);

  // Modify the useEffect that fetches metal types to preserve the passed metal_type
  useEffect(() => {
    const fetchMetalTypes = async () => {
      try {
        const response = await axios.get(`${baseURL}/metaltype`);
        const metalTypes = response.data.map((item) => ({
          value: item.metal_name,
          label: item.metal_name,
          id: item.metal_type_id,
        }));

        console.log("Fetched Metal Types:", metalTypes);

        setMetalOptions(metalTypes);

        // If metal_type was passed in state, find and set its ID
        if (metal_type && !subcategory_id) {
          const selectedMetal = metalTypes.find(
            (option) => option.value.toLowerCase() === metal_type.toLowerCase()
          );

          if (selectedMetal) {
            setFormData(prev => ({
              ...prev,
              metal_type: selectedMetal.value,
              metal_type_id: selectedMetal.id
            }));
          }
        }
      } catch (error) {
        console.error("Error fetching metal types:", error);
      }
    };
    fetchMetalTypes();
  }, [metal_type, subcategory_id]);


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${baseURL}/get/products`);
        const categories = response.data.map((item) => ({
          value: item.product_name,
          label: item.product_name,
          id: item.product_id,
          metal_type: item.Category,
        }));
        setAllCategoryOptions(categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Filter categories based on selected metal type
  useEffect(() => {
    const filteredCategories = allCategoryOptions.filter(
      (category) => category.metal_type === formData.metal_type
    );
    setFilteredCategoryOptions(filteredCategories);
    setFormData((prevData) => ({
      ...prevData,
      category: "",
      category_id: "",
    }));
  }, [formData.metal_type, allCategoryOptions]);

  // Fetch subcategory data when subcategory_id is provided
  useEffect(() => {
    if (subcategory_id) {
      const fetchSubcategoryData = async () => {
        try {
          const response = await axios.get(`${baseURL}/subcategory/${subcategory_id}`);
          const subcategoryData = response.data;

          setFormData((prevData) => ({
            ...prevData,
            ...subcategoryData,
            category: subcategoryData.category?.toUpperCase() || "",
            category_id: subcategoryData.category_id || "",
          }));
        } catch (error) {
          console.error("Error fetching subcategory:", error);
        }
      };
      fetchSubcategoryData();
    }
  }, [subcategory_id]);
  const handleChange = (e) => {
    const { name, value } = e.target;

    let modifiedValue = value;
    if (name === "sub_category_name" || name === "prefix") {
      modifiedValue = value.toUpperCase();
    }

    if (name === "metal_type") {
      // Log the selected value to check
      console.log("Selected Metal Type:", modifiedValue);

      const selectedMetal = metalOptions.find(
        (option) => option.value.toLowerCase() === modifiedValue.toLowerCase()
      );

      // Log the selected metal to ensure it's found
      console.log("Selected Metal:", selectedMetal);

      setFormData((prevData) => ({
        ...prevData,
        metal_type: selectedMetal?.value || "",
        metal_type_id: selectedMetal?.id || "",
        category: "",
        category_id: "",
      }));
    } else if (name === "category") {
      const selectedCategory = filteredCategoryOptions.find((option) => option.value === modifiedValue);
      setFormData((prevData) => ({
        ...prevData,
        category: selectedCategory?.value || "",
        category_id: selectedCategory?.id || "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: modifiedValue,
      }));
    }
  };


  // Submit form data
  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Log formData before submitting to check its structure
  //   console.log("Form Data being submitted:", formData);
  //   console.log("metal_type_id:", formData.metal_type_id);

  //   try {
  //     if (subcategory_id) {
  //       await axios.put(`${baseURL}/subcategory/${subcategory_id}`, formData);
  //       alert("Subcategory updated successfully!");
  //     } else {
  //       await axios.post(`${baseURL}/subcategory`, formData);
  //       alert("Subcategory created successfully!");
  //     }
  //     // navigate("/subcategorytable");
  //     // const from = location.state?.from || "/subcategorytable";

  //     // navigate(-1);
  //     // navigate("/sales", { state: { newSubCategory: formData.sub_category_name } });
  //     const from = location.state?.from || "/subcategorytable";
  //     navigate(from, {
  //       state: { newSubCategory: formData.sub_category_name }
  //     });

  //   } catch (error) {
  //     console.error("Error saving subcategory:", error.message);
  //     alert("Failed to save subcategory. Please try again.");
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields based on pricing
    if (formData.pricing === "By Weight" && !formData.selling_purity) {
      alert("Selling Purity is required when pricing is By Weight");
      return;
    }

    // Log formData before submitting to check its structure
    console.log("Form Data being submitted:", formData);
    console.log("metal_type_id:", formData.metal_type_id);

    try {
      if (subcategory_id) {
        await axios.put(`${baseURL}/subcategory/${subcategory_id}`, formData);
        alert("Subcategory updated successfully!");
      } else {
        await axios.post(`${baseURL}/subcategory`, formData);
        alert("Subcategory created successfully!");
      }
      const from = location.state?.from || "/subcategorytable";
      navigate(from, {
        state: { newSubCategory: formData.sub_category_name }
      });

    } catch (error) {
      console.error("Error saving subcategory:", error.message);
      alert("Failed to save subcategory. Please try again.");
    }
  };
  const location = useLocation();
  const handleBack = () => {
    // navigate("/subcategorytable");
    // const from = location.state?.from || "/subcategorytable";
    navigate(-1);
  };

  return (
    <div className="main-container">
      <div className="customer-master-container">
        <h2>{subcategory_id ? "Edit Sub Category" : "Add Sub Category"}</h2>
        <form className="customer-master-form" onSubmit={handleSubmit}>
          <Row>
            <Col md={3}>
              <InputField
                label="Metal Type"
                name="metal_type"
                type="select"
                value={formData.metal_type}
                onChange={handleChange}
                options={metalOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                required
                autoFocus
              />
            </Col>
            <Col md={3}>
              <InputField
                label="Category"
                name="category"
                type="select"
                value={formData.category}
                onChange={handleChange}
                options={filteredCategoryOptions.map((option) => ({
                  value: option.value,
                  label: option.label,
                }))}
                required
              />
            </Col>

            <Col md={3}>
              <InputField
                label="Sub Category"
                name="sub_category_name"
                value={formData.sub_category_name}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={3}>
              <InputField
                label="Pricing"
                name="pricing"
                type="select"
                value={formData.pricing} // No need for fallback value
                onChange={handleChange}
                options={[
                  { value: "By Weight", label: "By Weight" },
                  { value: "By fixed", label: "By fixed" },
                  ...(formData.pricing &&
                    !["By Weight", "By fixed"].includes(formData.pricing)
                    ? [{ value: formData.pricing, label: formData.pricing }]
                    : []),
                ]}
              />
            </Col>
            <Col md={3}>
              <InputField
                label="Prefix"
                name="prefix"
                value={formData.prefix}
                onChange={handleChange}
                required
              />
            </Col>

            <Col md={3}>
              <InputField
                label="Purchase Purity"
                name="purity"
                value={formData.purity}
                onChange={handleChange}
                required
              />
            </Col>
            <Col md={3}>
              <InputField
                label="Selling Purity"
                name="selling_purity"
                value={formData.selling_purity}
                onChange={handleChange}
                required={formData.pricing === "By Weight"} // Only required when pricing is "By Weight"
              />
            </Col>
            <Col md={3}>
              <InputField
                label="Printing Purity"
                name="printing_purity"
                value={formData.printing_purity}
                onChange={handleChange}
                required
              />
            </Col>
          </Row>
          <div className="sup-button-container">
            <button type="button" className="cus-back-btn" onClick={handleBack}>
              Close
            </button>
            <button type="submit" className="cus-submit-btn">
              {subcategory_id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SubCategory;
