import {
  Grid,
  Button,
  Container,
  Text,
  Stack,
  Paper,
  Group,
  Center,
  Title,
  Box,
  Divider,
} from "@mantine/core";
import { useState } from "react";
import ProfileImagesManager from "./ProfileImagesManager";
import SchemaForm from "./SchemaForm";
import MyPdfDocument from "./pdfdoc.js";
import logosrc from "../public/ganesha.png";
import { pdf } from "@react-pdf/renderer";
import image from "../public/sample_profile_pdf.jpg";
import Image from "next/image";
import { formSchema } from "./form_helper";

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
    <Container size="lg" py="xl">
      <Stack spacing="xl">
        {/* Hero Section */}
        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Grid align="center">
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={2}>Create Your Biodata Easily & Privately</Title>
              <Text mt="sm" size="md" color="dimmed">
                This biodata maker does <strong>not store any data on the cloud</strong>.
                All data is saved only in your browser and is <strong>cleared locally</strong>.
                It's safe, private, and offline. Convert to PDF with just a few clicks.
              </Text>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box sx={{ maxWidth: 400, margin: "0 auto" }}>
                <Image
                  src={image}
                  alt="Sample PDF profile"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: "8px",
                    border: "1px solid #eee",
                  }}
                  placeholder="blur"
                />
                <Text size="xs" color="dimmed" ta="center" mt="xs">
                  Example preview of the final PDF
                </Text>
              </Box>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Scroll Hint */}
        <Center>
          <Text size="sm" color="gray">
            ↓ Start entering your information below
          </Text>
        </Center>

        {/* Form Section */}
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

        <Divider mt="xl" />

        {/* Footer */}
        <Center>
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
