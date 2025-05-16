import { Container, Group, Title, Anchor, rem } from '@mantine/core';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Title order={2} fw={700} c="blue">Indian Biodata Maker</Title>
          </Group>
        </Group>
      </Container>
    </nav>
  );
}
