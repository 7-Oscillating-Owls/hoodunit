import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

const ProductInformation = ({ productInfo, originalPrice, salePrice }) => {
  const currentPrice = salePrice === null ? (
    <div className={styles.price}>
      $
      {originalPrice}
    </div>
  ) : (
    <div>
      <div className={styles.salePrice}>
        $
        {salePrice}
      </div>
      <div className={styles.originalPrice}>
        {originalPrice}
      </div>
    </div>
  );

  return (
    <div className={styles.productInformation}>
      <div className={styles.ratings}>
        <span>Star Ratings </span>
        <span>Read All Reviews</span>
      </div>
      <div className={styles.category}>{productInfo.category}</div>
      <div className={styles.name}>{productInfo.name}</div>
      {currentPrice}
    </div>
  );
};

ProductInformation.propTypes = {
  productInfo: PropTypes.objectOf(PropTypes.number).isRequired,
  originalPrice: PropTypes.string.isRequired,
  salePrice: PropTypes.number.isRequired,
};

export default ProductInformation;
