import { Container, Group, Title, Anchor, rem } from '@mantine/core';

export default function Navbar() {
  return (
    <nav style={{ backgroundColor: '#f8f9fa', borderBottom: '1px solid #dee2e6' }}>
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Group gap="xs">
            <Title order={2} fw={700} c="blue">Biodata Maker</Title>
          </Group>
          <Group gap="lg">
            <Anchor href="#" c="dimmed" fz="sm" fw={500}>About</Anchor>
          </Group>
        </Group>
      </Container>
    </nav>
  );
}
