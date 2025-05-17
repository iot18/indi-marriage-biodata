import { useEffect, useState } from "react";
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
  Modal,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";

const STORAGE_KEY = "profile_form_data";

export default function SchemaForm({ formSchema, setFormSchema, onSubmit }) {
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
    setAddedFieldsCount({});
  };

  const [opened, { open, close }] = useDisclosure(false);
  const newFieldForm = useForm({
    initialValues: { label: "", type: "text", values: "" },
  });
  const [currentSection, setCurrentSection] = useState(null);
  const [addedFieldsCount, setAddedFieldsCount] = useState({});

  const handleAddField = (sectionName) => {
    setCurrentSection(sectionName);
    newFieldForm.reset();
    open();
  };

  const handleNewFieldSubmit = (values) => {
    if (!values.label) return;

    const label = values.label.trim();
    const name = label.toLowerCase().replace(/\s+/g, "");

    const newField = {
      name,
      label,
      type: values.type || "text",
      ...(values.type === "select"
        ? { values: values.values.split(",").map((v) => v.trim()) }
        : {}),
    };

    const updatedSection = [...formSchema[currentSection], newField];
    const updatedSchema = {
      ...formSchema,
      [currentSection]: updatedSection,
    };
    setFormSchema(updatedSchema);

    form.setFieldValue(`${currentSection}.${name}`, "");

    setAddedFieldsCount((prev) => ({
      ...prev,
      [currentSection]: (prev[currentSection] || 0) + 1,
    }));

    close();
  };

  const renderSection = (sectionName, sectionFields) => {
    const addedCount = addedFieldsCount[sectionName] || 0;
    const isLimitReached = addedCount >= 2;

    return (
      <Card
        key={sectionName}
        shadow="xs"
        padding="md"
        radius="md"
        style={{ marginBottom: "16px" }}
      >
        <Stack spacing="xs">
          <Group position="apart">
            <Title order={4}>
              {sectionName.charAt(0).toUpperCase() + sectionName.slice(1)}
            </Title>
          </Group>

          {isLimitReached && (
            <Box style={{ color: "#1c7ed6", fontSize: 14 }}>
              You can only add 2 fields to this section.
            </Box>
          )}

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

          <Button
            size="xs"
            mt="sm"
            onClick={() => handleAddField(sectionName)}
            disabled={isLimitReached}
          >
            + Add Field
          </Button>
        </Stack>
      </Card>
    );
  };

  return (
    <>
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

      <Modal
        opened={opened}
        onClose={close}
        title={`Add Field to "${currentSection}"`}
        centered
      >
        <form onSubmit={newFieldForm.onSubmit(handleNewFieldSubmit)}>
          <Stack>
            <TextInput
              label="Field Label"
              required
              {...newFieldForm.getInputProps("label")}
            />
            <Select
              label="Type"
              data={["text", "number", "email", "textarea", "select"]}
              defaultValue="text"
              {...newFieldForm.getInputProps("type")}
            />
            {newFieldForm.values.type === "select" && (
              <TextInput
                label="Options (comma-separated)"
                {...newFieldForm.getInputProps("values")}
              />
            )}
            <Button type="submit" color="green">
              Add Field
            </Button>
          </Stack>
        </form>
      </Modal>
    </>
  );
}
