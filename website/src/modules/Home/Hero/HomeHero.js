import React from 'react';
import classnames from 'classnames';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from '../Home.module.css';

const linkClass = classnames(
  'button button--outline button--secondary button--lg',
  styles.getStarted,
)

function HomeHero() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <div className="container">
      <h1 className="hero__title">{siteConfig.title}</h1>
      <p className="hero__subtitle">{siteConfig.tagline}</p>
      <div className={styles.buttons}>
        <Link
          className={linkClass}
          to={useBaseUrl('docs/overview')}
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default HomeHero;
