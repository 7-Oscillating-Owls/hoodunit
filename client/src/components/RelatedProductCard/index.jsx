import React from 'react';
// import PropTypes from 'prop-types';
import {
  Link,
} from 'react-router-dom';

import styles from './RelatedProductCard.css';

const RelatedProductCard = ({
  id,
  name,
  category,
  description,
  defaultStyle,
  children,
}) => {
  let productPrice;
  let priceStyle;
  let secondPriceEle;

  if (defaultStyle.sale_price !== null) {
    productPrice = defaultStyle.sale_price;
    priceStyle = styles.salePrice;
    secondPriceEle = (<span className={styles.strikePrice}>{`$${defaultStyle.original_price}`}</span>);
  } else {
    productPrice = defaultStyle.original_price;
  }

  const priceEle = (
    <div className={styles.productPrice}>
      <span className={priceStyle}>{`$${productPrice} `}</span>
      {secondPriceEle}
    </div>
  );

  return (
    <article className={styles.relatedProductCard}>
      {children}
      <img
        className={styles.productImage}
        src={defaultStyle.photos[0].url}
        alt={`${defaultStyle.name} ${description}`}
      />
      <div className={styles.productCategory}>{category}</div>
      <div className={styles.productName}><Link to={`/products/${id}`} className={styles.productLink}>{name}</Link></div>
      {priceEle}
      <div className={styles.starRating}>Star Ratings</div>
    </article>
  );
};

// RelatedProductCard.propTypes = {
//   id: PropTypes.number.isRequired,
//   name: PropTypes.string.isRequired,
//   category: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   defaultStyle: PropTypes.objectOf().isRequired,
// };

export default RelatedProductCard;
