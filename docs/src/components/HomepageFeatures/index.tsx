import React from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Easy to Use',
    Svg: require('@site/static/img/undraw_compage_mountain.svg').default,
    description: (
      <>
        Compage has been created from the ground up to be easily installed, sketched the diagrams and used to get your code generated quickly.
      </>
    ),
  },
  {
    title: 'Draw the diagrams',
    Svg: require('@site/static/img/undraw_compage_tree.svg').default,
    description: (
      <>
          Drag nodes and create edges between nodes as per your requirement.
      </>
    ),
  },
  {
    title: 'Generate code',
    Svg: require('@site/static/img/undraw_compage_react.svg').default,
    description: (
      <>
        Skeleton projects with some standard practices will be created out of the configuration supplied.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
