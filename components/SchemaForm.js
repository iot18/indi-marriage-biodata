import { useEffect } from "react";
import {
  TextInput,
  Textarea,
  Select,
  Button,
  Card,
  Title,
  SimpleGrid,
  Box,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// Utility keys for storage
const STORAGE_KEY = "profile_form_data";

export default function SchemaForm({ formSchema, onSubmit }) {
  // Compute initial values from schema
  const initialValues = Object.fromEntries(
    Object.entries(formSchema).map(([section, fields]) => [
      section,
      Object.fromEntries(fields.map((f) => [f.name, ""])),
    ])
  );

  // Load from localStorage if present
  const stored =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const parsedStored = stored ? JSON.parse(stored) : null;

  const form = useForm({
    initialValues: parsedStored || initialValues,
  });

  // Save to localStorage on value change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.values));
  }, [form.values]);

  // Clear function
  const handleClear = () => {
    form.setValues(initialValues); // Reset form
    localStorage.removeItem(STORAGE_KEY);
    // Optionally force reload for full reset:
    // window.location.reload();
  };

  const renderSection = (sectionName, sectionFields) => (
    <Card
      key={sectionName}
      shadow="sm"
      padding="lg"
      style={{ marginBottom: "20px" }}
    >
      <Title order={3}>
        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
      </Title>
      <SimpleGrid cols={2} spacing="lg" mt="md">
        {sectionFields.map((field) => (
          <Box key={field.name}>
            {field.type === "textarea" ? (
              <Textarea
                label={field.label}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
                required={true ? field?.required : false}
              />
            ) : field.type === "select" && Array.isArray(field.values) ? (
              <Select
                label={field.label}
                data={field.values}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
                required={true ? field?.required : false}
                limit={20}
                searchable
              />
            ) : (
              <TextInput
                label={field.label}
                type={field.type}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
                required={true ? field?.required : false}
              />
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Card>
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      {Object.keys(formSchema).map((section) =>
        renderSection(section, formSchema[section])
      )}
      <Group mt="lg" position="apart">
        <Button
          color="red"
          variant="outline"
          onClick={handleClear}
          type="button"
        >
          Clear locally
        </Button>
        <Button type="submit" color="blue">
          Submit
        </Button>
      </Group>
    </form>
  );
}
