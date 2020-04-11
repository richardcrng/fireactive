import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Feature from '../lib/molecules/Feature'
import styles from './styles.module.css';

const features = [
  {
    title: <>Realtime Data</>,
    imageUrl: 'img/fireactive-realtime.gif',
    description: (
      <>
        <b>Stay in sync with your database.</b> By default, all data fetched updates to and from your Firebase Realtime Database, with no further setup needed.
      </>
    ),
  },
  {
    title: <>Strongly Typed</>,
    imageUrl: 'img/fireactive-typesafe.gif',
    description: (
      <>
        <b>Preserve your database structure.</b> Runtime errors in JavaScript and static errors in TypeScript if data doesn't conform to your schema.
      </>
    ),
  }
];

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/overview')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {/* <div style={{ textAlign: 'center', padding: '1em' }}>
          <img src={useBaseUrl('img/fireactive-syncing.gif')} />
        </div> */}
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
