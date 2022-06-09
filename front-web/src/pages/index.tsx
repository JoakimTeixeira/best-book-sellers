import type { GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { ReactElement } from 'react'
import { Container, Main, Page, Section, Title } from '../styles/home'

export interface IBookWithAuthor {
  id: string
  title: string
  description: string
  author: {
    id: string
    name: string
  }
}

const Home: NextPage<{ books: IBookWithAuthor[] }> = ({
  books,
}): ReactElement => {
  return (
    <Page>
      <Head>
        <title>Homepage</title>
      </Head>

      <Main>
        <Container>
          <Title>Best sellers of all times</Title>
          {books.map((book) => (
            <Section key={book.id}>
              <h2>{book.title}</h2>
              <h3>{book.author.name}</h3>
              <p>{book.description}</p>
            </Section>
          ))}
        </Container>
      </Main>
    </Page>
  )
}

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const response = await fetch(
    'https://best-book-sellers-api.herokuapp.com/book'
  )
  const books = await response.json()

  return {
    props: {
      books,
    },
    revalidate: 10,
  }
}
