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
  Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";

// Utility keys for storage
const STORAGE_KEY = "profile_form_data";

export default function SchemaForm({ formSchema, onSubmit }) {
  const initialValues = Object.fromEntries(
    Object.entries(formSchema).map(([section, fields]) => [
      section,
      Object.fromEntries(fields.map((f) => [f.name, ""])),
    ])
  );

  const stored =
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
  const parsedStored = stored ? JSON.parse(stored) : null;

  const form = useForm({
    initialValues: parsedStored || initialValues,
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form.values));
  }, [form.values]);

  const handleClear = () => {
    form.setValues(initialValues);
    localStorage.removeItem(STORAGE_KEY);
  };

  const renderSection = (sectionName, sectionFields) => (
    <Card
      key={sectionName}
      shadow="xs"
      padding="md"
      radius="md"
      style={{ marginBottom: "16px" }}
    >
      <Title order={4} mb="sm">
        {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
      </Title>
      <SimpleGrid
        cols={{ base: 1, sm: 2 }}
        spacing="sm"
        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
      >
        {sectionFields.map((field) => (
          <Box key={field.name}>
            {field.type === "textarea" ? (
              <Textarea
                size="sm"
                label={field.label}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
              />
            ) : field.type === "select" && Array.isArray(field.values) ? (
              <Select
                size="sm"
                label={field.label}
                data={field.values}
                searchable
                limit={20}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
              />
            ) : (
              <TextInput
                size="sm"
                label={field.label}
                type={field.type}
                {...form.getInputProps(`${sectionName}.${field.name}`)}
              />
            )}
          </Box>
        ))}
      </SimpleGrid>
    </Card>
  );

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack spacing="sm">
        {Object.keys(formSchema).map((section) =>
          renderSection(section, formSchema[section])
        )}
        <Group position="apart" grow>
          <Button variant="outline" color="red" onClick={handleClear}>
            Clear
          </Button>
          <Button type="submit" color="blue">
            Download PDF
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
