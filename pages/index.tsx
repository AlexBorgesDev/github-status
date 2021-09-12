import type { NextPage } from 'next'

import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import getStatusService, {
  IGetStatusElements,
} from '../services/getStatusService'

type StatusElementProps = { content: string; error?: 'warning' | 'error' }

const Home: NextPage<{ data: IGetStatusElements }> = ({ data }) => {
  const getStatusState = () => {
    const operational = data.filter(
      ({ status }) => status === 'Operational'
    ).length

    if (operational === data.length) return 'allOperational'

    if (operational === 0) return 'noneOperational'

    return 'notAllOperational'
  }

  const statusElement = ({ content, error }: StatusElementProps) => {
    return (
      <div className={styles.status} data-error={error}>
        <p>{content}</p>
      </div>
    )
  }

  const faviconFolder = () => {
    if (data.length === 0) return 'error'

    const statusState = getStatusState()

    if (statusState === 'allOperational') return 'check'
    else return 'warning'
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Status</title>
        <meta name="description" content="See the status of GitHub services" />
        <meta
          name="theme-color"
          content={
            data.length === 0
              ? '#bf1a2f'
              : getStatusState() !== 'allOperational'
              ? '#dbab09'
              : '#28a745'
          }
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`/${faviconFolder()}/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`/${faviconFolder()}/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`/${faviconFolder()}/favicon-16x16.png`}
        />
        <link rel="icon" href={`/${faviconFolder()}/favicon.ico`} />
      </Head>

      <main className={styles.main}>
        <h1
          className={styles.title}
          data-error={
            data.length === 0 ? 'error' : getStatusState() !== 'allOperational'
          }
        >
          Welcome to <Link href="/">GitHub Status</Link>
        </h1>

        <p className={styles.description}>
          See the current status of GitHub services
        </p>

        {(() => {
          if (data.length === 0)
            return statusElement({
              error: 'error',
              content:
                'Something went wrong getting the status of GitHub services',
            })

          const statusState = getStatusState()

          if (statusState === 'allOperational')
            return statusElement({ content: 'All services are operational' })

          if (statusState === 'noneOperational')
            return statusElement({
              content: 'No services are operational',
              error: 'warning',
            })

          return statusElement({
            content: 'Not all services are operational',
            error: 'warning',
          })
        })()}

        <div className={styles.grid}>
          {data.map(({ name, status }) => (
            <div
              key={name}
              data-error={status !== 'Operational'}
              className={styles.card}
            >
              <h2>{name}</h2>

              <p>{status}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://github.com/AlexBorgesDev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by Alex Borges Ramos
        </a>
      </footer>
    </div>
  )
}

export async function getServerSideProps() {
  try {
    const elements = await getStatusService()

    return {
      props: { data: elements },
    }
  } catch (err) {
    return { props: { data: [] } }
  }
}

export default Home
