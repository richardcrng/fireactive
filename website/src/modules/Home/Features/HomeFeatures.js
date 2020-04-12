import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Feature from '../../../lib/molecules/Feature'
import styles from '../Home.module.css';

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

function HomeFeatures() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {features.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeFeatures;
