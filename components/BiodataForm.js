// pages/index.js

// import DynamicForm from "../components/DynamicForm";
import { Grid } from "@mantine/core";
import { useState } from "react";
import { CASTES } from "./caste.js";
import ProfileImagesManager from "./ProfileImagesManager";
import SchemaForm from "./SchemaForm";
import { PDFDownloadLink } from "@react-pdf/renderer";
import MyPdfDocument from "./pdfdoc.js";
import logosrc from "../public/ganesha.png";
const uniqueCapitalizedCastes = [
  ...new Set(
    CASTES.map((caste) =>
      caste
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
    )
  ),
];

const dietaryPreferences = [
  "Vegetarian",

  "Vegan",

  "Eggetarian",

  "Non-vegetarian",

  "Jain",
];

const rashis = [
  "Mesh (Aries)",
  "Vrishabh (Taurus)",
  "Mithun (Gemini)",
  "Karka (Cancer)",
  "Simha (Leo)",
  "Kanya (Virgo)",
  "Tula (Libra)",
  "Vrishchik (Scorpio)",
  "Dhanu (Sagittarius)",
  "Makar (Capricorn)",
  "Kumbh (Aquarius)",
  "Meen (Pisces)]",
];
const formSchema = {
  personal: [
    { name: "fullName", label: "Full Name", type: "text" },
    { name: "dob", label: "Date of Birth", type: "datetime-local" },
    { name: "height", label: "Height", type: "text" },
    {
      name: "religion",
      label: "Religion",
      type: "select",
      values: [
        "Hindu",
        "Muslim",
        "Christian",
        "Sikh",
        "Jain",
        "Buddhist",
        "Other",
      ],
    },
    {
      name: "caste",
      label: "Caste",
      type: "select",
      values: uniqueCapitalizedCastes,
    },
    {
      name: "dietaryPreference",
      label: "Dietary Preference",
      type: "select",
      values: dietaryPreferences,
    },
    { name: "education", label: "Education", type: "text" },
    { name: "occupation", label: "Occupation", type: "text" },
    { name: "visa", label: "Visa Status", type: "text" },
    { name: "salary", label: "Salary", type: "text" },
    { name: "location", label: "Location", type: "text" },
    { name: "complexion", label: "Complexion", type: "text" },

    { name: "matrimonyNumber", label: "Matrimony ID Number", type: "text" },
  ],
  family: [
    { name: "fatherName", label: "Father's Name", type: "text" },
    { name: "fatherOccupation", label: "Father's Occupation", type: "text" },
    { name: "motherName", label: "Mother's Name", type: "text" },
    { name: "motherOccupation", label: "Mother's Occupation", type: "text" },
    { name: "siblings", label: "Siblings", type: "text" },
  ],
  astrology: [
    { name: "raasi", label: "Raasi", type: "select", values: rashis },
    { name: "star", label: "Star", type: "text" },
    { name: "gotra", label: "Gotra", type: "text" },
    { name: "mgotra", label: "Maternal Gotra", type: "text" },
  ],
  contact: [
    { name: "number", label: "Number", type: "text" },
    { name: "email", label: "Email", type: "text" },
    { name: "address", label: "Address", type: "text" },
  ],
};

export default function HomePage() {
  const [images, setImages] = useState({
    profile1: null,
    profile2: null,
    profile3: null,
    family: null,
    nakshatra: null,
  });

  const [pdfData, setPdfData] = useState(null);
  const handleFormSubmit = (values) => {
    // Combine form values and images as needed
    console.log("Form Data:", values, "Images:", images);
    setPdfData({ formSchema, formData: values, images }); // Save in state for
  };
  return (
    <>
      <h4>Enter your details (Easy convert to PDF , JPEG)</h4>
      <Grid gutter="xl">
        <Grid.Col span={9}>
          <SchemaForm formSchema={formSchema} onSubmit={handleFormSubmit} />
        </Grid.Col>
        <Grid.Col span={3}>
          <ProfileImagesManager images={images} setImages={setImages} />
        </Grid.Col>
      </Grid>
      {pdfData && (
        <PDFDownloadLink
          document={
            <MyPdfDocument
              formSchema={pdfData.formSchema}
              formData={pdfData.formData}
              images={pdfData.images}
              logoSrc={logosrc}
            />
          }
          fileName="profile.pdf"
        >
          {({ loading }) =>
            loading ? "Preparing document..." : "Download PDF"
          }
        </PDFDownloadLink>
      )}
    </>
  );
}
