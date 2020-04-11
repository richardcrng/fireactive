import React from 'react'
import classnames from 'classnames';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './Feature.module.css'

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--6', styles.feature)}>
      {imgUrl && (
        <div style={{ padding: '1em' }}>
          <img style={{ width: '450px' }} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

export default Feature