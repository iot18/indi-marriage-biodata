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
  Drawer,
} from "@mantine/core";
import { useState } from "react";
import ProfileImagesManager from "./ProfileImagesManager";
import SchemaForm from "./SchemaForm";
import MyPdfDocument from "./pdfdoc";
import logosrc from "../public/ganesha.png";
import { pdf } from "@react-pdf/renderer";
import image from "../public/sample_profile_pdf.jpg";
import Image from "next/image";
import { FORM_SCHEMA_BASE as initialFormSchema } from "./form_helper";
import AdvancedSettingsModal from "./AdvancedSettingsModal";
import { IconSettings, IconPhoto } from "@tabler/icons-react";

export default function HomePage() {
  const [settings, setSettings] = useState({
    primaryColor: "#0747A6",
  });

  const [advancedModalOpen, setAdvancedModalOpen] = useState(false);
  const [mobileAsideOpen, setMobileAsideOpen] = useState(false);

  const [images, setImages] = useState({
    profile1: null,
    profile2: null,
    profile3: null,
    family: null,
    nakshatra: null,
  });

  const [formSchema, setFormSchema] = useState(initialFormSchema);

  const handleFormSubmit = async (values) => {
    const doc = (
      <MyPdfDocument
        formSchema={formSchema}
        formData={values}
        images={images}
        logoSrc={logosrc}
        settings={settings}
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
                <strong style={{ color: "#2b8a3e" }}>
                  100% Free, Private & Offline.
                </strong>
                <br />
                This biodata maker{" "}
                <strong style={{ color: "#e03131" }}>
                  does not store, upload, or publish your data
                </strong>{" "}
                in any form—no cloud, no servers.
                <br />
                All data stays <strong>only in your browser</strong> and is{" "}
                <strong>cleared automatically</strong> once closed.
                <br />
                You are always in full control. Just fill your details and
                <strong style={{ color: "#1971c2" }}>
                  {" "}
                  generate your biodata PDF securely
                </strong>{" "}
                in seconds.
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
          {/* Form and controls */}
          <Grid.Col span={{ base: 12, md: 9 }}>
            <Stack spacing="sm">
              <Group justify="center">
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<IconSettings size={16} />}
                  onClick={() => setAdvancedModalOpen(true)}
                >
                  Advanced Settings
                </Button>

                <Button
                  variant="outline"
                  color="blue"
                  leftSection={<IconPhoto size={16} />}
                  hiddenFrom="md" // ✅ show only on mobile
                  onClick={() => setMobileAsideOpen(true)}
                >
                  Manage Images
                </Button>
              </Group>

              <SchemaForm
                formSchema={formSchema}
                setFormSchema={setFormSchema}
                onSubmit={handleFormSubmit}
              />
            </Stack>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 3 }} visibleFrom="md">
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

      {/* Advanced Settings Modal */}
      <AdvancedSettingsModal
        opened={advancedModalOpen}
        onClose={() => setAdvancedModalOpen(false)}
        settings={settings}
        setSettings={setSettings}
      />

      {/* Mobile Drawer for Profile Image Manager */}
      <Drawer
        opened={mobileAsideOpen}
        onClose={() => setMobileAsideOpen(false)}
        title="Manage Profile Images"
        padding="md"
        size="md"
        position="right"
        hiddenFrom="md"
      >
        <ProfileImagesManager images={images} setImages={setImages} />
      </Drawer>
    </Container>
  );
}
