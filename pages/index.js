import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BiodataForm from "../components/BiodataForm";
import { createTheme, MantineProvider } from "@mantine/core";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

const theme = createTheme({
  /** Put your mantine theme override here */
});

export default function Home() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <MantineProvider theme={theme}>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Navbar />
        </AppShell.Header>


        <AppShell.Main>
          <BiodataForm />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
