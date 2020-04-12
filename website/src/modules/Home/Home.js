import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomeHero from './Hero';
import HomeFeatures from './Features';
import styles from './Home.module.css';


const headerClass = classnames('hero hero--primary', styles.heroBanner)

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <header className={headerClass}>
        <HomeHero />
      </header>
      <main>
        <HomeFeatures />
      </main>
    </Layout>
  );
}

export default Home;
