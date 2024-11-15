import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import styled from "styled-components";

const Container = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100dvh;
`;

const Main = styled.main`
  background-color: var(--color-grey-200);
  padding: 4rem 4rem 6rem;
  overflow: scroll;
`;

const StyledContainer = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

export default function AppLayout() {
  return (
    <Container>
      <Header />
      <Sidebar />
      <Main>
        <StyledContainer>
          <Outlet />
        </StyledContainer>
      </Main>
    </Container>
  );
}
