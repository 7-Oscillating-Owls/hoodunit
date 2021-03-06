const express = require('express');
const path = require('path');
const axios = require('axios');

const token = require('../token.js');
const { apiCall, fetchProductWithStyles } = require('./apiHelper.js');

const app = express();
const port = 3000;

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, '/../client/dist')));
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.use('/products/*', express.static(path.join(__dirname, '..', 'public')));

app.get('/qa', (request, response) => {
  const { productId } = request.query;
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/qa/questions', {
    headers: {
      Authorization: token,
    },
    params: {
      product_id: `${productId}`,
    },
  })
    .then((res) => {
      response.send(res.data);
    })
    .catch(() => {
      response.send('error man');
    });
});

app.get('/answers', (request, response) => {
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/qa/questions/84310/answers', {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => {
      response.send(res.data);
    })
    .catch((error) => {
      response.send('error man');
    });
});

// Get product's review information
app.get('/reviews', (request, response) => {
  const { productId, page, sort } = request.query;
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/reviews', {
    headers: {
      Authorization: token,
    },
    params: {
      product_id: `${productId}`,
      count: 100,
      page: `${page}`,
      sort: `${sort}`,
    },
  })
    .then((result) => {
      response.send(result.data);
      response.status(200);
    })
    .catch((error) => {
      response.send('Server error fetching reviews: ', error);
      response.status(400);
    });
});

// Get product's review meta data
app.get('/reviews/meta', (request, response) => {
  const { productId } = request.query;
  axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/reviews/meta', {
    headers: {
      Authorization: token,
    },
    params: {
      product_id: productId,
    },
  })
    .then((result) => {
      response.send(result.data);
      response.status(200);
    })
    .catch((error) => {
      response.send('Server error fetching reviews meta data: ', error);
      response.status(400);
    });
});

// Reviews post request - adding review
app.post('/reviews', ((request, response) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/reviews', request.body, {
    headers: {
      Authorization: token,
    },
    params: {
      product_id: request.body.product_id,
    },
  })
    .then((res) => {
      console.log('Server successfully added review: ', res);
      response.sendStatus(201);
    })
    .catch((error) => {
      console.log('Server error posting review: ', error);
      response.sendStatus(500);
    });
}));

// Reviews put request - incrementing helpfulness
app.put('/reviews/:review_id/helpful', ((request, response) => {
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/reviews/${request.body.reviewId}/helpful`, null, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => {
      console.log('Server successfully updated review helpfulness: ', res);
      response.sendStatus(204);
    })
    .catch((error) => {
      console.log('Server error updating review helpfulness: ', error);
      response.sendStatus(500);
    });
}));

// Reviews put request - reporting
app.put('/reviews/:review_id/report', ((request, response) => {
  axios.put(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/reviews/${request.body.reviewId}/report`, null, {
    headers: {
      Authorization: token,
    },
  })
    .then((res) => {
      console.log('Server successfully reported review: ', res);
      response.sendStatus(204);
    })
    .catch((error) => {
      console.log('Server error with review reporting: ', error);
      response.sendStatus(500);
    });
}));

app.get('/api/products/:productId', (request, response) => {
  const { productId } = request.params;

  if (productId) {
    fetchProductWithStyles(productId)
      .then((result) => response.send(result))
      .catch((error) => response.status(400).send(error));
  }
});

app.get('/api/products/:productId/related', (request, response) => {
  const { productId } = request.params;

  if (!productId) {
    return response.status(400);
  }

  return apiCall(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/products/${productId}/related`)
    .then((relatedIds) => {
      const uniqRelatedIds = [...new Set(relatedIds.data)];
      // eslint-disable-next-line arrow-body-style
      const relatedProducts = uniqRelatedIds.map((relatedId) => {
        return fetchProductWithStyles(relatedId);
      });

      return Promise.all(relatedProducts);
    })
    .then((relatedProducts) => response.send(relatedProducts))
    .catch((error) => response.status(400).send(error));
});

app.post('/qa/postQuestion', (request, response) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/qa/questions',
    request.body,
    {
      headers: {
        Authorization: token,
      },
    })
    .then((result) => {
      console.log('post question success');
      response.sendStatus(201);
      // response.send('Added a question');
    })
    .catch((error) => {
      response.sendStatus(500);
      // response.send("Error posting question");
    });
});

/* post request to the api to create cart data */
app.post('/cart', (request, response) => {
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/cart', { sku_id: request.body.sku_id }, {
    headers: {
      Authorization: token,
    },
  })
    .then(() => {
      response.status(201);
    })
    .catch(() => {
      response.status(404);
    });
});

app.post('/qa/postAnswer', (req, res) => {
  console.log(req.body);
  const { body, name, email, questionId, photos } = req.body;
  console.log(req.query);
  const answerHeaders = {
    headers: {
      'User-Agent': 'request',
      Authorization: token,
    },
    question_id: questionId,
  };
  axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/qa/questions/84310/answers', {
    body, name, email, photos,
  }, answerHeaders)

    .then(() => { res.send('posted Answer'); })
    .catch((err) => {
      res.status(500).send(err);
    });
});

app.post('/api/interactions', (request, response) => {
  apiCall(
    'https://app-hrsei-api.herokuapp.com/api/fec2/hr-sfo/interactions',
    'post',
    request.body,
  )
    .then(() => response.sendStatus(201))
    .catch(() => response.sendStatus(422));
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
