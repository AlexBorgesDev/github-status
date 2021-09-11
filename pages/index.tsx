import type { NextPage } from 'next'

import Head from 'next/head'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

import getStatusService, {
  IGetStatusElements,
} from '../services/getStatusService'

const Home: NextPage<{ data: IGetStatusElements }> = ({ data }) => {
  const getStatusState = () => {
    const operational = data.filter(
      ({ status }) => status === 'Operational'
    ).length

    if (operational === data.length) return 'allOperational'

    if (operational === 0) return 'noneOperational'

    return 'notAllOperational'
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>GitHub Status</title>
        <meta name="description" content="See the status of GitHub services" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1
          className={styles.title}
          data-error={getStatusState() !== 'allOperational'}
        >
          Welcome to <Link href="/">GitHub Status</Link>
        </h1>

        <p className={styles.description}>
          See the current status of GitHub services
        </p>

        <div className={styles.status}>
          {(() => {
            const statusState = getStatusState()

            if (statusState === 'allOperational')
              return <p>All services are operational</p>

            if (statusState === 'noneOperational')
              return <p data-error>No services are operational</p>

            return <p data-error>Not all services are operational</p>
          })()}
        </div>

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
