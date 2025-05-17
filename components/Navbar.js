import { useEffect, useState } from "react";
import {
  Container,
  Group,
  Title,
  ActionIcon,
} from "@mantine/core";
import { useMantineColorScheme } from "@mantine/core";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Skip rendering on server

  return (
    <nav>
      <Container size="lg" py="md">
        <Group justify="space-between" align="center">
          <Title order={2} fw={700} c="blue">
            Indian Biodata Maker
          </Title>

          <Group>
            <ActionIcon
              variant="default"
              onClick={toggleColorScheme}
              size="lg"
              title="Toggle color scheme"
            >
              {colorScheme === "dark" ? (
                <IconSun size={20} />
              ) : (
                <IconMoon size={20} />
              )}
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </nav>
  );
}
