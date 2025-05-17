import {
    Modal,
    TextInput,
    Stack,
    ColorInput,
    Switch,
    Text,
    Divider,
    Button,
  } from "@mantine/core";
  
  export default function AdvancedSettingsModal({ opened, onClose, settings, setSettings }) {
    return (
      <Modal opened={opened} onClose={onClose} title="Advanced PDF Settings" size="md">
        <Stack>
          <ColorInput
            label="Primary Color"
            value={settings.primaryColor}
            onChange={(value) => setSettings((prev) => ({ ...prev, primaryColor: value }))}
          />
  
          <Divider my="sm" />
  
          <Switch
            label="Use Custom Template Design (Coming Soon)"
            checked={false}
            disabled
          />
          <Text size="xs" color="dimmed">
            This option is not available yet. Stay tuned for future updates.
          </Text>
  
          <Button variant="light" color="blue" onClick={onClose}>
            Close
          </Button>
        </Stack>
      </Modal>
    );
  }
  