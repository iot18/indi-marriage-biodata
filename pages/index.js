import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BiodataForm from "../components/BiodataForm";
import { createTheme, MantineProvider } from "@mantine/core";
import { AppShell, rem } from '@mantine/core';
import { useHeadroom } from '@mantine/hooks';
import { useDisclosure } from "@mantine/hooks";


export default function Home() {
  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <MantineProvider defaultColorScheme="dark">
      <AppShell
        header={{ height: 60, collapsed: !pinned, offset: false }}
        padding="md"
      >
        <AppShell.Header>
          <Navbar />
        </AppShell.Header>
        <AppShell.Main pt={`calc(${rem(60)} + var(--mantine-spacing-md))`}>
          <BiodataForm />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
