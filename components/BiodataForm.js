import {
  Grid,
  Button,
  Container,
  Text,
  Stack,
  Paper,
  Group,
  Center,
} from "@mantine/core";
import { useState } from "react";
import { CASTES } from "./caste.js";
import ProfileImagesManager from "./ProfileImagesManager";
import SchemaForm from "./SchemaForm";
import MyPdfDocument from "./pdfdoc.js";
import logosrc from "../public/ganesha.png";
import { pdf } from "@react-pdf/renderer";

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
  "Meen (Pisces)",
];

const formSchema = {
  personal: [
    { name: "fullName", label: "Full Name", type: "text", required: 1 },
    { name: "dob", label: "Date of Birth", type: "datetime-local", required: 1 },
    { name: "height", label: "Height", type: "text", required: 1 },
    {
      name: "religion",
      label: "Religion",
      type: "select",
      values: ["Hindu", "Muslim", "Christian", "Sikh", "Jain", "Buddhist", "Other"],
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
    { name: "visa", label: "Visa Status", type: "text" },
    { name: "salary", label: "Salary", type: "text" },
    { name: "location", label: "Location", type: "text", required: 1 },
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
    { name: "number", label: "Number", type: "text", required: 1 },
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

  const handleFormSubmit = async (values) => {
    const doc = (
      <MyPdfDocument
        formSchema={formSchema}
        formData={values}
        images={images}
        logoSrc={logosrc}
      />
    );

    const blob = await pdf(doc).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "profile.pdf";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <Container size="lg" py="md">
      <Stack spacing="md">
        <Paper shadow="xs" p="md" radius="md" withBorder>
          <Text size="lg" fw={600}>
            Secure Offline Biodata Maker
          </Text>
          <Text size="sm" color="dimmed">
            This biodata maker does <strong>not store any data on the cloud</strong>. All data
            is saved only in your browser and cleared locally. Safe and private to use.
          </Text>
        </Paper>

        <Text size="md" fw={600} mt="md">
          Enter your details (Easy convert to PDF)
        </Text>

        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, md: 9 }}>
            <SchemaForm formSchema={formSchema} onSubmit={handleFormSubmit} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 3 }}>
            <ProfileImagesManager images={images} setImages={setImages} />
          </Grid.Col>
        </Grid>

        <Center mt="xl">
          <Group spacing="xs">
            <Text size="sm" color="dimmed">
              For feedback, contact:
            </Text>
            <Text size="sm" fw={600}>
              hruday.iotware@gmail.com
            </Text>
          </Group>
        </Center>
      </Stack>
    </Container>
  );
}
