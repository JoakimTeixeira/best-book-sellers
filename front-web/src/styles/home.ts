import styled from 'styled-components'

const Page = styled.div`
  padding: 30px;
`

const Main = styled.main`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  max-width: 1000px;
`

const Title = styled.h1`
  text-align: center;
`

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px;
  padding: 40px 20px;
  border: 1px solid ${(props) => props.theme.colors.text};
`

export { Page, Main, Container, Title, Section }
