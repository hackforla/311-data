/* eslint no-shadow: ["error", { "allow": ["data", "errors"] }] */
import React from 'react';

const url = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE}`;

const useContentful = query => {
  const [data, setData] = React.useState(null);
  const [errors, setErrors] = React.useState(null);

  React.useEffect(() => {
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CONTENTFUL_TOKEN}`,
      },
      body: JSON.stringify({ query }),
    })
    .then(response => response.json())
    .then(({ data, errors }) => {
      if (errors) setErrors(errors);
      if (data) setData(data);
    })
    .catch(error => setErrors([error]));
  }, [query]);

  return { data, errors };
};

export default useContentful;
