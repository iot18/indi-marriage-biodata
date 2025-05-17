import { CASTES } from "./caste.js";

export const uniqueCapitalizedCastes = [
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

export const dietaryPreferences = [
  "Vegetarian",
  "Vegan",
  "Eggetarian",
  "Non-vegetarian",
  "Jain",
];

export const rashis = [
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
  "Meen (Pisces)",
];

export const FORM_SCHEMA_BASE = {
  personal: [
    { name: "fullName", label: "Full Name", type: "text", required: 1 },
    {
      name: "dob",
      label: "Date of Birth",
      type: "datetime-local",
      required: 1,
    },
    { name: "height", label: "Height", type: "text", required: 1 },
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
    { name: "education", label: "Education", type: "text", required: 1 },
    { name: "occupation", label: "Occupation", type: "text", required: 1 },
    { name: "company", label: "Company", type: "text", required: 1 },
    {
      name: "jobtype",
      label: "Job Type",
      type: "select",
      values: ["Full Time", "Part time", "Contract", "Internship"],
    },
    { name: "visa", label: "Visa Status", type: "text" },
    { name: "salary", label: "Salary", type: "text" },
    { name: "location", label: "Location", type: "text", required: 1 },
    { name: "complexion", label: "Complexion", type: "text" },
    { name: "matrimonyNumber", label: "Matrimony ID Number", type: "text" },
    { name: "hobbies", label: "Hobbies", type: "text" },
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
    { name: "number", label: "Number", type: "text", required: 1 },
    { name: "email", label: "Email", type: "text" },
    { name: "address", label: "Address", type: "text" },
  ],
};
